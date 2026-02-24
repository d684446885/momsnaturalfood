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

import { formatMediaUrl } from "@/lib/media";

export default async function CertificationsPage() {
  const [certifications, settings] = await Promise.all([
    db.certification.findMany({
      orderBy: {
        order: "asc",
      },
    }),
    db.settings.findUnique({ where: { id: "global" } })
  ]);

  const formattedCertifications = certifications.map((cert) => ({
    ...cert,
    imageUrl: formatMediaUrl(cert.imageUrl, settings?.r2PublicUrl, settings?.r2BucketName as string, settings?.r2AccountId as string),
  }));

  return (
    <div className="pt-8">
      <CertificationsClient 
        certifications={formattedCertifications}
      />
    </div>
  );
}
