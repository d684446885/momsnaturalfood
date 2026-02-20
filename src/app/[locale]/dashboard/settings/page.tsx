import { db } from "@/lib/db";
import { SettingsClient } from "./settings-client";

async function getSettings() {
  try {
    const settings = await db.settings.findUnique({
      where: { id: "global" }
    });
    if (!settings) {
      return { 
        primaryColor: "#8B5E3C",
        secondaryColor: "#1E3A34",
        backgroundColor: "#FAF9F6",
        accentColor: "#D4AF37",
        businessName: null,
        logoUrl: null,
        businessEmail: null,
        businessPhone: null,
        businessAddress: null,
        googleClientId: null,
        googleClientSecret: null,
        authSecret: null,
        r2AccountId: null,
        r2AccessKeyId: null,
        r2SecretAccessKey: null,
        r2BucketName: null,
        r2PublicUrl: null,
        defaultLanguage: "en",
        shippingFee: 0,
        freeShippingThreshold: 0,
        cashOnDeliveryEnabled: true
      };
    }

    return {
      ...settings,
      shippingFee: Number(settings.shippingFee) || 0,
      freeShippingThreshold: Number(settings.freeShippingThreshold) || 0,
      updatedAt: settings.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error("Error fetching settings:", error);
    return { 
      primaryColor: "#8B5E3C",
      secondaryColor: "#1E3A34",
      backgroundColor: "#FAF9F6",
      accentColor: "#D4AF37",
      businessName: null,
      logoUrl: null,
      businessEmail: null,
      businessPhone: null,
      businessAddress: null,
      googleClientId: null,
      googleClientSecret: null,
      authSecret: null,
      r2AccountId: null,
      r2AccessKeyId: null,
      r2SecretAccessKey: null,
      r2BucketName: null,
      r2PublicUrl: null,
      defaultLanguage: "en",
      cashOnDeliveryEnabled: true
    };
  }
}

export default async function SettingsPage() {
  const settings = await getSettings();

  return <SettingsClient initialSettings={settings as any} />;
}
