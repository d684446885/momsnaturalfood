"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import * as LucideIcons from "lucide-react";
import { 
  Leaf, 
  Heart, 
  ShieldCheck, 
  Sparkles, 
  History, 
  Award,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/routing";

interface AboutClientProps {
  content: any;
  certifications?: any[];
}

export function AboutClient({ content, certifications = [] }: AboutClientProps) {
  const t = useTranslations("About");
  const router = useRouter();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  // Helper to get icon component by name
  const getIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName] || Leaf;
    return <IconComponent className="h-8 w-8" />;
  };

  // Get content with fallbacks
  const heroTitle = content?.heroTitle || t('title');
  const heroDesc = content?.heroDescription || t('subtitle');
  const heroBg = content?.heroBackgroundUrl || "/about_hero_background.png";
  const isHeroVideo = content?.heroBackgroundType === "video";

  const storyTitle = content?.storyTitle || t('story.title');
  const storySubtitle = content?.storySubtitle || t('story.subtitle');
  const storyContent = content?.storyContent || t('story.content1');
  const storyImage = content?.storyImageUrl || "/about_ingredients_bokeh.png";
  const isStoryVideo = content?.storyImageType === "video";

  const missionTitle = content?.missionTitle || t('mission.title');
  const missionDesc = content?.missionContent || t('mission.description');

  const qualityTitle = content?.qualityTitle || t('quality.title');
  const qualityDesc = content?.qualityDescription || t('quality.description');
  const qualityBg = content?.qualityBackgroundUrl || null;
  const isQualityVideo = content?.qualityBackgroundType === "video";

  // Parse values or fallback to static list
  const values = Array.isArray(content?.values) && content.values.length > 0 
    ? content.values 
    : [
        {
          icon: "Leaf",
          title: t('mission.point1.title'),
          description: t('mission.point1.description'),
          color: "bg-emerald-50 text-emerald-600"
        },
        {
          icon: "Sparkles",
          title: t('mission.point2.title'),
          description: t('mission.point2.description'),
          color: "bg-amber-50 text-amber-500"
        },
        {
          icon: "ShieldCheck",
          title: t('mission.point3.title'),
          description: t('mission.point3.description'),
          color: "bg-blue-50 text-blue-600"
        }
      ];

  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10" />
          {isHeroVideo ? (
             <video src={heroBg} autoPlay loop muted playsInline className="w-full h-full object-cover scale-105" />
          ) : (
            <Image 
              src={heroBg}
              alt="Hero Background" 
              fill 
              className="object-cover scale-105 animate-slow-zoom"
              priority
            />
          )}
        </div>
        
        <div className="relative z-20 container mx-auto px-6 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 font-serif italic">
               {heroTitle}
            </h1>
            <p className="text-xl md:text-2xl font-light max-w-2xl mx-auto text-gray-100/90 leading-relaxed font-serif italic">
              — {heroDesc} —
            </p>
          </motion.div>
        </div>
      </section>

      {/* Intro Message (Optional, could be part of CMS later, keeping static for now or merging) */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div {...fadeIn}>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-zinc-900 leading-tight">
                {t('hero.title')}
              </h2>
              <div className="h-1.5 w-24 bg-primary mx-auto mb-10 rounded-full" />
              <p className="text-xl text-zinc-600 leading-relaxed font-light">
                 {t('hero.description')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-secondary/5 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
               {...fadeIn}
               transition={{ delay: 0.2 }}
               className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl"
            >
              {isStoryVideo ? (
                <video src={storyImage} autoPlay loop muted playsInline className="w-full h-full object-cover" />
              ) : (
                <Image 
                  src={storyImage} 
                  alt="Our Story" 
                  fill 
                  className="object-cover hover:scale-110 transition-transform duration-[2s]"
                />
              )}
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-[3rem]" />
            </motion.div>

            <motion.div {...fadeIn} className="space-y-8">
              <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-secondary text-white text-xs font-bold uppercase tracking-[0.2em]">
                <History className="h-4 w-4" />
                {storySubtitle}
              </div>
              <h2 className="text-4xl md:text-6xl font-bold text-zinc-900 leading-tight italic font-serif">
                {storyTitle}
              </h2>
              <div className="space-y-6 text-lg text-zinc-600 leading-relaxed font-light whitespace-pre-line font-serif italic">
                <p>{storyContent}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Values Section */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-secondary italic tracking-tight">
               {missionTitle}
            </h2>
            <div className="h-1.5 w-24 bg-accent mx-auto rounded-full" />
            <p className="text-xl text-zinc-500 max-w-3xl mx-auto font-light leading-relaxed whitespace-pre-line italic">
              {missionDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((point: any, idx: number) => {
               const colors = ["text-secondary bg-secondary/5", "text-accent bg-accent/10", "text-primary bg-primary/10"];
               const colorClass = point.color || colors[idx % 3];

               return (
                  <motion.div
                    key={idx}
                    {...fadeIn}
                    transition={{ delay: idx * 0.15 }}
                    className="group relative p-10 rounded-[3rem] bg-zinc-50 hover:bg-white hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500 border border-zinc-100"
                  >
                    <div className={`h-20 w-20 rounded-2xl ${colorClass.split(' ')[1]} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                      <div className={colorClass.split(' ')[0]}>
                         {getIcon(point.icon)}
                      </div>
                    </div>
                    <h3 className="text-3xl font-serif font-bold text-zinc-900 mb-4 italic">{point.title}</h3>
                    <p className="text-zinc-600 leading-relaxed font-light text-lg italic font-serif">
                      {point.description || point.desc}
                    </p>
                    
                    <div className="absolute bottom-10 left-10 h-1 w-0 bg-accent group-hover:w-1/3 transition-all duration-500 rounded-full" />
                  </motion.div>
               );
            })}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      {certifications && certifications.length > 0 && (
        <section className="py-24 bg-zinc-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16 space-y-4">
               <h2 className="font-serif text-3xl md:text-5xl font-bold text-secondary italic">
                  Our Certifications
               </h2>
               <div className="h-1 w-20 bg-accent mx-auto rounded-full" />
               <p className="text-zinc-500 max-w-2xl mx-auto font-light italic">
                  We take pride in our quality standards. Each badge represents our commitment to excellence and your health.
               </p>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24">
              {certifications.map((cert) => (
                <motion.div
                  key={cert.id}
                  {...fadeIn}
                  className="flex flex-col items-center group"
                >
                  <div className="relative h-24 w-24 md:h-32 md:w-32 mb-6 transition-all duration-500 group-hover:scale-110">
                    <Image
                      src={cert.imageUrl}
                      alt={cert.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-sm font-bold uppercase tracking-widest text-zinc-400 group-hover:text-secondary transition-colors text-center max-w-[150px]">
                    {cert.title}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quality Banner (Static for now, but fits theme) */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-secondary z-0">
            {qualityBg ? (
                <>
                    <div className="absolute inset-0 bg-black/40 z-10" />
                    {isQualityVideo ? (
                        <video src={qualityBg} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                    ) : (
                        <Image 
                            src={qualityBg} 
                            alt="Quality Background" 
                            fill 
                            className="object-cover" 
                        />
                    )}
                </>
            ) : (
                <>
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/50 via-transparent to-transparent" />
                    <div className="absolute inset-0 opacity-10 bg-[url('/grain_texture.png')] bg-repeat" />
                </>
            )}
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div {...fadeIn} className="max-w-3xl mx-auto space-y-10">
            <div className="inline-flex items-center gap-2 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white">
                <Award className="h-6 w-6" />
                <span className="text-sm font-bold uppercase tracking-[0.2em]">Quality First</span>
            </div>
            
            <h2 className="text-5xl md:text-8xl font-bold text-white leading-[1.1] font-serif italic">
               {qualityTitle}
            </h2>
            
            <p className="text-xl md:text-3xl text-white/70 font-light leading-relaxed italic font-serif">
              "{qualityDesc}"
            </p>
            <Button 
                size="lg" 
                onClick={() => router.push('/products')}
                className="bg-white text-secondary hover:bg-accent hover:text-white rounded-full h-16 px-10 text-lg font-bold shadow-2xl transition-all hover:-translate-y-2"
            >
                Browse Our Collection
                <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </motion.div>
        </div>
      </section>
      
    </div>
  );
}
