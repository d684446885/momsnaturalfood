"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface CTASectionProps {
  ctaTitle: string;
  ctaSubtitle: string;
  ctaMediaUrl?: string | null;
  ctaMediaType?: string | null;
  placeholderText: string;
  subscribeText: string;
}

export default function CTASection({
  ctaTitle,
  ctaSubtitle,
  ctaMediaUrl,
  ctaMediaType,
  placeholderText,
  subscribeText,
}: CTASectionProps) {
  return (
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
          {/* Dynamic right-side media */}
          {ctaMediaUrl ? (
            ctaMediaType === "video" ? (
              <video
                src={ctaMediaUrl}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="absolute right-0 top-0 bottom-0 w-1/2 object-cover"
              />
            ) : (
              <div className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden">
                <Image
                  src={ctaMediaUrl}
                  alt={ctaTitle}
                  fill
                  className="object-cover"
                />
              </div>
            )
          ) : (
            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80')] bg-cover bg-center" />
          )}
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
              placeholder={placeholderText}
              className="flex-1 h-16 px-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
            />
            <Button className="h-16 px-10 rounded-2xl bg-accent hover:bg-white text-secondary transition-all font-bold text-lg shadow-xl shadow-accent/20">
              {subscribeText}
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
