import { db } from "@/lib/db";
import { CertificationsCMSClient } from "./certifications-client";

async function getCertificationsContent() {
  try {
    const content = await db.certificationPage.findUnique({
      where: { id: "global" }
    });
    
    return content || {
        heroTitle: "Our Certifications",
        heroSubtitle: "Quality Guaranteed",
        heroDescription: "At MoM's NaturalFood, purity is our promise. Our certifications are a testament to our dedication to providing you with the highest quality natural foods.",
        heroBackgroundUrl: "",
        heroBackgroundType: "image",
    };
  } catch (error) {
    console.error("Error fetching certification page content:", error);
    return {
        heroTitle: "Our Certifications",
        heroSubtitle: "Quality Guaranteed",
        heroDescription: "At MoM's NaturalFood, purity is our promise. Our certifications are a testament to our dedication to providing you with the highest quality natural foods.",
        heroBackgroundUrl: "",
        heroBackgroundType: "image",
    };
  }
}

export default async function CertificationsCMSPage() {
  const content = await getCertificationsContent();
  return <CertificationsCMSClient initialContent={content} />;
}
