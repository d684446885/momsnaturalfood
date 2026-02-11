import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const contactPage = await db.contactPage.findUnique({
      where: { id: "global" }
    });

    if (!contactPage) {
      // Return default values
      return NextResponse.json({
        heroTitle: "Get in Touch",
        heroSubtitle: "We'd Love to Hear From You",
        heroDescription: "Have a question about our products or want to say hello? Drop us a line and we'll get back to you as soon as possible.",
        heroBackgroundUrl: "",
        heroBackgroundType: "image",
        email: "hello@momsnaturalfoods.com",
        phone: "+31 (0) 612345678",
        address: "Keienbergweg 38A, 1101 GC Amsterdam, Netherlands",
        hours: "Mon-Fri: 9:00 - 18:00",
        socialLinks: [
          { platform: "Instagram", url: "https://instagram.com", icon: "Instagram" },
          { platform: "Facebook", url: "https://facebook.com", icon: "Facebook" }
        ],
        mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m19!1m8!1m3!1d9757.60339774902!2d4.9328378!3d52.3087284!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m0!4m5!1s0x47c60ba3a4107e1b%3A0x21d333abaae77ca0!2sKeienbergweg%2038A%2C%201101%20GC%20Amsterdam%2C%20Netherlands!3m2!1d52.3087284!2d4.9328378!5e0!3m2!1sen!2s!4v1770580045489!5m2!1sen!2s"
      });
    }

    return NextResponse.json(contactPage);
  } catch (error) {
    console.error("Error fetching contact page:", error);
    return NextResponse.json({ error: "Failed to fetch contact page content" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { 
      heroTitle,
      heroSubtitle,
      heroDescription,
      heroBackgroundUrl,
      heroBackgroundType,
      email,
      phone,
      address,
      hours,
      socialLinks,
      mapEmbedUrl
    } = body;

    const contactPage = await db.contactPage.upsert({
      where: { id: "global" },
      update: {
        heroTitle,
        heroSubtitle,
        heroDescription,
        heroBackgroundUrl,
        heroBackgroundType,
        email,
        phone,
        address,
        hours,
        socialLinks: socialLinks || [],
        mapEmbedUrl
      },
      create: {
        id: "global",
        heroTitle: heroTitle || "Get in Touch",
        heroSubtitle: heroSubtitle || "We'd Love to Hear From You",
        heroDescription: heroDescription || "Have a question about our products...",
        heroBackgroundUrl: heroBackgroundUrl || "",
        heroBackgroundType: heroBackgroundType || "image",
        email: email || "hello@momsnaturalfoods.com",
        phone: phone || "+31 (0) 612345678",
        address: address || "Amsterdam, Netherlands",
        hours: hours || "Mon-Fri: 9:00 - 18:00",
        socialLinks: socialLinks || [],
        mapEmbedUrl: mapEmbedUrl || ""
      }
    });

    return NextResponse.json(contactPage);
  } catch (error: any) {
    console.error("Error updating contact page:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update contact page content" },
      { status: 500 }
    );
  }
}
