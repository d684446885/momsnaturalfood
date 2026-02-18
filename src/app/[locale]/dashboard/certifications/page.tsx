import { db } from "@/lib/db";
import { AdminCertificationsClient } from "./certifications-client";

export default async function CertificationsPage() {
  const certifications = await db.certification.findMany({
    orderBy: {
      order: "asc",
    },
  });

  return (
    <div className="space-y-6">
      <AdminCertificationsClient certifications={certifications} />
    </div>
  );
}
