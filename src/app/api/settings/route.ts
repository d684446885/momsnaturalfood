import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = await db.settings.findUnique({
      where: { id: "global" }
    });
    
    if (!settings) {
      const defaultSettings = await db.settings.create({
        data: { 
          id: "global", 
          primaryColor: "#8B5E3C",
          secondaryColor: "#1E3A34",
          backgroundColor: "#FAF9F6",
          accentColor: "#D4AF37",
          uploadProvider: "vercel",
          defaultLanguage: "en"
        }
      });
      return NextResponse.json(defaultSettings);
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { 
      primaryColor, 
      secondaryColor, 
      backgroundColor, 
      accentColor,
      uploadProvider,
      r2AccountId,
      r2AccessKeyId,
      r2SecretAccessKey,
      r2BucketName,
      r2PublicUrl,
      googleClientId,
      googleClientSecret,
      authSecret,
      businessName,
      logoUrl,
      businessEmail,
      businessPhone,
      businessAddress,
      vercelBlobToken,
      defaultLanguage
    } = body;

    const data = {
      primaryColor: primaryColor || "#8B5E3C",
      secondaryColor: secondaryColor || "#1E3A34",
      backgroundColor: backgroundColor || "#FAF9F6",
      accentColor: accentColor || "#D4AF37",
      uploadProvider: uploadProvider || "vercel",
      r2AccountId,
      r2AccessKeyId,
      r2SecretAccessKey,
      r2BucketName,
      r2PublicUrl,
      googleClientId,
      googleClientSecret,
      authSecret,
      businessName,
      logoUrl,
      businessEmail,
      businessPhone,
      businessAddress,
      vercelBlobToken,
      defaultLanguage: defaultLanguage || "en"
    };

    console.log("Saving settings to DB:", JSON.stringify(data, (k, v) => k.includes('Token') || k.includes('Secret') || k.includes('Key') ? '***' : v));
    const settings = await db.settings.upsert({
      where: { id: "global" },
      update: data as any,
      create: {
        id: "global",
        ...(data as any)
      }
    });

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update settings" }, 
      { status: 500 }
    );
  }
}
