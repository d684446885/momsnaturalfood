import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Name, email, subject, and message are required." },
        { status: 400 }
      );
    }

    // Get IP address from headers
    const forwarded = request.headers.get("x-forwarded-for");
    const ipAddress = forwarded
      ? forwarded.split(",")[0].trim()
      : request.headers.get("x-real-ip") || "unknown";

    // Try to get location from IP using free API
    let location = "Unknown";
    try {
      if (ipAddress && ipAddress !== "unknown" && ipAddress !== "::1" && ipAddress !== "127.0.0.1") {
        const geoRes = await fetch(`http://ip-api.com/json/${ipAddress}?fields=city,country`, {
          signal: AbortSignal.timeout(3000),
        });
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          if (geoData.city && geoData.country) {
            location = `${geoData.city}, ${geoData.country}`;
          }
        }
      }
    } catch {
      // Silently ignore geolocation errors
    }

    const contactMessage = await db.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject,
        message,
        ipAddress,
        location,
      },
    });

    return NextResponse.json({ success: true, id: contactMessage.id });
  } catch (error: any) {
    console.error("Error saving contact message:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send message" },
      { status: 500 }
    );
  }
}
