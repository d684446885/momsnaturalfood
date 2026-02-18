"use client";

import React, { useState } from "react";
import { 
  Save, 
  Loader2, 
  PlaySquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SingleMediaUpload } from "@/components/single-media-upload";
import { toast } from "sonner";

interface CertificationsCMSClientProps {
  initialContent: any;
}

export function CertificationsCMSClient({ initialContent }: CertificationsCMSClientProps) {
  const [content, setContent] = useState(initialContent || {});
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/cms/certifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      if (!response.ok) {
        throw new Error("Failed to save content");
      }

      toast.success("Certifications page updated successfully");
    } catch (error) {
      toast.error("Failed to update certifications page");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Certifications Page CMS</h2>
          <p className="text-muted-foreground">
            Manage the content for your Certifications page.
          </p>
        </div>
        <Button onClick={handleSave} disabled={isLoading} className="gap-2">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Hero Configuration</CardTitle>
            <CardDescription>Main banner of the Certifications page.</CardDescription>
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
              <PlaySquare className="h-5 w-5" />
              Hero Background Media
            </CardTitle>
            <CardDescription>Set a background image or video for the hero section.</CardDescription>
          </CardHeader>
          <CardContent>
            <SingleMediaUpload
              value={content.heroBackgroundUrl || ""}
              type={content.heroBackgroundType || "image"}
              onChange={(url) => setContent({ ...content, heroBackgroundUrl: url })}
              onTypeChange={(type) => setContent({ ...content, heroBackgroundType: type as "image" | "video" })}
              label="Hero Background (Image or Video)"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
