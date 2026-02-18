import { db } from "@/lib/db";
import { CertificationsClient } from "./certifications-client";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  
  return {
    title: `Certifications | ${t('title')}`,
    description: "Discover our quality standards and certifications at MoM's NaturalFood.",
  };
}

export default async function CertificationsPage() {
  const certifications = await db.certification.findMany({
    orderBy: {
      order: "asc",
    },
  });

  return (
    <div className="pt-8">
      <CertificationsClient 
        certifications={certifications}
      />
    </div>
  );
}
