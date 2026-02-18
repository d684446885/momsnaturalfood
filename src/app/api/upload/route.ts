import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { db } from "@/lib/db";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { put } from "@vercel/blob";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileObject = file as File;
    console.log(`Received file: ${fileObject.name}, size: ${fileObject.size} bytes, type: ${fileObject.type}`);

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

    const provider = settings?.uploadProvider || "local";
    const bytes = await fileObject.arrayBuffer();
    const buffer = Buffer.from(bytes);

    
    if (provider === "r2") {
      if (!settings?.r2AccountId || !settings?.r2AccessKeyId || !settings?.r2SecretAccessKey || !settings?.r2BucketName) {
        throw new Error("Cloudflare R2 configuration missing in settings");
      }

      const s3Client = new S3Client({
        region: "auto",
        endpoint: `https://${settings.r2AccountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: settings.r2AccessKeyId,
          secretAccessKey: settings.r2SecretAccessKey,
        },
      });

      const fileName = `${Date.now()}-${fileObject.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      await s3Client.send(
        new PutObjectCommand({
          Bucket: settings.r2BucketName,
          Key: fileName,
          Body: buffer,
          ContentType: fileObject.type,
        })
      );

      const publicUrl = settings.r2PublicUrl 
        ? `${settings.r2PublicUrl.endsWith('/') ? settings.r2PublicUrl.slice(0, -1) : settings.r2PublicUrl}/${fileName}`
        : `https://${settings.r2BucketName}.${settings.r2AccountId}.r2.dev/${fileName}`;

      return NextResponse.json({ url: publicUrl });
    }
    
    if (provider === "local") {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (err) {
        // Directory already exists or other error
      }
      
      const fileName = `${Date.now()}-${fileObject.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);
      
      const publicUrl = `/uploads/${fileName}`;
      return NextResponse.json({ url: publicUrl });
    }
    
    if (provider === "vercel") {
      if (!settings?.vercelBlobToken) {
        throw new Error("Vercel Blob token missing in settings");
      }

      console.log(`Uploading to Vercel Blob with token: ${settings.vercelBlobToken?.substring(0, 15)}...`);
      const fileName = `${Date.now()}-${fileObject.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const blob = await put(fileName, buffer, {
        access: 'public',
        token: settings.vercelBlobToken || undefined,
        contentType: fileObject.type,
      });

      return NextResponse.json({ url: blob.url });
    }

    throw new Error(`Upload provider "${provider}" is not configured or supported.`);
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
