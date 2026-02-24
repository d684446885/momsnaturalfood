import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [settings, globalSettings] = await Promise.all([
      db.settings.findUnique({
        where: { id: "global" },
        select: {
          businessName: true,
          businessEmail: true,
          businessPhone: true,
          businessAddress: true,
          shippingFee: true,
          freeShippingThreshold: true,
          logoUrl: true,
          primaryColor: true,
          secondaryColor: true,
          accentColor: true,
          defaultLanguage: true,
          cashOnDeliveryEnabled: true,
        }
      }),
      db.settings.findUnique({ where: { id: "global" } })
    ]);
    
    if (settings && settings.logoUrl) {
      const { formatMediaUrl } = await import("@/lib/media");
      settings.logoUrl = formatMediaUrl(
        settings.logoUrl, 
        globalSettings?.r2PublicUrl, 
        globalSettings?.r2BucketName as string, 
        globalSettings?.r2AccountId as string
      );
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch public settings" }, { status: 500 });
  }
}
