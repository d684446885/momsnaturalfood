import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
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
          accentColor: "#D4AF37"
        }
      });
      return NextResponse.json(defaultSettings);
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { 
      primaryColor, 
      secondaryColor, 
      backgroundColor, 
      accentColor,
      r2AccountId,
      r2AccessKeyId,
      r2SecretAccessKey,
      r2BucketName,
      r2PublicUrl
    } = body;

    const settings = await db.settings.upsert({
      where: { id: "global" },
      update: { 
        primaryColor, 
        secondaryColor, 
        backgroundColor, 
        accentColor,
        r2AccountId,
        r2AccessKeyId,
        r2SecretAccessKey,
        r2BucketName,
        r2PublicUrl
      },
      create: { 
        id: "global", 
        primaryColor: primaryColor || "#8B5E3C", 
        secondaryColor: secondaryColor || "#1E3A34", 
        backgroundColor: backgroundColor || "#FAF9F6", 
        accentColor: accentColor || "#D4AF37",
        r2AccountId,
        r2AccessKeyId,
        r2SecretAccessKey,
        r2BucketName,
        r2PublicUrl
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
