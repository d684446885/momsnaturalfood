import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const settings = await db.settings.findUnique({
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
    });
    
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch public settings" }, { status: 500 });
  }
}
