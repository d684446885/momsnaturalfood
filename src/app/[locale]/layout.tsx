import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";
import { DynamicTheme } from "@/components/dynamic-theme";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { PwaRegister } from "@/components/pwa-register";
import { PwaInstallButton } from "@/components/pwa-install-button";

async function getSettings() {
  try {
    const settings = await db.settings.findUnique({ where: { id: "global" } });
    
    if (!settings) {
      return { 
        primaryColor: "#8B5E3C",
        secondaryColor: "#1E3A34",
        backgroundColor: "#FAF9F6",
        accentColor: "#D4AF37",
        shippingFee: 0,
        freeShippingThreshold: 0,
        cashOnDeliveryEnabled: true
      };
    }

    // Convert Decimal objects to numbers for Client Component serialization
    return {
      ...settings,
      shippingFee: Number(settings.shippingFee) || 0,
      freeShippingThreshold: Number(settings.freeShippingThreshold) || 0,
      updatedAt: settings.updatedAt.toISOString(), // Also good to serialize dates
    };
  } catch (err) {
    return { 
      primaryColor: "#8B5E3C",
      secondaryColor: "#1E3A34",
      backgroundColor: "#FAF9F6",
      accentColor: "#D4AF37",
      shippingFee: 0,
      freeShippingThreshold: 0
    };
  }
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  const settings = await getSettings();

  const isRtl = locale === 'ar';

  return (
    <html lang={locale} dir={isRtl ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="theme-color" content="#1E3A34" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Mom's Natural Foods" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} font-sans antialiased`}
      >
        <DynamicTheme settings={settings as any} />
        <PwaRegister />
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Providers>
            {children}
            <PwaInstallButton variant="banner" />
            <Toaster />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

