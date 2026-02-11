import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("DB Keys:", Object.keys(db));
    if (!db.aboutPage) {
        console.error("db.aboutPage is undefined! keys:", Object.keys(db));
        throw new Error("Database client not initialized correctly - missing aboutPage");
    }
    const aboutPage = await db.aboutPage.findUnique({
      where: { id: "global" }
    });

    if (!aboutPage) {
      // Return default values if not found
      return NextResponse.json({
        heroTitle: "Taste the Love in Every Bite",
        heroDescription: "Authentic, homemade flavors crafted with passion and tradition.",
        heroBackgroundUrl: "",
        heroBackgroundType: "image",
        storyTitle: "Our Story",
        storySubtitle: "Crafted with love, rooted in nature",
        storyContent: "Since 1985, MoM's NaturalFood has been dedicated to bringing the purest flavors of nature straight to your home. 100% natural, healthy, and crafted with love.",
        storyImageUrl: "",
        storyImageType: "image",
        missionTitle: "Our Mission",
        missionContent: "To provide families with healthy, natural food options without compromising on taste or quality.",
        missionImageUrl: "",
        missionImageType: "image",
        qualityTitle: "Quality You Can Trust",
        qualityDescription: "Pure. Natural. Authentic.",
        qualityBackgroundUrl: "",
        qualityBackgroundType: "image",
        values: []
      });
    }

    return NextResponse.json(aboutPage);
  } catch (error) {
    console.error("Error fetching about page:", error);
    return NextResponse.json({ error: "Failed to fetch about page content" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { 
      heroTitle, 
      heroDescription, 
      heroBackgroundUrl, 
      heroBackgroundType,
      storyTitle,
      storySubtitle,
      storyContent,
      storyImageUrl,
      storyImageType,
      missionTitle,
      missionContent,
      missionImageUrl,
      missionImageType,
      qualityTitle,
      qualityDescription,
      qualityBackgroundUrl,
      qualityBackgroundType,
      values
    } = body;

    const aboutPage = await db.aboutPage.upsert({
      where: { id: "global" },
      update: {
        heroTitle, 
        heroDescription, 
        heroBackgroundUrl, 
        heroBackgroundType,
        storyTitle,
        storySubtitle,
        storyContent,
        storyImageUrl,
        storyImageType,
        missionTitle,
        missionContent,
        missionImageUrl,
        missionImageType,
        qualityTitle,
        qualityDescription,
        qualityBackgroundUrl,
        qualityBackgroundType,
        values: values || []
      },
      create: {
        id: "global",
        heroTitle: heroTitle || "Taste the Love in Every Bite",
        heroDescription: heroDescription || "Authentic, homemade flavors crafted with passion and tradition.",
        heroBackgroundUrl,
        heroBackgroundType: heroBackgroundType || "image",
        storyTitle: storyTitle || "Our Story",
        storySubtitle: storySubtitle || "Crafted with love, rooted in nature",
        storyContent: storyContent || "Since 1985...",
        storyImageUrl,
        storyImageType: storyImageType || "image",
        missionTitle: missionTitle || "Our Mission",
        missionContent: missionContent || "To provide families...",
        missionImageUrl,
        missionImageType: missionImageType || "image",
        qualityTitle: qualityTitle || "Quality You Can Trust",
        qualityDescription: qualityDescription || "Pure. Natural. Authentic.",
        qualityBackgroundUrl,
        qualityBackgroundType: qualityBackgroundType || "image",
        values: values || []
      }
    });

    return NextResponse.json(aboutPage);
  } catch (error: any) {
    console.error("Error updating about page:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update about page content" },
      { status: 500 }
    );
  }
}
