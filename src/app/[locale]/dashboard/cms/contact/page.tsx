import { db } from "@/lib/db";
import { ContactCMSClient } from "./contact-client";

async function getContactContent() {
  try {
    const contactPage = await db.contactPage.findUnique({
      where: { id: "global" }
    });

    if (!contactPage) {
      return {
        heroTitle: "Get in Touch",
        heroSubtitle: "We'd Love to Hear From You",
        heroDescription: "Have a question about our products or want to say hello? Drop us a line and we'll get back to you as soon as possible.",
        email: "hello@momsnaturalfoods.com",
        phone: "+31 (0) 612345678",
        address: "Amsterdam, Netherlands",
        hours: "Mon-Fri: 9:00 - 18:00",
        socialLinks: [
          { platform: "Instagram", url: "https://instagram.com", icon: "Instagram" },
          { platform: "Facebook", url: "https://facebook.com", icon: "Facebook" }
        ],
        mapEmbedUrl: ""
      };
    }

    return contactPage;
  } catch (error) {
    return {
      heroTitle: "Get in Touch",
      heroSubtitle: "We'd Love to Hear From You",
      heroDescription: "Have a question about our products or want to say hello? Drop us a line and we'll get back to you as soon as possible.",
      email: "hello@momsnaturalfoods.com",
      phone: "+31 (0) 612345678",
      address: "Amsterdam, Netherlands",
      hours: "Mon-Fri: 9:00 - 18:00",
      socialLinks: [
        { platform: "Instagram", url: "https://instagram.com", icon: "Instagram" },
        { platform: "Facebook", url: "https://facebook.com", icon: "Facebook" }
      ],
      mapEmbedUrl: ""
    };
  }
}

export default async function ContactCMSPage() {
  const initialContent = await getContactContent();
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <ContactCMSClient initialContent={initialContent} />
    </div>
  );
}
