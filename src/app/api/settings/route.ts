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
      const defaultData = { 
          id: "global", 
          primaryColor: "#8B5E3C",
          secondaryColor: "#766645",
          backgroundColor: "#FAF9F6",
          accentColor: "#D4AF3786",
          navbarColor: "#FDFCFB",
          footerColor: "#F3EFE7",
          sidebarColor: "#FAF9F6",
          textColor: "#665333",
          buttonColor: "#8B5E3C",
          buttonTextColor: "#FAF9F6",
          buttonHoverColor: "#7d6036",
          buttonHoverTextColor: "#FAF9F6",
          defaultLanguage: "en"
        };

      const defaultSettings = await db.settings.create({
        data: defaultData
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
      navbarColor,
      footerColor,
      sidebarColor,
      textColor,
      buttonColor,
      buttonTextColor,
      buttonHoverColor,
      buttonHoverTextColor,

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
      defaultLanguage,
      whatsappNumber,
      instagramUrl,
      messengerUrl,
      chatWidgetEnabled,
      shippingFee,
      freeShippingThreshold
    } = body;

    const data: any = {};
    
    // List all fields we want to handle
    const fields = [
      'primaryColor', 'secondaryColor', 'backgroundColor', 'accentColor',
      'navbarColor', 'footerColor', 'sidebarColor', 'textColor',
      'buttonColor', 'buttonTextColor', 'buttonHoverColor', 'buttonHoverTextColor',
      'r2AccountId', 'r2AccessKeyId', 'r2SecretAccessKey', 'r2BucketName', 'r2PublicUrl',
      'googleClientId', 'googleClientSecret', 'authSecret',
      'businessName', 'logoUrl', 'businessEmail', 'businessPhone', 'businessAddress',
      'defaultLanguage', 'whatsappNumber', 'instagramUrl', 'messengerUrl', 'chatWidgetEnabled',
      'shippingFee', 'freeShippingThreshold', 'cashOnDeliveryEnabled', 'newsletterEnabled'
    ];

    // Only add to data if the field exists in body
    fields.forEach(field => {
      if (body[field] !== undefined) {
        data[field] = body[field];
      }
    });

    // Special handling for defaults if the record doesn't exist yet
    const defaults = {
      primaryColor: "#8B5E3C",
      secondaryColor: "#1E3A34",
      backgroundColor: "#FAF9F6",
      accentColor: "#D4AF37",
      navbarColor: "#1E3A34",
      footerColor: "#1E3A34",
      sidebarColor: "#FAF9F6",
      textColor: "#1E3A34",
      buttonColor: "#8B5E3C",
      buttonTextColor: "#FAF9F6",
      buttonHoverColor: "#7d6036",
      buttonHoverTextColor: "#FAF9F6",
      defaultLanguage: "en",
      chatWidgetEnabled: true,
      shippingFee: 0,
      freeShippingThreshold: 0,
      cashOnDeliveryEnabled: true,
      newsletterEnabled: true
    };

    console.log("Saving settings to DB:", JSON.stringify(data, (k, v) => k.includes('Token') || k.includes('Secret') || k.includes('Key') ? '***' : v));

    const settings = await db.settings.upsert({
      where: { id: "global" },
      update: data,
      create: {
        id: "global",
        ...defaults,
        ...data
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
