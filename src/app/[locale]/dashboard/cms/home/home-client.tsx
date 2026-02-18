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
import { Loader2, Save, X, Plus, PlaySquare } from "lucide-react";

interface HomePageContent {
  heroTitle: string;
  heroTitleAccent: string | null;
  heroSubtitle: string | null;
  heroDescription: string;
  heroPrimaryCtaText: string;
  heroPrimaryCtaLink: string;
  heroSecondaryCtaText: string;
  heroSecondaryCtaLink: string;
  heroBackgroundUrl: string | null;
  heroBackgroundType: "image" | "video";
  features: {
    icon: string;
    title: string;
    description: string;
  }[];
  categoriesTitle: string;
  categoriesSubtitle: string;
  featuredTitle: string;
  featuredSubtitle: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaMediaUrl: string | null;
  ctaMediaType: "image" | "video";
  whyTitle: string;
  whyDescription: string;
  whyLearnMoreText: string;
  whyLearnMoreLink: string;
  whyBackgroundUrl: string | null;
  whyCards: {
    type: "image" | "video";
    url: string;
  }[];
  promoCards: {
    title: string;
    description: string;
    videoUrl: string;
    mediaType: "image" | "video";
  }[];
  promoSectionBgUrl: string | null;
}

interface HomeCMSClientProps {
  initialContent: HomePageContent;
}

