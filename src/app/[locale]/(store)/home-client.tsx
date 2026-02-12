"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import * as LucideIcons from "lucide-react";
import { ShoppingCart, Truck, Shield, RefreshCw, Star, ArrowRight, Sparkles, Leaf, Zap, ShieldCheck, Target } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";

const featuredProducts = [
  { id: 1, name: "Premium Wireless Headphones", price: 299.99, category: "Electronics" },
  { id: 2, name: "Smart Watch Pro", price: 449.99, category: "Electronics" },
  { id: 3, name: "Designer Leather Jacket", price: 599.99, category: "Clothing" },
  { id: 4, name: "Cashmere Sweater", price: 249.99, category: "Clothing" },
];

const categories = [
  { name: "Electronics", count: 120, icon: "⚡" },
  { name: "Clothing", count: 85, icon: "👔" },
  { name: "Accessories", count: 64, icon: "👜" },
  { name: "Home & Decor", count: 42, icon: "🏠" },
];

interface HomeClientProps {
  content: any;
}

export function HomeClient({ content }: HomeClientProps) {
  const t = useTranslations("Hero");
  const tc = useTranslations("Common");
  const tCat = useTranslations("Categories");
  const tSpec = useTranslations("SeasonalSpecials");
  const tCta = useTranslations("CTA");
  const tDetail = useTranslations("ProductDetail");

  // Helper to get icon component
  const getIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName] || Star;
    return IconComponent;
  };

  // Content Mapping with Fallbacks
  const heroTitle = content?.heroTitle || t('title');
  const heroAccent = content?.heroTitleAccent || t('titleAccent');
  const heroSubtitle = content?.heroSubtitle || t('subtitle');
  const heroDesc = content?.heroDescription || t('description');
  const heroCta1Text = content?.heroPrimaryCtaText || t('shopNow');
  const heroCta1Link = content?.heroPrimaryCtaLink || "/products";
  const heroCta2Text = content?.heroSecondaryCtaText || t('viewCollections');
  const heroCta2Link = content?.heroSecondaryCtaLink || "/categories";
  
  const heroBg = content?.heroBackgroundUrl;
  const isVideoExtension = typeof heroBg === 'string' && (
    heroBg.toLowerCase().endsWith('.mp4') || 
    heroBg.toLowerCase().endsWith('.webm') || 
    heroBg.toLowerCase().endsWith('.ogg') ||
    heroBg.toLowerCase().endsWith('.mov')
  );
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
                <video 
                  key={heroBg}
                  src={heroBg}
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="w-full h-full object-cover object-center"
                />
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
          <div className="absolute inset-0 bg-black/40 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
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

      {/* Why Us Section - Cinematic Grid */}
      <section className="relative min-h-screen py-24 flex items-center overflow-hidden">
        {/* Section Background Video */}
        <div className="absolute inset-0 z-0">
          {whyBackgroundUrl ? (
            <video 
              src={whyBackgroundUrl} 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover opacity-30 grayscale-[0.2]"
            />
          ) : (
            <div className="absolute inset-0 bg-secondary/5" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="space-y-8"
            >
              <h2 className="font-serif text-5xl md:text-7xl font-bold text-secondary leading-tight italic">
                {whyTitle}
              </h2>
              <div className="space-y-6">
                {whyDescription.split('\n\n').map((para: string, i: number) => (
                  <p key={i} className="text-lg md:text-xl text-zinc-600 font-light leading-relaxed font-serif italic max-w-xl">
                    {para}
                  </p>
                ))}
              </div>
              <Link href={whyLearnMoreLink}>
                <Button 
                  size="lg" 
                  className="h-14 px-10 rounded-full bg-secondary text-white hover:bg-accent transition-all duration-300 text-lg font-bold shadow-xl"
                >
                  {whyLearnMoreText}
                </Button>
              </Link>
            </motion.div>

            {/* Right Grid */}
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {[0, 1, 2, 3].map((idx) => {
                const card = whyCards?.[idx];
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.15, duration: 0.8 }}
                    className="relative aspect-square rounded-[2rem] overflow-hidden shadow-2xl border border-white/20 group"
                  >
                    {card?.url ? (
                      card.type === "video" ? (
                        <video 
                          src={card.url} 
                          autoPlay 
                          loop 
                          muted 
                          playsInline 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <Image 
                          src={card.url} 
                          alt="" 
                          fill 
                          className="object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                      )
                    ) : (
                      <div className="w-full h-full bg-secondary/10 flex items-center justify-center text-secondary/30">
                         {idx + 1}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Premium Minimalism */}
      <section className="py-20 bg-white border-y border-zinc-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {featuresList.map((feature: any, index: number) => {
              const Icon = getIcon(feature.icon);
              return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center text-center space-y-4 group"
              >
                <div className="h-16 w-16 rounded-3xl bg-secondary/5 text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all duration-500 shadow-sm border border-secondary/10">
                  <Icon className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-xl font-bold text-zinc-900 italic">{feature.title}</h3>
                  <p className="text-sm text-zinc-500 font-light leading-relaxed max-w-[200px]">{feature.description}</p>
                </div>
              </motion.div>
            )})}
          </div>
        </div>
      </section>


      {/* Featured Products - High End Product Cards */}
      <section className="py-24 bg-secondary/5 backdrop-blur-sm rounded-[4rem] mx-6">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-16">
            <div className="space-y-4">
              <h2 className="font-serif text-4xl md:text-6xl font-bold text-secondary italic">{featuredTitle}</h2>
              <p className="text-xl text-zinc-600 font-light italic">{featuredSubtitle}</p>
            </div>
            <Link href="/products">
              <Button variant="outline" className="h-14 px-8 rounded-full border-secondary text-secondary hover:bg-secondary hover:text-white transition-all font-bold">
                {tc('viewAll')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group border-none bg-transparent shadow-none">
                  <div className="aspect-square relative rounded-[3rem] overflow-hidden bg-white shadow-lg group-hover:shadow-2xl transition-all duration-500">
                    <div className="absolute inset-0 bg-neutral-100 flex items-center justify-center overflow-hidden">
                       <span className="text-[10rem] text-zinc-100 font-black absolute -bottom-10 -right-10 leading-none select-none">
                         {product.name.charAt(0)}
                       </span>
                       <motion.div 
                         whileHover={{ scale: 1.1, rotate: 5 }}
                         className="relative z-10 text-7xl drop-shadow-2xl"
                       >
                         {/* Placeholder for actual image */}
                         🥘
                       </motion.div>
                    </div>
                    
                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                      <Badge className="bg-accent text-zinc-900 border-none px-3 py-1 font-bold">
                        {product.category}
                      </Badge>
                      <Badge variant="secondary" className="bg-white/80 backdrop-blur-md text-secondary border-none font-bold">
                        New
                      </Badge>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                       <Button className="w-full h-14 rounded-2xl bg-secondary hover:bg-secondary/80 shadow-xl font-bold gap-3">
                         <ShoppingCart className="h-5 w-5" />
                         {tc('addToBasket')}
                       </Button>
                    </div>
                  </div>
                  
                  <div className="mt-8 space-y-2 px-4">
                    <h3 className="text-2xl font-serif font-bold text-zinc-900 group-hover:text-secondary transition-colors italic">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-zinc-500 font-light italic">Artisanal Quality</p>
                      <p className="text-2xl font-black text-secondary">${product.price.toFixed(2)}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Earthy & Impactful */}
      <section className="py-24 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative min-h-[500px] flex items-center rounded-[4rem] overflow-hidden bg-secondary"
        >
          <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/80 to-transparent z-10" />
             <div className="absolute inset-0 opacity-10 bg-[url('/grain_texture.png')] bg-repeat" />
             {/* Imagine a beautiful background image here of nature */}
             <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80')] bg-cover bg-center" />
          </div>

          <div className="relative z-10 max-w-2xl px-12 md:px-20 py-20 text-white space-y-8">
            <h2 className="text-5xl md:text-7xl font-serif font-bold italic leading-tight">
              {ctaTitle}
            </h2>
            <p className="text-xl text-white/80 font-light italic leading-relaxed">
              {ctaSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md">
              <input
                type="email"
                placeholder={tCta('placeholder')}
                className="flex-1 h-16 px-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              />
              <Button className="h-16 px-10 rounded-2xl bg-accent hover:bg-white text-secondary transition-all font-bold text-lg shadow-xl shadow-accent/20">
                {tCta('subscribe')}
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

    </div>

  );
}
