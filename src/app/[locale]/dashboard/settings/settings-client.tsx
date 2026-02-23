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
  AlertCircle,
  Building2,
  Image as ImageIcon,
  Mail,
  Phone,
  MapPin,
  Upload,
  Globe,
  Truck,
  CreditCard,
  Megaphone
} from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Settings {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  accentColor: string;
  navbarColor: string;
  footerColor: string;
  sidebarColor: string;
  textColor: string;
  buttonColor: string;
  buttonTextColor: string;
  buttonHoverColor: string;
  buttonHoverTextColor: string;

  r2AccountId: string | null;
  r2AccessKeyId: string | null;
  r2SecretAccessKey: string | null;
  r2BucketName: string | null;
  r2PublicUrl: string | null;
  authSecret: string | null;
  businessName: string | null;
  logoUrl: string | null;
  businessEmail: string | null;
  businessPhone: string | null;
  businessAddress: string | null;

  defaultLanguage: string;
  shippingFee: number;
  freeShippingThreshold: number;
  cashOnDeliveryEnabled: boolean;
  newsletterEnabled: boolean;
  storageType: string;
}

interface SettingsClientProps {
  initialSettings: Settings;
}

export function SettingsClient({ initialSettings }: SettingsClientProps) {
  const t = useTranslations("Dashboard");
  const [settings, setSettings] = useState(initialSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [activeTab, setActiveTab] = useState<'appearance' | 'storage' | 'auth' | 'business' | 'logistics' | 'marketing'>('business');
  const [isUploading, setIsUploading] = useState(false);
  const [showDriveSecret, setShowDriveSecret] = useState(false);
  const [showDriveRefresh, setShowDriveRefresh] = useState(false);

  const [showAuthSecret, setShowAuthSecret] = useState(false);

  const isR2Configured = settings.r2AccountId && settings.r2AccessKeyId && settings.r2SecretAccessKey && settings.r2BucketName;

  const isAuthConfigured = !!settings.authSecret;

  const isUploadConfigured = !!isR2Configured;

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
      root.style.setProperty('--navbar-color', settings.navbarColor);
      root.style.setProperty('--footer-color', settings.footerColor);
      root.style.setProperty('--sidebar-color', settings.sidebarColor);
      root.style.setProperty('--text-color', settings.textColor);
      root.style.setProperty('--button-color', settings.buttonColor);
      root.style.setProperty('--button-text-color', settings.buttonTextColor);
      root.style.setProperty('--button-hover-color', settings.buttonHoverColor);
      root.style.setProperty('--button-hover-text-color', settings.buttonHoverTextColor);
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
      accentColor: "#D4AF37",
      navbarColor: "#1E3A34",
      footerColor: "#1E3A34",
      sidebarColor: "#FAF9F6",
      textColor: "#1E3A34",
      buttonColor: "#8B5E3C",
      buttonTextColor: "#FAF9F6",
      buttonHoverColor: "#7d6036", 
      buttonHoverTextColor: "#FAF9F6"
    });
    const root = document.documentElement;
    root.style.setProperty('--primary-color', "#8B5E3C");
    root.style.setProperty('--secondary-color', "#1E3A34");
    root.style.setProperty('--background-color', "#FAF9F6");
    root.style.setProperty('--accent-color', "#D4AF37");
    root.style.setProperty('--navbar-color', "#1E3A34");
    root.style.setProperty('--footer-color', "#1E3A34");
    root.style.setProperty('--sidebar-color', "#FAF9F6");
    root.style.setProperty('--text-color', "#1E3A34");
    root.style.setProperty('--button-color', "#8B5E3C");
    root.style.setProperty('--button-text-color', "#FAF9F6");
    root.style.setProperty('--button-hover-color', "#7d6036");
    root.style.setProperty('--button-hover-text-color', "#FAF9F6");
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

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      setSettings({ ...settings, logoUrl: data.url });
      toast.success("Logo uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload logo");
    } finally {
      setIsUploading(false);
    }
  };

  const handleMigrate = async () => {
    if (!confirm("This will download all images from R2 and save them locally on your VPS. This might take a few moments. Proceed?")) return;

    try {
      setIsLoading(true);
      const response = await fetch("/api/storage/migrate", { method: "POST" });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Migration failed");

      toast.success(`Success! Migrated ${data.stats.downloaded} files and updated ${data.stats.updated} records.`);
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

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
          variant={activeTab === 'business' ? 'default' : 'ghost'} 
          size="sm"
          onClick={() => setActiveTab('business')}
          className="gap-2"
        >
          <Building2 className="h-4 w-4" />
          Business Profile
        </Button>
        <Button 
          variant={activeTab === 'storage' ? 'default' : 'ghost'} 
          size="sm"
          onClick={() => setActiveTab('storage')}
          className="gap-2"
        >
          <Cloud className="h-4 w-4" />
          File Storage
          {isUploadConfigured ? (
            <Badge variant="secondary" className="ml-1 bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Connected
            </Badge>
          ) : (
            <Badge variant="secondary" className="ml-1 bg-red-100 text-red-700">
              <AlertCircle className="h-3 w-3 mr-1" />
              Not Configured
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
        <Button 
          variant={activeTab === 'logistics' ? 'default' : 'ghost'} 
          size="sm"
          onClick={() => setActiveTab('logistics')}
          className="gap-2"
        >
          <Truck className="h-4 w-4" />
          Logistics & Payments
        </Button>
        <Button 
          variant={activeTab === 'marketing' ? 'default' : 'ghost'} 
          size="sm"
          onClick={() => setActiveTab('marketing')}
          className="gap-2"
        >
          <Megaphone className="h-4 w-4" />
          Marketing
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Business Profile Tab */}
        {activeTab === 'business' && (
          <Card className="overflow-hidden border-none shadow-sm">
            <CardHeader className="bg-muted/50 pb-6">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Business Profile</CardTitle>
                  <CardDescription>Configure your store identification and contact details.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-8">
              {/* Logo Section */}
              <div className="space-y-4">
                <label className="text-sm font-semibold">Store Logo</label>
                <div className="flex items-start gap-6">
                  <div className="relative h-32 w-32 rounded-2xl border-2 border-dashed border-muted-foreground/20 flex items-center justify-center overflow-hidden bg-muted/30">
                    {settings.logoUrl ? (
                      <img 
                        src={settings.logoUrl} 
                        alt="Logo Preview" 
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">No Logo</p>
                      </div>
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="relative overflow-hidden"
                        disabled={isUploading}
                      >
                        <input
                          type="file"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={handleLogoUpload}
                          accept="image/*"
                        />
                        <Upload className="h-4 w-4 mr-2" />
                        Upload New Logo
                      </Button>
                      {settings.logoUrl && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setSettings({ ...settings, logoUrl: null })}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Recommended: Transparent PNG, min 500x500px. <br />
                      This logo will appear on your website header and invoice.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    Business Name
                  </label>
                  <Input 
                    placeholder="MoM's NaturalFood"
                    value={settings.businessName || ""}
                    onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Business Email
                  </label>
                  <Input 
                    type="email"
                    placeholder="contact@momsnatural.com"
                    value={settings.businessEmail || ""}
                    onChange={(e) => setSettings({ ...settings, businessEmail: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    Phone Number
                  </label>
                  <Input 
                    placeholder="+1 (234) 567-890"
                    value={settings.businessPhone || ""}
                    onChange={(e) => setSettings({ ...settings, businessPhone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    Physical Address
                  </label>
                  <Input 
                    placeholder="123 Natural St, Green City, 90210"
                    value={settings.businessAddress || ""}
                    onChange={(e) => setSettings({ ...settings, businessAddress: e.target.value })}
                  />
                </div>
              </div>

              <Separator />

              {/* Regional Settings */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Regional Settings
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-semibold">Default Language</label>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                      {[
                        { code: 'en', name: 'English' },
                        { code: 'nl', name: 'Dutch' },
                        { code: 'tr', name: 'Turkish' },
                        { code: 'ar', name: 'Arabic' }
                      ].map((lang) => (
                        <div 
                          key={lang.code}
                          onClick={() => setSettings({ ...settings, defaultLanguage: lang.code })}
                          className={cn(
                            "cursor-pointer p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center text-center gap-1 relative",
                            settings.defaultLanguage === lang.code 
                              ? "border-primary bg-primary/5 shadow-sm" 
                              : "border-muted hover:border-muted-foreground"
                          )}
                        >
                          <span className="text-sm font-bold">{lang.name}</span>
                          <span className="text-[10px] uppercase text-muted-foreground">{lang.code}</span>
                          {settings.defaultLanguage === lang.code && (
                            <div className="absolute top-1 right-1">
                               <CheckCircle2 className="h-3 w-3 text-primary" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      This determines the fallback language when a visitor's locale isn't detected.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button 
                    className="gap-2 px-8" 
                    onClick={onSave}
                    disabled={isLoading || isUploading}
                >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Business Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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
                
                <h3 className="col-span-full text-lg font-semibold pt-4">Granular Controls</h3>
                
                <ColorInput 
                  label="Navigation Bar Color" 
                  value={settings.navbarColor} 
                  keyName="navbarColor"
                  description="Background color for the top navigation bar."
                />
                <ColorInput 
                  label="Footer Color" 
                  value={settings.footerColor} 
                  keyName="footerColor"
                  description="Background color for the website footer."
                />
                <ColorInput 
                  label="Sidebar Color" 
                  value={settings.sidebarColor} 
                  keyName="sidebarColor"
                  description="Background color for the admin sidebar."
                />
                 <ColorInput 
                  label="Text Color" 
                  value={settings.textColor} 
                  keyName="textColor"
                  description="Main text color for content."
                />
                
                <h3 className="col-span-full text-lg font-semibold pt-4">Button Styling</h3>

                <ColorInput 
                  label="Button Color" 
                  value={settings.buttonColor} 
                  keyName="buttonColor"
                  description="Background color for primary buttons."
                />
                <ColorInput 
                  label="Button Text Color" 
                  value={settings.buttonTextColor} 
                  keyName="buttonTextColor"
                  description="Text color for primary buttons."
                />
                <ColorInput 
                  label="Button Hover Color" 
                  value={settings.buttonHoverColor} 
                  keyName="buttonHoverColor"
                  description="Background color when hovering over buttons."
                />
                <ColorInput 
                  label="Button Hover Text" 
                  value={settings.buttonHoverTextColor} 
                  keyName="buttonHoverTextColor"
                  description="Text color when hovering over buttons."
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
                  <CardTitle>Media Storage Configuration</CardTitle>
                  <CardDescription>Choose where your images and videos are stored.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-8">
              {/* Storage Type Selector */}
              <div className="space-y-4">
                <label className="text-sm font-semibold">Storage Provider</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    onClick={() => setSettings({ ...settings, storageType: "LOCAL" })}
                    className={cn(
                      "cursor-pointer p-4 rounded-xl border-2 transition-all flex items-start gap-4",
                      settings.storageType === "LOCAL" 
                        ? "border-primary bg-primary/5 shadow-sm" 
                        : "border-muted hover:border-muted-foreground"
                    )}
                  >
                    <div className="mt-1 h-5 w-5 rounded-full border-2 border-primary flex items-center justify-center">
                      {settings.storageType === "LOCAL" && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                    </div>
                    <div>
                      <p className="font-bold">Local VPS Storage</p>
                      <p className="text-xs text-muted-foreground">Saves media directly to your server's hard drive. Requires Directory Mount in Coolify.</p>
                      <Badge variant="outline" className="mt-2 bg-blue-50 text-blue-700 border-blue-200">Recommended for Coolify</Badge>
                    </div>
                  </div>

                  <div 
                    onClick={() => setSettings({ ...settings, storageType: "R2" })}
                    className={cn(
                      "cursor-pointer p-4 rounded-xl border-2 transition-all flex items-start gap-4",
                      settings.storageType === "R2" 
                        ? "border-primary bg-primary/5 shadow-sm" 
                        : "border-muted hover:border-muted-foreground"
                    )}
                  >
                    <div className="mt-1 h-5 w-5 rounded-full border-2 border-primary flex items-center justify-center">
                      {settings.storageType === "R2" && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                    </div>
                    <div>
                      <p className="font-bold">Cloudflare R2 (S3)</p>
                      <p className="text-xs text-muted-foreground">High-performance external object storage. Best for scaling across multiple servers.</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {settings.storageType === "LOCAL" ? (
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-blue-700">Local Storage is Active</p>
                    <p className="text-sm text-blue-600 mt-1">
                      Media will be saved to <code className="bg-blue-100 px-1 rounded">/app/public/uploads</code>. 
                      Make sure you have configured a <b>Directory Mount</b> in Coolify to keep your files safe during updates.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-top-4">
                  {!isR2Configured && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-red-700">Cloudflare R2 is not configured</p>
                        <p className="text-sm text-red-600 mt-1">File uploads will not work until you enter your R2 credentials below.</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Account ID</label>
                      <Input 
                        placeholder="Your Cloudflare Account ID"
                        value={settings.r2AccountId || ""}
                        onChange={(e) => setSettings({ ...settings, r2AccountId: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Bucket Name</label>
                      <Input 
                        placeholder="my-bucket"
                        value={settings.r2BucketName || ""}
                        onChange={(e) => setSettings({ ...settings, r2BucketName: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Access Key ID</label>
                      <Input 
                        placeholder="R2 Access Key ID"
                        value={settings.r2AccessKeyId || ""}
                        onChange={(e) => setSettings({ ...settings, r2AccessKeyId: e.target.value })}
                      />
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
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Public URL (Optional)</label>
                    <Input 
                      placeholder="https://cdn.yourdomain.com"
                      value={settings.r2PublicUrl || ""}
                      onChange={(e) => setSettings({ ...settings, r2PublicUrl: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <Separator />

              {/* Migration Tool */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <RotateCcw className="h-5 w-5 text-amber-600" />
                  <div>
                    <h4 className="font-bold text-amber-900">Migration Tool</h4>
                    <p className="text-sm text-amber-700">Move all existing media from Cloudflare R2 to your local VPS storage.</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs text-amber-600 max-w-2xl">
                    This tool will scan your entire database (products, deals, settings, etc.), download every external image it finds, save it to your VPS disk, and update the links automatically.
                  </p>
                  <Button 
                    variant="outline" 
                    className="shrink-0 border-amber-300 text-amber-700 hover:bg-amber-100"
                    onClick={handleMigrate}
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RotateCcw className="h-4 w-4 mr-2" />}
                    Migrate R2 to Local
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-end">
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
                  <CardTitle>Authentication Security</CardTitle>
                  <CardDescription>Manage your NextAuth security tokens.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
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
                       <span>OAuth won&apos;t work unless credentials are set</span>
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

        {/* Logistics Tab */}
        {activeTab === 'logistics' && (
          <Card className="overflow-hidden border-none shadow-sm">
            <CardHeader className="bg-muted/50 pb-6">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Logistics & Payments</CardTitle>
                  <CardDescription>Control your shipping rates, thresholds, and available payment methods.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Standard Shipping Fee (€)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">€</span>
                      <Input 
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-8"
                        value={settings.shippingFee}
                        onChange={(e) => setSettings({ ...settings, shippingFee: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground italic">Applied to all orders below the free shipping threshold.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Free Shipping Threshold (€)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">€</span>
                      <Input 
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-8"
                        value={settings.freeShippingThreshold}
                        onChange={(e) => setSettings({ ...settings, freeShippingThreshold: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground italic">Orders above this amount will have zero shipping charges.</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Available Payment Methods
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={cn(
                    "p-6 rounded-3xl border-2 transition-all cursor-pointer group flex items-center justify-between",
                    settings.cashOnDeliveryEnabled 
                      ? "border-primary bg-primary/5 ring-4 ring-primary/5" 
                      : "border-muted bg-muted/20 opacity-60 hover:opacity-100 hover:border-muted-foreground/30"
                  )}
                  onClick={() => setSettings({ ...settings, cashOnDeliveryEnabled: !settings.cashOnDeliveryEnabled })}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "h-12 w-12 rounded-2xl flex items-center justify-center transition-colors shadow-sm",
                        settings.cashOnDeliveryEnabled ? "bg-white text-primary" : "bg-muted text-muted-foreground"
                      )}>
                        <Truck className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-bold text-secondary">Cash on Delivery</p>
                        <p className="text-xs text-muted-foreground">Customers pay when they receive the order.</p>
                      </div>
                    </div>
                    
                    <div className={cn(
                      "h-6 w-11 rounded-full relative transition-colors duration-200 ease-in-out",
                      settings.cashOnDeliveryEnabled ? "bg-primary" : "bg-zinc-300"
                    )}>
                      <div className={cn(
                        "absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform duration-200 ease-in-out",
                        settings.cashOnDeliveryEnabled ? "translate-x-5" : "translate-x-0"
                      )} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex gap-4 items-start">
                <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <div>
                   <p className="text-sm font-bold text-secondary">Customer Experience Preview</p>
                   <p className="text-xs text-muted-foreground mt-1">
                     Customers will see: {settings.freeShippingThreshold > 0 
                      ? `Free shipping on orders over €${settings.freeShippingThreshold.toFixed(2)}, otherwise €${settings.shippingFee.toFixed(2)}.` 
                      : `Flat shipping rate of €${settings.shippingFee.toFixed(2)} for all orders.`}
                   </p>
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button 
                    className="gap-2 px-8" 
                    onClick={onSave}
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Shipping Rules
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'marketing' && (
          <Card className="overflow-hidden border-none shadow-sm">
            <CardHeader className="bg-muted/50 pb-6">
              <div className="flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Marketing & Newsletter</CardTitle>
                  <CardDescription>Manage your customer engagement and subscription features.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-8">
              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Newsletter Settings
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={cn(
                    "p-6 rounded-3xl border-2 transition-all cursor-pointer group flex items-center justify-between",
                    settings.newsletterEnabled 
                      ? "border-primary bg-primary/5 ring-4 ring-primary/5" 
                      : "border-muted bg-muted/20 opacity-60 hover:opacity-100 hover:border-muted-foreground/30"
                  )}
                  onClick={() => setSettings({ ...settings, newsletterEnabled: !settings.newsletterEnabled })}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "h-12 w-12 rounded-2xl flex items-center justify-center transition-colors shadow-sm",
                        settings.newsletterEnabled ? "bg-white text-primary" : "bg-muted text-muted-foreground"
                      )}>
                        <Mail className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-bold text-secondary">Enable Newsletter Section</p>
                        <p className="text-xs text-muted-foreground">Show the subscription form on the home page.</p>
                      </div>
                    </div>
                    
                    <div className={cn(
                      "h-6 w-11 rounded-full relative transition-colors duration-200 ease-in-out",
                      settings.newsletterEnabled ? "bg-primary" : "bg-zinc-300"
                    )}>
                      <div className={cn(
                        "absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform duration-200 ease-in-out",
                        settings.newsletterEnabled ? "translate-x-5" : "translate-x-0"
                      )} />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button 
                    className="gap-2 px-8" 
                    onClick={onSave}
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Marketing Settings
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
