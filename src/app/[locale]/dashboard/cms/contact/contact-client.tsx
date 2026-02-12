"use client";

import React, { useState, useRef } from "react";
import { 
  Save, 
  Loader2, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Globe, 
  Plus, 
  Trash2,
  Info,
  Upload,
  Video,
  ImageIcon,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface ContactCMSClientProps {
  initialContent: any;
}

export function ContactCMSClient({ initialContent }: ContactCMSClientProps) {
  const [content, setContent] = useState(initialContent || {});
  const [isLoading, setIsLoading] = useState(false);
  const heroFileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/cms/contact", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      if (!response.ok) {
        throw new Error("Failed to save content");
      }

      toast.success("Contact page updated successfully");
    } catch (error) {
      toast.error("Failed to update contact page");
    } finally {
      setIsLoading(false);
    }
  };

  const handleHeroFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");
    if (!isVideo && !isImage) {
      toast.error("Please upload an image or video file");
      return;
    }

    try {
      const presignRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
        }),
      });

      if (!presignRes.ok) throw new Error("Failed to get upload URL");

      const { uploadUrl, fileUrl } = await presignRes.json();

      await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      setContent({
        ...content,
        heroBackgroundUrl: fileUrl,
        heroBackgroundType: isVideo ? "video" : "image",
      });

      toast.success(`${isVideo ? "Video" : "Image"} uploaded successfully`);
    } catch (error) {
      toast.error("Upload failed. You can paste a URL instead.");
    }
  };

  const updateSocialLink = (index: number, field: string, value: string) => {
    const newLinks = [...content.socialLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setContent({ ...content, socialLinks: newLinks });
  };

  const addSocialLink = () => {
    setContent({
      ...content,
      socialLinks: [...(content.socialLinks || []), { platform: "", url: "", icon: "Globe" }]
    });
  };

  const removeSocialLink = (index: number) => {
    const newLinks = content.socialLinks.filter((_: any, i: number) => i !== index);
    setContent({ ...content, socialLinks: newLinks });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Contact Page CMS</h2>
          <p className="text-muted-foreground">
            Manage your store&apos;s contact information and page layout.
          </p>
        </div>
        <Button onClick={handleSave} disabled={isLoading} className="gap-2">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList>
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="info">Contact Information</TabsTrigger>
          <TabsTrigger value="social">Social Links</TabsTrigger>
          <TabsTrigger value="map">Map Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Configuration</CardTitle>
              <CardDescription>Main banner of the Contact page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Main Title</label>
                  <Input 
                    value={content?.heroTitle || ""}
                    onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Badge/Subtitle</label>
                  <Input 
                    value={content?.heroSubtitle || ""}
                    onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea 
                  value={content?.heroDescription || ""}
                  onChange={(e) => setContent({ ...content, heroDescription: e.target.value })}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Hero Background Media */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Hero Background Media
              </CardTitle>
              <CardDescription>Set a background image or video for the hero section. Leave empty for the default gradient style.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Media Type</label>
                  <select
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={content?.heroBackgroundType || "image"}
                    onChange={(e) => setContent({ ...content, heroBackgroundType: e.target.value })}
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Upload or Paste URL</label>
                  <div className="flex gap-2">
                    <Input
                      value={content?.heroBackgroundUrl || ""}
                      onChange={(e) => setContent({ ...content, heroBackgroundUrl: e.target.value })}
                      placeholder="https://... or upload a file"
                    />
                    <input
                      ref={heroFileInputRef}
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleHeroFileUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => heroFileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Preview */}
              {content?.heroBackgroundUrl && (
                <div className="relative rounded-xl overflow-hidden border bg-zinc-100">
                  {content.heroBackgroundType === "video" ? (
                    <video
                      src={content.heroBackgroundUrl}
                      className="w-full h-48 object-cover"
                      autoPlay muted loop playsInline
                    />
                  ) : (
                    <img
                      src={content.heroBackgroundUrl}
                      alt="Hero Background"
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setContent({ ...content, heroBackgroundUrl: "", heroBackgroundType: "image" })}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" /> Remove
                    </Button>
                  </div>
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    {content.heroBackgroundType === "video" ? <Video className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                    {content.heroBackgroundType === "video" ? "Video" : "Image"}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Global Store Contact Info</CardTitle>
              <CardDescription>Address, phone, and email shown across the site.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" /> Email
                  </label>
                  <Input 
                    value={content?.email || ""}
                    onChange={(e) => setContent({ ...content, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4" /> Phone Number
                  </label>
                  <Input 
                    value={content?.phone || ""}
                    onChange={(e) => setContent({ ...content, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Address
                </label>
                <Input 
                  value={content?.address || ""}
                  onChange={(e) => setContent({ ...content, address: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Business Hours
                </label>
                <Input 
                  value={content?.hours || ""}
                  onChange={(e) => setContent({ ...content, hours: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Social Media Links</CardTitle>
                <CardDescription>Connect with your customers on social platforms.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={addSocialLink} className="gap-2">
                <Plus className="h-4 w-4" /> Add Link
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.socialLinks?.map((social: any, idx: number) => (
                <div key={idx} className="flex gap-4 items-end border-b pb-4">
                  <div className="space-y-2 flex-1">
                    <label className="text-xs font-medium">Platform</label>
                    <Input 
                      value={social.platform}
                      onChange={(e) => updateSocialLink(idx, "platform", e.target.value)}
                      placeholder="e.g. Instagram"
                    />
                  </div>
                  <div className="space-y-2 flex-[2]">
                    <label className="text-xs font-medium">URL</label>
                    <Input 
                      value={social.url}
                      onChange={(e) => updateSocialLink(idx, "url", e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeSocialLink(idx)} className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Google Maps Embed</CardTitle>
              <CardDescription>Paste the full embed code from Google Maps. We'll extract the map URL automatically.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Paste Google Maps Embed Code or URL</label>
                <textarea
                  className="w-full min-h-[100px] rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={content?.mapEmbedUrl || ""}
                  onChange={(e) => {
                    let val = e.target.value.trim();
                    // If user pasted full <iframe> HTML, extract the src attribute
                    const srcMatch = val.match(/src=["']([^"']+)["']/i);
                    if (srcMatch && srcMatch[1]) {
                      val = srcMatch[1];
                    }
                    setContent({ ...content, mapEmbedUrl: val });
                  }}
                  placeholder={'Paste full <iframe> embed code or just the src URL\ne.g. <iframe src="https://www.google.com/maps/embed?pb=..."></iframe>'}
                />
              </div>

              {/* Extracted URL display */}
              {content?.mapEmbedUrl && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-xs font-medium text-green-800 mb-1">✅ Extracted Embed URL:</p>
                  <p className="text-xs text-green-700 break-all font-mono">{content.mapEmbedUrl}</p>
                </div>
              )}

              <div className="p-4 bg-blue-50 rounded-lg flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-700">
                  <p className="font-bold">How to get the embed code:</p>
                  <ol className="list-decimal ml-4 space-y-1 mt-1">
                    <li>Go to <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="underline font-medium">Google Maps</a> and search your address.</li>
                    <li>Click the <strong>Share</strong> button (or the hamburger menu → Share or embed map).</li>
                    <li>Select the <strong>"Embed a map"</strong> tab.</li>
                    <li>Click <strong>"Copy HTML"</strong> and paste the entire code here.</li>
                  </ol>
                  <p className="mt-2 text-xs opacity-80">You can paste the full <code className="bg-blue-100 px-1 rounded">&lt;iframe&gt;</code> code — we'll extract the URL automatically.</p>
                </div>
              </div>

              {/* Live Preview */}
              {content?.mapEmbedUrl && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Live Preview</label>
                  <div className="h-[350px] rounded-2xl overflow-hidden border shadow-inner bg-muted">
                    <iframe
                      src={content.mapEmbedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
