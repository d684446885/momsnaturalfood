import { db } from "@/lib/db";
import { ContactClient } from "./contact-client";
import { Metadata } from "next";

async function getContactContent() {
  try {
    const content = await db.contactPage.findUnique({
      where: { id: "global" }
    });
    return content;
  } catch (error) {
    return null;
  }
}

export const metadata: Metadata = {
  title: "Contact Us | MoM's Natural Foods",
  description: "Get in touch with MoM's Natural Foods. We'd love to hear from you."
};

import { formatMediaUrl } from "@/lib/media";

export default async function ContactPage() {
  const [content, settings] = await Promise.all([
    getContactContent(),
    db.settings.findUnique({ where: { id: "global" } })
  ]);

  const formattedContent = content ? {
    ...content,
    heroBackgroundUrl: formatMediaUrl(content.heroBackgroundUrl, settings?.r2PublicUrl, settings?.r2BucketName as string, settings?.r2AccountId as string),
  } : null;

  return <ContactClient content={formattedContent} />;
}
