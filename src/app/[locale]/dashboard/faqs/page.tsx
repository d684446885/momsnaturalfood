import { db } from "@/lib/db";
import { FaqsClient } from "./faqs-client";

export default async function FaqsPage() {
  const categories = await db.faqCategory.findMany({
    include: {
      _count: {
        select: { faqs: true }
      }
    },
    orderBy: {
      order: "asc"
    }
  });

  const faqs = await db.faq.findMany({
    include: {
      category: true
    },
    orderBy: {
      order: "asc"
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold font-serif italic text-secondary tracking-tight">FAQ Management</h2>
        <p className="text-muted-foreground">
          Manage your website's frequently asked questions and categories.
        </p>
      </div>
      <FaqsClient initialCategories={categories} initialFaqs={faqs} />
    </div>
  );
}
