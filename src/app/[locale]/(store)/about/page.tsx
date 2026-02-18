import { db } from "@/lib/db";
import { AboutClient } from "./about-client";

async function getAboutContent() {
  try {
    const aboutPage = await db.aboutPage.findUnique({
      where: { id: "global" }
    });
    return aboutPage;
  } catch (error) {
    console.error("Error fetching about content:", error);
    return null;
  }
}

export default async function AboutPage() {
  const [content, certifications] = await Promise.all([
    getAboutContent(),
    db.certification.findMany({
      orderBy: { order: "asc" }
    })
  ]);

  return <AboutClient content={content} certifications={certifications} />;
}
