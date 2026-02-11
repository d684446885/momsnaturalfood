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

export default async function ContactPage() {
  const content = await getContactContent();
  return <ContactClient content={content} />;
}
