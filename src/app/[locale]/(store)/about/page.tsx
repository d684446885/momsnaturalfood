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

import { formatMediaUrl } from "@/lib/media";

export default async function AboutPage() {
  const [content, certifications, settings] = await Promise.all([
    getAboutContent(),
    db.certification.findMany({
      orderBy: { order: "asc" }
    }),
    db.settings.findUnique({ where: { id: "global" } })
  ]);

  const formattedContent = content ? {
    ...content,
    heroBackgroundUrl: formatMediaUrl(content.heroBackgroundUrl, settings?.r2PublicUrl, settings?.r2BucketName as string, settings?.r2AccountId as string),
    storyImageUrl: formatMediaUrl(content.storyImageUrl, settings?.r2PublicUrl, settings?.r2BucketName as string, settings?.r2AccountId as string),
    missionImageUrl: formatMediaUrl(content.missionImageUrl, settings?.r2PublicUrl, settings?.r2BucketName as string, settings?.r2AccountId as string),
    qualityBackgroundUrl: formatMediaUrl(content.qualityBackgroundUrl, settings?.r2PublicUrl, settings?.r2BucketName as string, settings?.r2AccountId as string),
  } : null;

  const formattedCertifications = certifications.map((cert) => ({
    ...cert,
    imageUrl: formatMediaUrl(cert.imageUrl, settings?.r2PublicUrl, settings?.r2BucketName as string, settings?.r2AccountId as string),
  }));

  return <AboutClient content={formattedContent} certifications={formattedCertifications} />;
}
