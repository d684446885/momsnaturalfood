import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// Default gateway configurations
const GATEWAY_DEFAULTS: Record<string, any> = {
  mollie: {
    provider: "mollie",
    enabled: false,
    mode: "test",
    credentials: {
      testApiKey: "",
      liveApiKey: "",
      profileId: "",
    },
    settings: {
      methods: ["ideal", "creditcard", "bancontact", "paypal", "applepay"],
    },
  },
  stripe: {
    provider: "stripe",
    enabled: false,
    mode: "test",
    credentials: {
      testPublishableKey: "",
      testSecretKey: "",
      livePublishableKey: "",
      liveSecretKey: "",
      webhookSecret: "",
    },
    settings: {
      methods: ["card", "ideal", "bancontact", "sepa_debit"],
    },
  },
  paypal: {
    provider: "paypal",
    enabled: false,
    mode: "test",
    credentials: {
      sandboxClientId: "",
      sandboxClientSecret: "",
      liveClientId: "",
      liveClientSecret: "",
    },
    settings: {
      brandName: "Mom's Natural Foods",
      currency: "EUR",
    },
  },
};

export async function GET() {
  try {
    const gateways = await db.paymentGateway.findMany({
      orderBy: { createdAt: "asc" },
    });

    // If no gateways exist, return defaults for all three
    if (gateways.length === 0) {
      return NextResponse.json(
        Object.values(GATEWAY_DEFAULTS).map((gw) => ({
          ...gw,
          id: null,
        }))
      );
    }

    // Merge with defaults for any missing gateways
    const result = Object.keys(GATEWAY_DEFAULTS).map((provider) => {
      const existing = gateways.find((g) => g.provider === provider);
      if (existing) {
        return {
          ...existing,
          credentials:
            typeof existing.credentials === "string"
              ? JSON.parse(existing.credentials)
              : existing.credentials,
          settings:
            typeof existing.settings === "string"
              ? JSON.parse(existing.settings)
              : existing.settings,
        };
      }
      return { ...GATEWAY_DEFAULTS[provider], id: null };
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error fetching payment gateways:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch payment gateways" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { provider, enabled, mode, credentials, settings } = body;

    if (!provider || !["mollie", "stripe", "paypal"].includes(provider)) {
      return NextResponse.json(
        { error: "Invalid payment provider" },
        { status: 400 }
      );
    }

    const gateway = await db.paymentGateway.upsert({
      where: { provider },
      update: {
        enabled: enabled ?? false,
        mode: mode || "test",
        credentials: credentials || {},
        settings: settings || {},
      },
      create: {
        provider,
        enabled: enabled ?? false,
        mode: mode || "test",
        credentials: credentials || {},
        settings: settings || {},
      },
    });

    return NextResponse.json(gateway);
  } catch (error: any) {
    console.error("Error updating payment gateway:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update payment gateway" },
      { status: 500 }
    );
  }
}
