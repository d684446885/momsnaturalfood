"use client";

import React, { useState } from "react";
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
  Info
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
            Manage your store's contact information and page layout.
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
              <CardTitle>Google Maps Integration</CardTitle>
              <CardDescription>Embed a map showing your location.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Embed URL (iframe src)</label>
                <Input 
                  value={content?.mapEmbedUrl || ""}
                  onChange={(e) => setContent({ ...content, mapEmbedUrl: e.target.value })}
                  placeholder="https://www.google.com/maps/embed?..."
                />
              </div>
              <div className="p-4 bg-blue-50 rounded-lg flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-bold">How to get the embed URL:</p>
                  <ol className="list-decimal ml-4 space-y-1 mt-1">
                    <li>Go to Google Maps and find your address.</li>
                    <li>Click <strong>Share</strong>.</li>
                    <li>Select the <strong>Embed a map</strong> tab.</li>
                    <li>Copy only the URL within the <code>src="..."</code> attribute.</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
