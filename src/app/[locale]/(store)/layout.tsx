import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MobileBottomNav } from "@/components/mobile-nav";
import { FloatingChatWidget } from "@/components/floating-chat-widget";
import { db } from "@/lib/db";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

import { formatMediaUrl } from "@/lib/media";

export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
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
  const logoUrl = settings ? formatMediaUrl(settings.logoUrl, settings.r2PublicUrl, settings.r2BucketName as string, settings.r2AccountId as string) : "";

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Navbar 
        legalPages={legalPages} 
        logoUrl={logoUrl}
        businessName={settings?.businessName}
      />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <MobileBottomNav />
      <Footer 
        legalPages={legalPages} 
        businessName={settings?.businessName}
        newsletterEnabled={settings?.newsletterEnabled ?? true}
      />
      <FloatingChatWidget />
    </NextIntlClientProvider>
  );
}
