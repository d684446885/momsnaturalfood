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
  Upload
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
  uploadProvider: string;
  r2AccountId: string | null;
  r2AccessKeyId: string | null;
  r2SecretAccessKey: string | null;
  r2BucketName: string | null;
  r2PublicUrl: string | null;
  googleClientId: string | null;
  googleClientSecret: string | null;
  authSecret: string | null;
  businessName: string | null;
  logoUrl: string | null;
  businessEmail: string | null;
  businessPhone: string | null;
  businessAddress: string | null;
  vercelBlobToken: string | null;
}

interface SettingsClientProps {
  initialSettings: Settings;
}

export function SettingsClient({ initialSettings }: SettingsClientProps) {
  const t = useTranslations("Dashboard");
  const [settings, setSettings] = useState(initialSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [activeTab, setActiveTab] = useState<'appearance' | 'storage' | 'auth' | 'business'>('business');
  const [isUploading, setIsUploading] = useState(false);
  const [showDriveSecret, setShowDriveSecret] = useState(false);
  const [showDriveRefresh, setShowDriveRefresh] = useState(false);
  const [showBlobToken, setShowBlobToken] = useState(false);
  const [showGoogleSecret, setShowGoogleSecret] = useState(false);
  const [showAuthSecret, setShowAuthSecret] = useState(false);

  const isR2Configured = settings.r2AccountId && settings.r2AccessKeyId && settings.r2SecretAccessKey && settings.r2BucketName;
  const isBlobConfigured = !!settings.vercelBlobToken;
  const isAuthConfigured = settings.googleClientId && settings.googleClientSecret && settings.authSecret;

  const isUploadConfigured = 
    settings.uploadProvider === 'r2' ? isR2Configured : 
    settings.uploadProvider === 'vercel' ? isBlobConfigured :
    true; // Local is always considered configured

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
                  <CardTitle>File Storage Configuration</CardTitle>
                  <CardDescription>Select and configure your preferred cloud storage provider for media uploads.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-8">
              {/* Provider Selection */}
              <div className="space-y-4">
                <label className="text-sm font-semibold">Active Upload Provider</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    onClick={() => setSettings({ ...settings, uploadProvider: 'r2' })}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                      settings.uploadProvider === 'r2' 
                        ? 'border-primary bg-primary/5 shadow-md' 
                        : 'border-muted hover:border-muted-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${settings.uploadProvider === 'r2' ? 'bg-primary text-white' : 'bg-muted'}`}>
                        <Cloud className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold">Cloudflare R2</p>
                        <p className="text-xs text-muted-foreground">S3-compatible object storage</p>
                      </div>
                    </div>
                    {settings.uploadProvider === 'r2' && <CheckCircle2 className="h-5 w-5 text-primary" />}
                  </div>

                  <div 
                    onClick={() => setSettings({ ...settings, uploadProvider: 'vercel' })}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                      settings.uploadProvider === 'vercel' 
                        ? 'border-primary bg-primary/5 shadow-md' 
                        : 'border-muted hover:border-muted-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${settings.uploadProvider === 'vercel' ? 'bg-primary text-white' : 'bg-muted'}`}>
                        <Cloud className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold">Vercel Blob</p>
                        <p className="text-xs text-muted-foreground">Fast & simple edge storage</p>
                      </div>
                    </div>
                    {settings.uploadProvider === 'vercel' && <CheckCircle2 className="h-5 w-5 text-primary" />}
                  </div>

                  <div 
                    onClick={() => setSettings({ ...settings, uploadProvider: 'local' })}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                      settings.uploadProvider === 'local' 
                        ? 'border-primary bg-primary/5 shadow-md' 
                        : 'border-muted hover:border-muted-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${settings.uploadProvider === 'local' ? 'bg-primary text-white' : 'bg-muted'}`}>
                        <Cloud className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold">Local Storage</p>
                        <p className="text-xs text-muted-foreground">Server file system</p>
                      </div>
                    </div>
                    {settings.uploadProvider === 'local' && <CheckCircle2 className="h-5 w-5 text-primary" />}
                  </div>
                </div>
              </div>

              <Separator />

              {/* R2 Section */}
              <div className={`space-y-6 transition-opacity ${settings.uploadProvider !== 'r2' ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={settings.uploadProvider === 'r2' ? "bg-primary/10" : ""}>Option 1</Badge>
                  <h3 className="font-bold">Cloudflare R2 Settings</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Account ID</label>
                    <Input 
                      placeholder="Your Cloudflare Account ID"
                      value={settings.r2AccountId || ""}
                      onChange={(e) => setSettings({ ...settings, r2AccountId: e.target.value })}
                      disabled={settings.uploadProvider !== 'r2'}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Bucket Name</label>
                    <Input 
                      placeholder="my-bucket"
                      value={settings.r2BucketName || ""}
                      onChange={(e) => setSettings({ ...settings, r2BucketName: e.target.value })}
                      disabled={settings.uploadProvider !== 'r2'}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Access Key ID</label>
                    <Input 
                      placeholder="R2 Access Key ID"
                      value={settings.r2AccessKeyId || ""}
                      onChange={(e) => setSettings({ ...settings, r2AccessKeyId: e.target.value })}
                      disabled={settings.uploadProvider !== 'r2'}
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
                        disabled={settings.uploadProvider !== 'r2'}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                        onClick={() => setShowSecretKey(!showSecretKey)}
                        disabled={settings.uploadProvider !== 'r2'}
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
                    disabled={settings.uploadProvider !== 'r2'}
                  />
                </div>
              </div>

              <Separator />

              {/* Local Storage Section */}
              <div className={`space-y-6 transition-opacity ${settings.uploadProvider !== 'local' ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={settings.uploadProvider === 'local' ? "bg-primary/10" : ""}>Option 2</Badge>
                  <h3 className="font-bold">Local Storage Settings</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Local storage uses the server&apos;s file system. No additional configuration is typically needed here.
                  Ensure your server has sufficient disk space and appropriate file permissions for uploads.
                </p>
              </div>

              <Separator />

              {/* Vercel Blob Section */}
              <div className={`space-y-6 transition-opacity ${settings.uploadProvider !== 'vercel' ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={settings.uploadProvider === 'vercel' ? "bg-primary/10" : ""}>Option 4</Badge>
                  <h3 className="font-bold">Vercel Blob Settings</h3>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Blob Read/Write Token</label>
                  <div className="relative">
                    <Input 
                      type={showBlobToken ? "text" : "password"}
                      placeholder="BLOB_READ_WRITE_TOKEN"
                      value={settings.vercelBlobToken || ""}
                      onChange={(e) => setSettings({ ...settings, vercelBlobToken: e.target.value })}
                      className="pr-10"
                      disabled={settings.uploadProvider !== 'vercel'}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowBlobToken(!showBlobToken)}
                      disabled={settings.uploadProvider !== 'vercel'}
                    >
                      {showBlobToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Copy the &quot;Read/Write Token&quot; from your Vercel Blob dashboard.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {isUploadConfigured ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>{settings.uploadProvider.toUpperCase().replace('_', ' ')} is configured and active</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      <span>Fill in credentials for {
                        settings.uploadProvider === 'r2' ? 'Cloudflare R2' : 
                        settings.uploadProvider === 'vercel' ? 'Vercel Blob' :
                        'Local Storage'
                      }</span>
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