export function HomeCMSClient({ initialContent }: HomeCMSClientProps) {
  const [content, setContent] = useState<HomePageContent>(initialContent);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/cms/home", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save content");
      }

      toast.success("Home page updated successfully");
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(error.message || "Failed to update home page");
    } finally {
      setIsLoading(false);
    }
  };

  const updatePromoCard = (index: number, field: string, value: string) => {
    const newPromoCards = [...(content.promoCards || [])];
    
    // Initialize if needed
    for (let i = 0; i <= index; i++) {
        if (!newPromoCards[i]) newPromoCards[i] = { title: "", description: "", videoUrl: "", mediaType: "image" };
    }
    
    (newPromoCards[index] as any)[field] = value;
    setContent({ ...content, promoCards: newPromoCards });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Home Page CMS</h2>
          <p className="text-muted-foreground">
            Manage the content for your Landing Page.
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
          <TabsTrigger value="why">Why Us Section</TabsTrigger>
          <TabsTrigger value="promo">Promo Cards</TabsTrigger>
          <TabsTrigger value="sections">Sections (Headers)</TabsTrigger>
          <TabsTrigger value="cta">CTA Banner</TabsTrigger>
        </TabsList>

        {/* Hero Section */}
        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Configuration</CardTitle>
              <CardDescription>
                Customize the main banner of the Home page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Main Title</label>
                    <Input
                      value={content.heroTitle}
                      onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
                      placeholder="e.g. Wholesome"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Accent Title (Highlighted)</label>
                    <Input
                      value={content.heroTitleAccent || ""}
                      onChange={(e) => setContent({ ...content, heroTitleAccent: e.target.value })}
                      placeholder="e.g. Natural Foods"
                    />
                 </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Subtitle (Optional)</label>
                <Input
                  value={content.heroSubtitle || ""}
                  onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
                  placeholder="Additional subtitle text"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={content.heroDescription}
                  onChange={(e) => setContent({ ...content, heroDescription: e.target.value })}
                  placeholder="Main description text"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Primary CTA Text</label>
                    <Input
                      value={content.heroPrimaryCtaText}
                      onChange={(e) => setContent({ ...content, heroPrimaryCtaText: e.target.value })}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Primary CTA Link</label>
                    <Input
                      value={content.heroPrimaryCtaLink}
                      onChange={(e) => setContent({ ...content, heroPrimaryCtaLink: e.target.value })}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Secondary CTA Text</label>
                    <Input
                      value={content.heroSecondaryCtaText}
                      onChange={(e) => setContent({ ...content, heroSecondaryCtaText: e.target.value })}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Secondary CTA Link</label>
                    <Input
                      value={content.heroSecondaryCtaLink}
                      onChange={(e) => setContent({ ...content, heroSecondaryCtaLink: e.target.value })}
                    />
                 </div>
              </div>
              
              <div className="space-y-2 pt-4 border-t">
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

        {/* Why Us Section */}
        <TabsContent value="why" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Why Us Configuration</CardTitle>
              <CardDescription>
                Customize the specialized grid section after the Hero.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Main Title</label>
                <Input
                  value={content.whyTitle}
                  onChange={(e) => setContent({ ...content, whyTitle: e.target.value })}
                  placeholder="e.g. Why Mom's Naturals Foods?"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={content.whyDescription}
                  onChange={(e) => setContent({ ...content, whyDescription: e.target.value })}
                  className="min-h-[120px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Button Text</label>
                    <Input
                      value={content.whyLearnMoreText}
                      onChange={(e) => setContent({ ...content, whyLearnMoreText: e.target.value })}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Button Link</label>
                    <Input
                      value={content.whyLearnMoreLink}
                      onChange={(e) => setContent({ ...content, whyLearnMoreLink: e.target.value })}
                    />
                 </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                 <label className="text-sm font-medium">Section Background Video</label>
                 <SingleMediaUpload
                    value={content.whyBackgroundUrl || ""}
                    type="video"
                    onChange={(url) => setContent({ ...content, whyBackgroundUrl: url })}
                    onTypeChange={() => {}} // Background is locked to video in this specific section
                    label="Upload Section Background Video"
                 />
              </div>

              <div className="space-y-4 pt-4 border-t">
                <label className="text-sm font-medium">Grid Media (4 items)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[0, 1, 2, 3].map((index) => {
                    const currentCards = content.whyCards || [];
                    const card = currentCards[index] || { type: "video", url: "" };
                    
                    return (
                      <div key={index} className="p-4 border rounded-xl space-y-4 bg-muted/30">
                         <h4 className="font-medium text-sm">Grid Box {index + 1}</h4>
                         <SingleMediaUpload
                            value={card.url || ""}
                            type={card.type || "video"}
                            onChange={(url) => {
                              const newCards = [...(content.whyCards || [])];
                              for (let i = 0; i <= index; i++) {
                                if (!newCards[i]) newCards[i] = { type: "video", url: "" };
                              }
                              newCards[index].url = url;
                              setContent({ ...content, whyCards: newCards });
                            }}
                            onTypeChange={(type) => {
                              const newCards = [...(content.whyCards || [])];
                              for (let i = 0; i <= index; i++) {
                                if (!newCards[i]) newCards[i] = { type: "video", url: "" };
                              }
                              newCards[index].type = type as "image" | "video";
                              setContent({ ...content, whyCards: newCards });
                            }}
                            label={`Box ${index + 1}`}
                         />
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Promo Cards Section */}
        <TabsContent value="promo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlaySquare className="h-5 w-5" />
                Promo Cards Section
              </CardTitle>
              <CardDescription>
                Two square promotional cards shown after the Why Us section.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[0, 1].map((index) => {
                const promo = (content.promoCards || [])[index] || { title: "", description: "", videoUrl: "", mediaType: "image" };
                return (
                  <div key={index} className="p-6 border rounded-[1.5rem] space-y-4 bg-muted/20">
                    <h3 className="font-bold text-lg">Promo Card {index + 1}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Card Title</label>
                          <Input
                            value={promo.title}
                            onChange={(e) => updatePromoCard(index, "title", e.target.value)}
                            placeholder="e.g. Pure Ingredients"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Card Description</label>
                          <Textarea
                            value={promo.description}
                            onChange={(e) => updatePromoCard(index, "description", e.target.value)}
                            placeholder="Brief promotional text"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Card Media</label>
                        <SingleMediaUpload
                          value={promo.videoUrl || ""}
                          type={promo.mediaType || "video"}
                          onChange={(url) => updatePromoCard(index, "videoUrl", url)}
                          onTypeChange={(type) => updatePromoCard(index, "mediaType", type)}
                          label={`Promo Media ${index + 1}`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Section Background Video */}
          <Card>
            <CardHeader>
              <CardTitle>Section Background Video</CardTitle>
              <CardDescription>
                This video plays behind the entire Promo Cards section for a cinematic effect.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SingleMediaUpload
                value={content.promoSectionBgUrl || ""}
                type="video"
                onChange={(url) => setContent({ ...content, promoSectionBgUrl: url })}
                onTypeChange={() => {}}
                label="Upload Section Background Video"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sections Headers */}
        <TabsContent value="sections" className="space-y-4">
           <Card>
             <CardHeader>
                <CardTitle>Global Section Headers</CardTitle>
             </CardHeader>
             <CardContent className="space-y-6">
                <div className="space-y-4 border-b pb-4">
                    <h4 className="font-bold text-secondary">Categories Section</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-normal">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Title</label>
                            <Input
                            value={content.categoriesTitle}
                            onChange={(e) => setContent({ ...content, categoriesTitle: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Subtitle</label>
                            <Input
                            value={content.categoriesSubtitle}
                            onChange={(e) => setContent({ ...content, categoriesSubtitle: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="font-bold text-secondary">Featured Products Section</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-normal">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Title</label>
                            <Input
                            value={content.featuredTitle}
                            onChange={(e) => setContent({ ...content, featuredTitle: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Subtitle</label>
                            <Input
                            value={content.featuredSubtitle}
                            onChange={(e) => setContent({ ...content, featuredSubtitle: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
             </CardContent>
           </Card>
        </TabsContent>

        {/* CTA Banner */}
        <TabsContent value="cta" className="space-y-4">
           <Card>
             <CardHeader>
              <CardTitle>Bottom CTA Banner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={content.ctaTitle}
                  onChange={(e) => setContent({ ...content, ctaTitle: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subtitle</label>
                <Textarea
                  value={content.ctaSubtitle}
                  onChange={(e) => setContent({ ...content, ctaSubtitle: e.target.value })}
                />
              </div>

              <div className="space-y-2 pt-4 border-t">
                <label className="text-sm font-medium">Right Side Media (Image or Video)</label>
                <SingleMediaUpload
                  value={content.ctaMediaUrl || ""}
                  type={content.ctaMediaType || "image"}
                  onChange={(url) => setContent({ ...content, ctaMediaUrl: url })}
                  onTypeChange={(type) => setContent({ ...content, ctaMediaType: type as "image" | "video" })}
                  label="Upload CTA Section Media"
                />
              </div>
             </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
