"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Leaf, Zap, ShieldCheck, Target } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import dynamic from "next/dynamic";

import WhyUsSection from "@/components/home/why-us-section";
import PromoCardsSection from "@/components/home/promo-cards-section";
import FeaturesSection from "@/components/home/features-section";
import CTASection from "@/components/home/cta-section";


interface HomeClientProps {
  content: any;
  settings: any;
}

export function HomeClient({ content, settings }: HomeClientProps) {
  const t = useTranslations("Hero");
  const tc = useTranslations("Common");
  const tCat = useTranslations("Categories");
  const tSpec = useTranslations("SeasonalSpecials");
  const tCta = useTranslations("CTA");
  const tDetail = useTranslations("ProductDetail");

  // Content Mapping with Fallbacks
  const heroTitle = content?.heroTitle || t('title');
  const heroAccent = content?.heroTitleAccent || t('titleAccent');
  const heroSubtitle = content?.heroSubtitle || t('subtitle');
  const heroDesc = content?.heroDescription || t('description');
  const heroCta1Text = content?.heroPrimaryCtaText || t('shopNow');
  const heroCta1Link = content?.heroPrimaryCtaLink || "/products";
  
  const heroBg = content?.heroBackgroundUrl;
  const isVideoExtension = typeof heroBg === 'string' && 
    (heroBg.split('?')[0].toLowerCase().match(/\.(mp4|webm|ogg|mov|m4v|quicktime)$/) !== null);
  const isHeroVideo = content?.heroBackgroundType === "video" || isVideoExtension;

  const categoriesTitle = content?.categoriesTitle || tCat('title');
  const categoriesSubtitle = content?.categoriesSubtitle || tCat('subtitle');
  
  const featuredTitle = content?.featuredTitle || tSpec('title');
  const featuredSubtitle = content?.featuredSubtitle || tSpec('subtitle');

  // Why Us Section
  const whyTitle = content?.whyTitle || "Why Mom's Naturals Foods?";
  const whyDescription = content?.whyDescription || "We create MOM'S Naturals Foods...";
  const whyLearnMoreText = content?.whyLearnMoreText || "Learn More";
  const whyLearnMoreLink = content?.whyLearnMoreLink || "/about";
  const whyBackgroundUrl = content?.whyBackgroundUrl;
  const whyCards = content?.whyCards || [];
  
  const ctaTitle = content?.ctaTitle || tCta('title');
  const ctaSubtitle = content?.ctaSubtitle || tCta('subtitle');
  const ctaMediaUrl = content?.ctaMediaUrl || "";
  const ctaMediaType = content?.ctaMediaType || "image";

  const promoCards = content?.promoCards || [];
  const promoSectionBgUrl = content?.promoSectionBgUrl || "";

  // Features logic
  const defaultFeatures = [
    { icon: "Truck", title: tDetail('freeShipping'), description: tDetail('freeShippingDesc') },
    { icon: "Shield", title: tDetail('pure'), description: tDetail('pureDesc') },
    { icon: "RefreshCw", title: tDetail('happinessGuarantee'), description: tDetail('happinessGuaranteeDesc') },
    { icon: "Star", title: tc('freshlyBoxed'), description: tSpec('subtitle') },
  ];
  
  const featuresList = (Array.isArray(content?.features) && content.features.length > 0) 
    ? content.features 
    : defaultFeatures;

  return (
    <div className="min-h-screen bg-transparent">

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          {heroBg ? (
              isHeroVideo ? (
                <>
                  {/* Loading placeholder - shows instantly while video buffers */}
                  <div className="absolute inset-0 bg-secondary z-[1] transition-opacity duration-700 peer-[:not([data-loading])]/video:opacity-0">
                    <div className="absolute inset-0 opacity-20 bg-[url('/grain_texture.png')] bg-repeat" />
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/80 to-secondary" />
                  </div>
                  <video 
                    key={heroBg}
                    src={heroBg}
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    preload="metadata"
                    className="w-full h-full object-cover object-center"
                    style={{ willChange: 'auto' }}
                    onCanPlay={(e) => {
                      // Hide the loading placeholder once video is ready
                      const placeholder = e.currentTarget.previousElementSibling;
                      if (placeholder) (placeholder as HTMLElement).style.opacity = '0';
                    }}
                  />
                </>
              ) : (
                <Image 
                  src={heroBg} 
                  alt="Hero" 
                  fill 
                  className="object-cover object-center scale-105 animate-slow-zoom" 
                  priority 
                />
              )
          ) : (
            <div className="w-full h-full bg-secondary">
               <div className="absolute inset-0 opacity-20 bg-[url('/grain_texture.png')] bg-repeat" />
               <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/80 to-secondary" />
            </div>
          )}
          {/* Centered Gradient Overlay for Readability */}
          <div className="absolute inset-0 bg-black/40 pointer-events-none z-[2]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none z-[2]" />
        </div>
        
        <div className="relative z-20 container mx-auto px-6 pt-20 flex flex-col items-center justify-center text-center">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8 flex flex-col items-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium tracking-widest uppercase">
                <Sparkles className="h-4 w-4 text-accent" />
                Moms Natural Foods
              </div>
              
              <h1 className="font-serif text-5xl md:text-8xl font-bold text-white leading-[1.1] italic">
                {heroTitle}{" "}
                <span className="text-accent block md:inline not-italic font-sans font-black uppercase tracking-tighter text-4xl md:text-7xl opacity-90">
                  {heroAccent}
                </span>{" "}
                {heroSubtitle}
              </h1>

              <p className="text-xl md:text-2xl text-white/90 font-light max-w-2xl leading-relaxed font-serif italic">
                {heroDesc}
              </p>
              

            </motion.div>
          </div>
        </div>

        {/* Floating Quality Tag Cards */}
        {/* Top Left - Organic */}
        <div className="absolute top-32 left-10 z-20 hidden xl:flex">
             <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 1, duration: 0.8 }}
               className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 flex items-center gap-4 shadow-2xl"
             >
                <div className="h-10 w-10 rounded-xl bg-accent/20 flex items-center justify-center">
                   <Leaf className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Certified</p>
                  <p className="text-sm font-serif italic text-white">100% Organic</p>
                </div>
             </motion.div>
        </div>

        {/* Top Right - Farm Fresh */}
        <div className="absolute top-32 right-10 z-20 hidden xl:flex">
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 1.2, duration: 0.8 }}
               className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 flex items-center gap-4 shadow-2xl"
             >
                <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                   <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Harvested</p>
                  <p className="text-sm font-serif italic text-white">Farm Fresh</p>
                </div>
             </motion.div>
        </div>

        {/* Bottom Left - No Additives */}
        <div className="absolute bottom-20 left-10 z-20 hidden lg:flex">
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 1.4, duration: 0.8 }}
               className="p-5 bg-white/95 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-zinc-100 flex items-center gap-5"
             >
                <div className="h-12 w-12 rounded-2xl bg-secondary/10 flex items-center justify-center">
                   <ShieldCheck className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-tighter text-secondary">No Additives</p>
                  <p className="text-[10px] text-zinc-500 font-medium">Naturally Preserved</p>
                </div>
             </motion.div>
        </div>

        {/* Bottom Right - 100% Pure */}
        <div className="absolute bottom-20 right-10 z-20 hidden lg:flex">
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 1.6, duration: 0.8 }}
               className="p-5 bg-white/95 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-zinc-100 flex items-center gap-5"
             >
                <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                   <Target className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-tighter text-accent">100% Pure</p>
                  <p className="text-[10px] text-zinc-500 font-medium">Quality Guaranteed</p>
                </div>
             </motion.div>
        </div>
      </section>

      {/* Lazy Loaded Sections */}
      <WhyUsSection 
        whyTitle={whyTitle}
        whyDescription={whyDescription}
        whyLearnMoreText={whyLearnMoreText}
        whyLearnMoreLink={whyLearnMoreLink}
        whyBackgroundUrl={whyBackgroundUrl}
        whyCards={whyCards}
      />

      <PromoCardsSection 
        promoCards={promoCards}
        promoSectionBgUrl={promoSectionBgUrl}
      />

      <FeaturesSection featuresList={featuresList} />

      {settings.newsletterEnabled !== false && (
        <CTASection 
          ctaTitle={ctaTitle}
          ctaSubtitle={ctaSubtitle}
          ctaMediaUrl={ctaMediaUrl}
          ctaMediaType={ctaMediaType}
          placeholderText={tCta('placeholder')}
          subscribeText={tCta('subscribe')}
        />
      )}
    </div>
  );
}
