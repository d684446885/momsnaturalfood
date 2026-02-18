import { db } from "@/lib/db";
import { LegalPagesClient } from "./legal-client";

// Trigger Rebuild - v1
export default async function LegalDashboardPage() {
  const pages = await db.legalPage.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold font-serif italic text-secondary tracking-tight">Legal Pages</h2>
        <p className="text-muted-foreground">
          Manage Shipping Info, Returns Policy, Privacy & Terms, and other legal content.
        </p>
      </div>
      <LegalPagesClient initialPages={pages} />
    </div>
  );
}
