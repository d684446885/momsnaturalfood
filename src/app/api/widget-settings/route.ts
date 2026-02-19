import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Public endpoint to fetch chat widget settings
export async function GET() {
  try {
    const settings = await db.settings.findUnique({
      where: { id: "global" },
      select: {
        whatsappNumber: true,
        instagramUrl: true,
        messengerUrl: true,
        chatWidgetEnabled: true,
        businessName: true,
      },
    });

    if (!settings) {
      return NextResponse.json({
        whatsappNumber: null,
        instagramUrl: null,
        messengerUrl: null,
        chatWidgetEnabled: true,
        businessName: null,
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching widget settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}
