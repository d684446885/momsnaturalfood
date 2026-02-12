"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Loader2,
  Save,
  CreditCard,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  Settings2,
} from "lucide-react";

// Provider brand colors & logos
const PROVIDER_META: Record<string, { name: string; color: string; icon: string; description: string }> = {
  mollie: {
    name: "Mollie",
    color: "bg-black text-white",
    icon: "💎",
    description: "European payment gateway with iDEAL, credit cards, Bancontact, and more.",
  },
  stripe: {
    name: "Stripe",
    color: "bg-indigo-600 text-white",
    icon: "⚡",
    description: "Global payment platform with cards, SEPA, iDEAL, and Apple Pay.",
  },
  paypal: {
    name: "PayPal",
    color: "bg-blue-600 text-white",
    icon: "🅿️",
    description: "The world's most popular online payment method.",
  },
};

// Define which credential fields each provider needs
const CREDENTIAL_FIELDS: Record<string, { key: string; label: string; placeholder: string; secret?: boolean }[]> = {
  mollie: [
    { key: "testApiKey", label: "Test API Key", placeholder: "test_xxxxxxxxxxxxxxxxxx", secret: true },
    { key: "liveApiKey", label: "Live API Key", placeholder: "live_xxxxxxxxxxxxxxxxxx", secret: true },
    { key: "profileId", label: "Profile ID", placeholder: "pfl_xxxxxxxxxx" },
  ],
  stripe: [
    { key: "testPublishableKey", label: "Test Publishable Key", placeholder: "pk_test_xxxxxxxxxx" },
    { key: "testSecretKey", label: "Test Secret Key", placeholder: "sk_test_xxxxxxxxxx", secret: true },
    { key: "livePublishableKey", label: "Live Publishable Key", placeholder: "pk_live_xxxxxxxxxx" },
    { key: "liveSecretKey", label: "Live Secret Key", placeholder: "sk_live_xxxxxxxxxx", secret: true },
    { key: "webhookSecret", label: "Webhook Secret", placeholder: "whsec_xxxxxxxxxx", secret: true },
  ],
  paypal: [
    { key: "sandboxClientId", label: "Sandbox Client ID", placeholder: "AxxxxxxxxxxxxxxxxXX" },
    { key: "sandboxClientSecret", label: "Sandbox Client Secret", placeholder: "ExxxxxxxxxxxxxxxxXX", secret: true },
    { key: "liveClientId", label: "Live Client ID", placeholder: "AxxxxxxxxxxxxxxxxXX" },
    { key: "liveClientSecret", label: "Live Client Secret", placeholder: "ExxxxxxxxxxxxxxxxXX", secret: true },
  ],
};

interface Gateway {
  id: string | null;
  provider: string;
  enabled: boolean;
  mode: string;
  credentials: Record<string, string>;
  settings: Record<string, any>;
}

