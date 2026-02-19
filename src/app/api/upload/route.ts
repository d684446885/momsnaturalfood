import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { S3Client, PutObjectCommand, CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder") as string | null;

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileObject = file as File;
    console.log(`Received file: ${fileObject.name}, size: ${fileObject.size} bytes, type: ${fileObject.type}${folder ? `, folder: ${folder}` : ""}`);

    // Validate file type
    if (!fileObject.type.startsWith("image/") && !fileObject.type.startsWith("video/")) {
      return NextResponse.json(
        { error: "Invalid file type. Only image and video files are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (fileObject.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 50MB." },
        { status: 400 }
      );
    }

    // Get settings
    const settings = (await db.settings.findUnique({
      where: { id: "global" }
    })) as any;

    // Validate Cloudflare R2 configuration
    if (!settings?.r2AccountId || !settings?.r2AccessKeyId || !settings?.r2SecretAccessKey || !settings?.r2BucketName) {
      return NextResponse.json(
        { error: "Cloudflare R2 is not configured. Please go to Dashboard → Settings → File Storage and enter your R2 credentials." },
        { status: 500 }
      );
    }

    const bytes = await fileObject.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const s3Client = new S3Client({
      region: "auto",
      endpoint: `https://${settings.r2AccountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: settings.r2AccessKeyId,
        secretAccessKey: settings.r2SecretAccessKey,
      },
    });

    const baseFileName = `${Date.now()}-${fileObject.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const fileName = folder ? `${folder.endsWith('/') ? folder : folder + '/'}${baseFileName}` : baseFileName;
    
    try {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: settings.r2BucketName,
          Key: fileName,
          Body: buffer,
          ContentType: fileObject.type,
        })
      );
    } catch (r2Error: any) {
      console.error("Cloudflare R2 upload failed:", r2Error);
      return NextResponse.json(
        { error: `Cloudflare R2 upload failed: ${r2Error.message || "Connection error"}. Please check your R2 credentials in Dashboard → Settings.` },
        { status: 500 }
      );
    }

    const publicUrl = settings.r2PublicUrl 
      ? `${settings.r2PublicUrl.endsWith('/') ? settings.r2PublicUrl.slice(0, -1) : settings.r2PublicUrl}/${fileName}`
      : `https://${settings.r2BucketName}.${settings.r2AccountId}.r2.dev/${fileName}`;

    return NextResponse.json({ url: publicUrl });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    // Get settings to get R2 details
    const settings = (await db.settings.findUnique({
      where: { id: "global" }
    })) as any;

    if (!settings?.r2AccountId || !settings?.r2AccessKeyId || !settings?.r2SecretAccessKey || !settings?.r2BucketName) {
      return NextResponse.json({ error: "R2 not configured" }, { status: 500 });
    }

    // Extract key from URL
    let key = "";
    if (settings.r2PublicUrl) {
      const publicUrl = settings.r2PublicUrl.endsWith('/') ? settings.r2PublicUrl : settings.r2PublicUrl + '/';
      key = url.replace(publicUrl, "");
    } else {
      const baseUrl = `https://${settings.r2BucketName}.${settings.r2AccountId}.r2.dev/`;
      key = url.replace(baseUrl, "");
    }

    if (!key) {
      return NextResponse.json({ error: "Could not extract key from URL" }, { status: 400 });
    }

    const s3Client = new S3Client({
      region: "auto",
      endpoint: `https://${settings.r2AccountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: settings.r2AccessKeyId,
        secretAccessKey: settings.r2SecretAccessKey,
      },
    });

    const trashKey = `trash/${key.replace(/^trash\//, "")}`;

    try {
      // 1. Copy to trash
      await s3Client.send(
        new CopyObjectCommand({
          Bucket: settings.r2BucketName,
          CopySource: `${settings.r2BucketName}/${key}`,
          Key: trashKey,
        })
      );

      // 2. Delete original
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: settings.r2BucketName,
          Key: key,
        })
      );

      console.log(`Moved file to trash: ${key} -> ${trashKey}`);
      return NextResponse.json({ success: true, message: "File moved to trash" });
    } catch (s3Error: any) {
      console.error("Cloudflare R2 operation failed:", s3Error);
      return NextResponse.json(
        { error: `R2 operation failed: ${s3Error.message}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process request" },
      { status: 500 }
    );
  }
}
