import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { db } from "@/lib/db";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const legalPages = await db.legalPage.findMany({
    select: {
      id: true,
      title: true,
      slug: true
    },
    orderBy: {
      createdAt: "asc"
    }
  });

  const settings = await db.settings.findUnique({ where: { id: "global" } });

  return (
    <>
      <Navbar 
        legalPages={legalPages} 
        logoUrl={settings?.logoUrl}
        businessName={settings?.businessName}
      />
      <main className="flex-1">{children}</main>
      <Footer 
        legalPages={legalPages} 
        businessName={settings?.businessName}
      />
    </>
  );
}