export function PaymentsClient() {
  const [gateways, setGateways] = useState<Gateway[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savingProvider, setSavingProvider] = useState<string | null>(null);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchGateways();
  }, []);

  const fetchGateways = async () => {
    try {
      const res = await fetch("/api/admin/payments");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setGateways(data);
    } catch (error) {
      toast.error("Failed to load payment settings");
    } finally {
      setIsLoading(false);
    }
  };

  const updateGateway = (provider: string, updates: Partial<Gateway>) => {
    setGateways((prev) =>
      prev.map((gw) => (gw.provider === provider ? { ...gw, ...updates } : gw))
    );
  };

  const updateCredential = (provider: string, key: string, value: string) => {
    setGateways((prev) =>
      prev.map((gw) =>
        gw.provider === provider
          ? { ...gw, credentials: { ...gw.credentials, [key]: value } }
          : gw
      )
    );
  };

  const saveGateway = async (provider: string) => {
    const gw = gateways.find((g) => g.provider === provider);
    if (!gw) return;

    setSavingProvider(provider);
    try {
      const res = await fetch("/api/admin/payments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: gw.provider,
          enabled: gw.enabled,
          mode: gw.mode,
          credentials: gw.credentials,
          settings: gw.settings,
        }),
      });

      if (!res.ok) throw new Error("Failed to save");

      toast.success(`${PROVIDER_META[provider].name} settings saved`);
    } catch (error) {
      toast.error(`Failed to save ${PROVIDER_META[provider].name} settings`);
    } finally {
      setSavingProvider(null);
    }
  };

  const toggleSecret = (key: string) => {
    setShowSecrets((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <CreditCard className="h-8 w-8" />
          Payment Gateways
        </h2>
        <p className="text-muted-foreground mt-1">
          Configure payment providers for your store. Enable one or more gateways to accept online payments.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {gateways.map((gw) => {
          const meta = PROVIDER_META[gw.provider];
          return (
            <Card
              key={gw.provider}
              className={`border-2 transition-all ${
                gw.enabled ? "border-green-500/50 bg-green-50/30 dark:bg-green-950/10" : "border-transparent"
              }`}
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-12 w-12 rounded-2xl ${meta.color} flex items-center justify-center text-2xl shadow-lg`}>
                      {meta.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{meta.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        {gw.enabled ? (
                          <Badge variant="default" className="bg-green-600 text-xs">Active</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">Disabled</Badge>
                        )}
                        {gw.enabled && (
                          <Badge variant="outline" className="text-xs capitalize">
                            {gw.mode} mode
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Gateway Configuration Tabs */}
      <Tabs defaultValue="mollie" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          {gateways.map((gw) => {
            const meta = PROVIDER_META[gw.provider];
            return (
              <TabsTrigger key={gw.provider} value={gw.provider} className="gap-2">
                <span className="text-lg">{meta.icon}</span>
                {meta.name}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {gateways.map((gw) => {
          const meta = PROVIDER_META[gw.provider];
          const fields = CREDENTIAL_FIELDS[gw.provider] || [];
          const isSaving = savingProvider === gw.provider;

          return (
            <TabsContent key={gw.provider} value={gw.provider} className="space-y-4">
              {/* Enable / Mode Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-2xl">{meta.icon}</span>
                        {meta.name} Configuration
                      </CardTitle>
                      <CardDescription className="mt-1">{meta.description}</CardDescription>
                    </div>
                    <Button onClick={() => saveGateway(gw.provider)} disabled={isSaving} className="gap-2">
                      {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      Save {meta.name}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Enable toggle */}
                  <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/20">
                    <div className="flex items-center gap-3">
                      {gw.enabled ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                      )}
                      <div>
                        <p className="font-medium">Enable {meta.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {gw.enabled ? "This gateway is active and accepting payments." : "Enable to start accepting payments via " + meta.name + "."}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={gw.enabled}
                      onCheckedChange={(checked) => updateGateway(gw.provider, { enabled: checked })}
                    />
                  </div>

                  {/* Mode selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Settings2 className="h-4 w-4" />
                      Environment Mode
                    </label>
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant={gw.mode === "test" ? "default" : "outline"}
                        onClick={() => updateGateway(gw.provider, { mode: "test" })}
                        className="flex-1 gap-2"
                      >
                        <ShieldCheck className="h-4 w-4" />
                        Test / Sandbox
                      </Button>
                      <Button
                        type="button"
                        variant={gw.mode === "live" ? "default" : "outline"}
                        onClick={() => updateGateway(gw.provider, { mode: "live" })}
                        className="flex-1 gap-2"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Live / Production
                      </Button>
                    </div>
                    {gw.mode === "live" && (
                      <p className="text-xs text-amber-600 flex items-center gap-1 mt-1">
                        <AlertTriangle className="h-3 w-3" />
                        Live mode will process real payments. Ensure your credentials are correct.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Credentials Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5" />
                    API Credentials
                  </CardTitle>
                  <CardDescription>
                    Enter your {meta.name} API keys. Secret keys are encrypted before storage.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {fields.map((field) => {
                      const fieldKey = `${gw.provider}-${field.key}`;
                      const isSecret = field.secret;
                      const isVisible = showSecrets[fieldKey];

                      return (
                        <div key={field.key} className="space-y-2">
                          <label className="text-sm font-medium">{field.label}</label>
                          <div className="relative">
                            <Input
                              type={isSecret && !isVisible ? "password" : "text"}
                              value={gw.credentials?.[field.key] || ""}
                              onChange={(e) => updateCredential(gw.provider, field.key, e.target.value)}
                              placeholder={field.placeholder}
                              className="pr-10"
                            />
                            {isSecret && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                                onClick={() => toggleSecret(fieldKey)}
                              >
                                {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Provider-specific settings */}
              {gw.provider === "paypal" && (
                <Card>
                  <CardHeader>
                    <CardTitle>PayPal Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Brand Name</label>
                        <Input
                          value={gw.settings?.brandName || ""}
                          onChange={(e) =>
                            updateGateway(gw.provider, {
                              settings: { ...gw.settings, brandName: e.target.value },
                            })
                          }
                          placeholder="Your store name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Currency</label>
                        <Input
                          value={gw.settings?.currency || "EUR"}
                          onChange={(e) =>
                            updateGateway(gw.provider, {
                              settings: { ...gw.settings, currency: e.target.value },
                            })
                          }
                          placeholder="EUR"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {gw.provider === "stripe" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Stripe Settings</CardTitle>
                    <CardDescription>
                      Configure which Stripe payment methods are available.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {["card", "ideal", "bancontact", "sepa_debit", "sofort", "giropay"].map((method) => {
                        const methods = gw.settings?.methods || [];
                        const isActive = methods.includes(method);
                        return (
                          <Button
                            key={method}
                            type="button"
                            variant={isActive ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              const updated = isActive
                                ? methods.filter((m: string) => m !== method)
                                : [...methods, method];
                              updateGateway(gw.provider, {
                                settings: { ...gw.settings, methods: updated },
                              });
                            }}
                            className="capitalize"
                          >
                            {method.replace("_", " ")}
                          </Button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {gw.provider === "mollie" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Mollie Payment Methods</CardTitle>
                    <CardDescription>
                      Select which Mollie payment methods to offer at checkout.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {["ideal", "creditcard", "bancontact", "paypal", "applepay", "banktransfer", "klarnapaylater", "klarnasliceit", "eps", "przelewy24"].map((method) => {
                        const methods = gw.settings?.methods || [];
                        const isActive = methods.includes(method);
                        return (
                          <Button
                            key={method}
                            type="button"
                            variant={isActive ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              const updated = isActive
                                ? methods.filter((m: string) => m !== method)
                                : [...methods, method];
                              updateGateway(gw.provider, {
                                settings: { ...gw.settings, methods: updated },
                              });
                            }}
                            className="capitalize"
                          >
                            {method.replace("creditcard", "Credit Card").replace("banktransfer", "Bank Transfer").replace("klarnapaylater", "Klarna Pay Later").replace("klarnasliceit", "Klarna Slice It").replace("przelewy24", "Przelewy24").replace("applepay", "Apple Pay")}
                          </Button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
