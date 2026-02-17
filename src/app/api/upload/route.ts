import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { db } from "@/lib/db";
import { v2 as cloudinary } from "cloudinary";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      return NextResponse.json(
        { error: "Invalid file type. Only image and video files are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 50MB." },
        { status: 400 }
      );
    }

    // Get settings
    const settings = await db.settings.findUnique({
      where: { id: "global" }
    });

    const provider = settings?.uploadProvider || "local";
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (provider === "cloudinary") {
      if (!settings?.cloudinaryCloudName || !settings?.cloudinaryApiKey || !settings?.cloudinaryApiSecret) {
        throw new Error("Cloudinary configuration missing in settings");
      }

      cloudinary.config({
        cloud_name: settings.cloudinaryCloudName,
        api_key: settings.cloudinaryApiKey,
        api_secret: settings.cloudinaryApiSecret,
      });

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "momsfood" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });

      return NextResponse.json({ url: (result as any).secure_url });
    } 
    
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

      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      await s3Client.send(
        new PutObjectCommand({
          Bucket: settings.r2BucketName,
          Key: fileName,
          Body: buffer,
          ContentType: file.type,
        })
      );

      const publicUrl = settings.r2PublicUrl 
        ? `${settings.r2PublicUrl.endsWith('/') ? settings.r2PublicUrl.slice(0, -1) : settings.r2PublicUrl}/${fileName}`
        : `https://${settings.r2BucketName}.${settings.r2AccountId}.r2.dev/${fileName}`;

      return NextResponse.json({ url: publicUrl });
    }

    // Local storage fallback
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const ext = file.name.split(".").pop() || "jpg";
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
    const filePath = path.join(uploadsDir, uniqueName);

    await writeFile(filePath, buffer);

    return NextResponse.json({ url: `/uploads/${uniqueName}` });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
