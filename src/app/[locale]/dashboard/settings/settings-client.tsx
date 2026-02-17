"use client";

import React, { useState } from "react";
import { 
  Shield, 
  Palette, 
  Save, 
  RotateCcw, 
  Loader2, 
  Cloud, 
  Eye, 
  EyeOff,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface Settings {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  accentColor: string;
  r2AccountId: string | null;
  r2AccessKeyId: string | null;
  r2SecretAccessKey: string | null;
  r2BucketName: string | null;
  r2PublicUrl: string | null;
  googleClientId: string | null;
  googleClientSecret: string | null;
  authSecret: string | null;
}

interface SettingsClientProps {
  initialSettings: Settings;
}

export function SettingsClient({ initialSettings }: SettingsClientProps) {
  const t = useTranslations("Dashboard");
  const [settings, setSettings] = useState(initialSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [showGoogleSecret, setShowGoogleSecret] = useState(false);
  const [showAuthSecret, setShowAuthSecret] = useState(false);
  const [activeTab, setActiveTab] = useState<'appearance' | 'storage' | 'auth'>('appearance');

  const isR2Configured = settings.r2AccountId && settings.r2AccessKeyId && settings.r2SecretAccessKey && settings.r2BucketName;
  const isAuthConfigured = settings.googleClientId && settings.googleClientSecret && settings.authSecret;

  const onSave = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save settings");
      }

      toast.success("Settings updated successfully");
      
      const root = document.documentElement;
      root.style.setProperty('--primary-color', settings.primaryColor);
      root.style.setProperty('--secondary-color', settings.secondaryColor);
      root.style.setProperty('--background-color', settings.backgroundColor);
      root.style.setProperty('--accent-color', settings.accentColor);
    } catch (error: any) {
      toast.error(error.message || "Error saving settings");
    } finally {
      setIsLoading(false);
    }
  };

  const resetColors = () => {
    setSettings({
      ...settings,
      primaryColor: "#8B5E3C",
      secondaryColor: "#1E3A34",
      backgroundColor: "#FAF9F6",
      accentColor: "#D4AF37"
    });
    const root = document.documentElement;
    root.style.setProperty('--primary-color', "#8B5E3C");
    root.style.setProperty('--secondary-color', "#1E3A34");
    root.style.setProperty('--background-color', "#FAF9F6");
    root.style.setProperty('--accent-color', "#D4AF37");
  };

  const ColorInput = ({ label, value, keyName, description }: { label: string, value: string, keyName: keyof Settings, description: string }) => (
    <div className="space-y-2">
      <label className="text-sm font-semibold">{label}</label>
      <div className="flex gap-4 items-center">
        <div 
          className="h-12 w-12 rounded-xl border shadow-inner transition-transform hover:scale-105" 
          style={{ backgroundColor: value }}
        />
        <div className="flex-1 relative">
          <Input 
            type="text" 
            value={value}
            onChange={(e) => setSettings({ ...settings, [keyName]: e.target.value })}
            placeholder="#000000"
            className="pl-3"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
             <input 
               type="color" 
               value={value}
               onChange={(e) => setSettings({ ...settings, [keyName]: e.target.value })}
               className="h-6 w-6 cursor-pointer border-none bg-transparent"
             />
          </div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('settings')}</h1>
        <p className="text-muted-foreground">Manage your global store configurations.</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b pb-2">
        <Button 
          variant={activeTab === 'appearance' ? 'default' : 'ghost'} 
          size="sm"
          onClick={() => setActiveTab('appearance')}
          className="gap-2"
        >
          <Palette className="h-4 w-4" />
          Appearance
        </Button>
        <Button 
          variant={activeTab === 'storage' ? 'default' : 'ghost'} 
          size="sm"
          onClick={() => setActiveTab('storage')}
          className="gap-2"
        >
          <Cloud className="h-4 w-4" />
          File Storage
          {isR2Configured ? (
            <Badge variant="secondary" className="ml-1 bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Connected
            </Badge>
          ) : (
            <Badge variant="secondary" className="ml-1 bg-amber-100 text-amber-700">
              <AlertCircle className="h-3 w-3 mr-1" />
              Not Set
            </Badge>
          )}
        </Button>
        <Button 
          variant={activeTab === 'auth' ? 'default' : 'ghost'} 
          size="sm"
          onClick={() => setActiveTab('auth')}
          className="gap-2"
        >
          <Shield className="h-4 w-4" />
          Authentication
          {isAuthConfigured ? (
            <Badge variant="secondary" className="ml-1 bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Ready
            </Badge>
          ) : (
            <Badge variant="secondary" className="ml-1 bg-amber-100 text-amber-700">
              <AlertCircle className="h-3 w-3 mr-1" />
              Incomplete
            </Badge>
          )}
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Appearance Tab */}
        {activeTab === 'appearance' && (
          <Card className="overflow-hidden border-none shadow-sm">
            <CardHeader className="bg-muted/50 pb-6">
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Appearance & Layout</CardTitle>
                  <CardDescription>Customize the core palette of your website and dashboard.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ColorInput 
                  label="Primary Brand Color" 
                  value={settings.primaryColor} 
                  keyName="primaryColor"
                  description="Used for main buttons, links, and active states."
                />
                <ColorInput 
                  label="Secondary Brand Color" 
                  value={settings.secondaryColor} 
                  keyName="secondaryColor"
                  description="Used for sidebars, footers, and decorative elements."
                />
                <ColorInput 
                  label="Background Color" 
                  value={settings.backgroundColor} 
                  keyName="backgroundColor"
                  description="The main background color for all pages."
                />
                <ColorInput 
                  label="Accent / Luxury Color" 
                  value={settings.accentColor} 
                  keyName="accentColor"
                  description="Used for highlights, badges, and gold/honey details."
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                  <Button 
                      variant="outline" 
                      className="gap-2" 
                      onClick={resetColors}
                      disabled={isLoading}
                  >
                      <RotateCcw className="h-4 w-4" />
                      Reset to Default Palette
                  </Button>
                  <Button 
                      className="gap-2 px-8" 
                      onClick={onSave}
                      disabled={isLoading}
                  >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      Save All Changes
                  </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Storage Tab */}
        {activeTab === 'storage' && (
          <Card className="overflow-hidden border-none shadow-sm">
            <CardHeader className="bg-muted/50 pb-6">
              <div className="flex items-center gap-2">
                <Cloud className="h-5 w-5 text-blue-500" />
                <div>
                  <CardTitle>Cloudflare R2 Storage</CardTitle>
                  <CardDescription>Configure your Cloudflare R2 bucket for media uploads (product images, etc.).</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Account ID</label>
                  <Input 
                    placeholder="Your Cloudflare Account ID"
                    value={settings.r2AccountId || ""}
                    onChange={(e) => setSettings({ ...settings, r2AccountId: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Found in Cloudflare Dashboard → R2 → Overview
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Bucket Name</label>
                  <Input 
                    placeholder="my-bucket"
                    value={settings.r2BucketName || ""}
                    onChange={(e) => setSettings({ ...settings, r2BucketName: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    The name of your R2 bucket
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Access Key ID</label>
                  <Input 
                    placeholder="R2 Access Key ID"
                    value={settings.r2AccessKeyId || ""}
                    onChange={(e) => setSettings({ ...settings, r2AccessKeyId: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Create via R2 → Manage API Tokens
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Secret Access Key</label>
                  <div className="relative">
                    <Input 
                      type={showSecretKey ? "text" : "password"}
                      placeholder="R2 Secret Access Key"
                      value={settings.r2SecretAccessKey || ""}
                      onChange={(e) => setSettings({ ...settings, r2SecretAccessKey: e.target.value })}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowSecretKey(!showSecretKey)}
                    >
                      {showSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Keep this secret! Created with Access Key ID
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Public URL (Optional)</label>
                <Input 
                  placeholder="https://cdn.yourdomain.com"
                  value={settings.r2PublicUrl || ""}
                  onChange={(e) => setSettings({ ...settings, r2PublicUrl: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Custom domain for public access. Leave blank to use R2's default URL.
                </p>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {isR2Configured ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>R2 storage is configured and ready</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      <span>Fill in all required fields to enable file uploads</span>
                    </>
                  )}
                </div>
                <Button 
                    className="gap-2 px-8" 
                    onClick={onSave}
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Storage Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Authentication Tab */}
        {activeTab === 'auth' && (
          <Card className="overflow-hidden border-none shadow-sm">
            <CardHeader className="bg-muted/50 pb-6">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-500" />
                <div>
                  <CardTitle>Authentication Settings</CardTitle>
                  <CardDescription>Manage Google OAuth credentials and NextAuth security tokens.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Google Client ID</label>
                  <Input 
                    placeholder="xxxx-xxxx.apps.googleusercontent.com"
                    value={settings.googleClientId || ""}
                    onChange={(e) => setSettings({ ...settings, googleClientId: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    From Google Cloud Console → APIs & Services → Credentials
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Google Client Secret</label>
                  <div className="relative">
                    <Input 
                      type={showGoogleSecret ? "text" : "password"}
                      placeholder="GOCSPX-xxxxxxxxxxxx"
                      value={settings.googleClientSecret || ""}
                      onChange={(e) => setSettings({ ...settings, googleClientSecret: e.target.value })}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowGoogleSecret(!showGoogleSecret)}
                    >
                      {showGoogleSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Keep this secret! Paired with Client ID
                  </p>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-semibold">Authentication Secret (AUTH_SECRET)</label>
                  <div className="relative">
                    <Input 
                      type={showAuthSecret ? "text" : "password"}
                      placeholder="Random secure string"
                      value={settings.authSecret || ""}
                      onChange={(e) => setSettings({ ...settings, authSecret: e.target.value })}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowAuthSecret(!showAuthSecret)}
                    >
                      {showAuthSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Required for JWT signing. You can generate one with <code className="bg-muted px-1 rounded">openssl rand -base64 32</code>
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {isAuthConfigured ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>Auth dynamic settings populated</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      <span>OAuth won't work unless credentials are set</span>
                    </>
                  )}
                </div>
                <Button 
                    className="gap-2 px-8" 
                    onClick={onSave}
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Auth Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        {!activeTab && (
          <Card className="border-none shadow-sm opacity-60 text-center p-12">
             <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
             <CardTitle>Select a tab above to manage settings</CardTitle>
          </Card>
        )}
      </div>
    </div>
  );
}
