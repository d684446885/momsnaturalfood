import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  try {
    const content = await db.certificationPage.findUnique({
      where: { id: "global" }
    });

    if (!content) {
      return NextResponse.json({
        heroTitle: "Our Certifications",
        heroSubtitle: "Quality Guaranteed",
        heroDescription: "At MoM's NaturalFood, purity is our promise. Our certifications are a testament to our dedication to providing you with the highest quality natural foods.",
        heroBackgroundUrl: "",
        heroBackgroundType: "image",
      });
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error("Error fetching certification page CMS content:", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { 
      heroTitle,
      heroSubtitle,
      heroDescription,
      heroBackgroundUrl,
      heroBackgroundType
    } = body;

    const content = await db.certificationPage.upsert({
      where: { id: "global" },
      update: {
        heroTitle,
        heroSubtitle,
        heroDescription,
        heroBackgroundUrl,
        heroBackgroundType
      },
      create: {
        id: "global",
        heroTitle: heroTitle || "Our Certifications",
        heroSubtitle: heroSubtitle || "Quality Guaranteed",
        heroDescription: heroDescription || "At MoM's NaturalFood...",
        heroBackgroundUrl,
        heroBackgroundType: heroBackgroundType || "image"
      }
    });

    return NextResponse.json(content);
  } catch (error: any) {
    console.error("Error updating certification page CMS content:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update content" },
      { status: 500 }
    );
  }
}
