import { db } from "@/lib/db";
import { FAQClient } from "./faq-client";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: "Footer" });
  return {
    title: `${t('customerService.faq')} | MoM's NaturalFood`,
    description: "Frequently Asked Questions about our natural and wholesome products."
  };
}

export default async function FAQPage() {
  const categories = await db.faqCategory.findMany({
    include: {
      faqs: {
        orderBy: {
          order: "asc"
        }
      }
    },
    orderBy: {
      order: "asc"
    }
  });

  return <FAQClient categories={categories} />;
}
