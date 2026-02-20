import { NewsletterClient } from "./newsletter-client";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function NewsletterPage() {
  const subscribers = await db.newsletterSubscription.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <NewsletterClient initialSubscribers={JSON.parse(JSON.stringify(subscribers))} />;
}
