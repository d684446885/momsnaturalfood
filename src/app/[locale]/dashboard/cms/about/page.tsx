import { db } from "@/lib/db";
import { AboutCMSClient } from "./about-client";

async function getAboutContent() {
  try {
    const aboutPage = await db.aboutPage.findUnique({
      where: { id: "global" }
    });
    
    return aboutPage || {
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
        values: []
    };
  } catch (error) {
    console.error("Error fetching about page:", error);
    return {
        heroTitle: "Taste the Love in Every Bite",
        heroDescription: "Authentic, homemade flavors crafted with passion and tradition.",
        heroBackgroundUrl: "",
        heroBackgroundType: "image",
        storyTitle: "Our Story",
        storySubtitle: "Crafted with love, rooted in nature",
        storyContent: "Since 1985...",
        storyImageUrl: "",
        storyImageType: "image",
        missionTitle: "Our Mission",
        missionContent: "To provide families...",
        missionImageUrl: "",
        missionImageType: "image",
        values: []
    };
  }
}

export default async function AboutCMSPage() {
  const content = await getAboutContent();
  return <AboutCMSClient initialContent={content as any} />;
}
