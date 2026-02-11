"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SingleMediaUpload } from "@/components/single-media-upload";
import { toast } from "sonner";
import { Loader2, Save, X, Plus } from "lucide-react";

interface AboutPageContent {
  heroTitle: string;
  heroDescription: string;
  heroBackgroundUrl: string | null;
  heroBackgroundType: "image" | "video";
  storyTitle: string;
  storySubtitle: string;
  storyContent: string;
  storyImageUrl: string | null;
  storyImageType: "image" | "video";
  missionTitle: string;
  missionContent: string;
  missionImageUrl: string | null;
  missionImageType: "image" | "video";
  qualityTitle: string;
  qualityDescription: string;
  qualityBackgroundUrl: string | null;
  qualityBackgroundType: "image" | "video";
  values: {
    title: string;
    description: string;
    icon: string;
  }[];
}

interface AboutCMSClientProps {
  initialContent: AboutPageContent;
}

export function AboutCMSClient({ initialContent }: AboutCMSClientProps) {
  const t = useTranslations("Dashboard");
  const [content, setContent] = useState<AboutPageContent>(initialContent);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/cms/about", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save content");
      }

      toast.success("About page updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update about page");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">About Page CMS</h2>
          <p className="text-muted-foreground">
            Manage the content for your 'About Us' page dynamically.
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
          <TabsTrigger value="story">Our Story</TabsTrigger>
          <TabsTrigger value="mission">Our Mission</TabsTrigger>
          <TabsTrigger value="quality">Quality Section</TabsTrigger>
          <TabsTrigger value="values">Core Values</TabsTrigger>
        </TabsList>

        {/* Hero Section */}
        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Configuration</CardTitle>
              <CardDescription>
                Customize the main banner of the About Us page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Hero Title</label>
                <Input
                  value={content.heroTitle}
                  onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
                  placeholder="e.g. Taste the Love in Every Bite"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Hero Description</label>
                <Textarea
                  value={content.heroDescription}
                  onChange={(e) => setContent({ ...content, heroDescription: e.target.value })}
                  placeholder="Short description under the title"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Background Media</label>
                <SingleMediaUpload
                  value={content.heroBackgroundUrl || ""}
                  type={content.heroBackgroundType || "image"}
                  onChange={(url) => setContent({ ...content, heroBackgroundUrl: url })}
                  onTypeChange={(type) => setContent({ ...content, heroBackgroundType: type as "image" | "video" })}
                  label="Upload Hero Background"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Story Section */}
        <TabsContent value="story" className="space-y-4">
          <Card>
             <CardHeader>
              <CardTitle>Our Story</CardTitle>
              <CardDescription>
                Share the history and origin of your brand.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={content.storyTitle}
                  onChange={(e) => setContent({ ...content, storyTitle: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subtitle</label>
                <Input
                  value={content.storySubtitle}
                  onChange={(e) => setContent({ ...content, storySubtitle: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  className="min-h-[150px]"
                  value={content.storyContent}
                  onChange={(e) => setContent({ ...content, storyContent: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Story Media</label>
                <SingleMediaUpload
                  value={content.storyImageUrl || ""}
                  type={content.storyImageType || "image"}
                  onChange={(url) => setContent({ ...content, storyImageUrl: url })}
                  onTypeChange={(type) => setContent({ ...content, storyImageType: type as "image" | "video" })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mission Section */}
        <TabsContent value="mission" className="space-y-4">
           <Card>
             <CardHeader>
              <CardTitle>Our Mission</CardTitle>
              <CardDescription>
                Define your company's goals and purpose.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={content.missionTitle}
                  onChange={(e) => setContent({ ...content, missionTitle: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  className="min-h-[150px]"
                  value={content.missionContent}
                  onChange={(e) => setContent({ ...content, missionContent: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quality Section */}
        <TabsContent value="quality" className="space-y-4">
           <Card>
             <CardHeader>
              <CardTitle>Quality You Can Trust</CardTitle>
              <CardDescription>
                Customize the high-impact banner near the bottom of the page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={content.qualityTitle}
                  onChange={(e) => setContent({ ...content, qualityTitle: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  className="min-h-[100px]"
                  value={content.qualityDescription}
                  onChange={(e) => setContent({ ...content, qualityDescription: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Background Media</label>
                <SingleMediaUpload
                  value={content.qualityBackgroundUrl || ""}
                  type={content.qualityBackgroundType || "image"}
                  onChange={(url) => setContent({ ...content, qualityBackgroundUrl: url })}
                  onTypeChange={(type) => setContent({ ...content, qualityBackgroundType: type as "image" | "video" })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Values Section */}
        <TabsContent value="values" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Core Values</CardTitle>
              <CardDescription>
                Define the principles that guide your business (JSON format for now).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {content.values.map((value, index) => (
                  <div key={index} className="flex gap-4 items-start p-4 border rounded-lg bg-muted/20 relative group">
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="space-y-2">
                           <label className="text-sm font-medium">Value Title</label>
                           <Input 
                              value={value.title}
                              onChange={(e) => {
                                const newValues = [...content.values];
                                newValues[index].title = e.target.value;
                                setContent({ ...content, values: newValues });
                              }}
                              placeholder="e.g. Sustainability"
                           />
                         </div>
                         <div className="space-y-2">
                           <label className="text-sm font-medium">Icon Name (Lucide)</label>
                           <Input 
                              value={value.icon}
                              onChange={(e) => {
                                const newValues = [...content.values];
                                newValues[index].icon = e.target.value;
                                setContent({ ...content, values: newValues });
                              }}
                              placeholder="e.g. Leaf"
                           />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-sm font-medium">Description</label>
                         <Textarea 
                            value={value.description}
                            onChange={(e) => {
                              const newValues = [...content.values];
                              newValues[index].description = e.target.value;
                              setContent({ ...content, values: newValues });
                            }}
                            placeholder="Brief description of this value"
                         />
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        const newValues = content.values.filter((_, i) => i !== index);
                        setContent({ ...content, values: newValues });
                      }}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  variant="outline"
                  className="w-full border-dashed"
                  onClick={() => {
                    setContent({
                      ...content,
                      values: [...content.values, { title: "", description: "", icon: "Star" }]
                    });
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Value
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
      </Tabs>
    </div>
  );
}
