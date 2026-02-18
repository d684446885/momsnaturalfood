"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import Image from "next/image";

interface WhyUsSectionProps {
  whyTitle: string;
  whyDescription: string;
  whyLearnMoreText: string;
  whyLearnMoreLink: string;
  whyBackgroundUrl?: string | null;
  whyCards: any[];
}

export default function WhyUsSection({
  whyTitle,
  whyDescription,
  whyLearnMoreText,
  whyLearnMoreLink,
  whyBackgroundUrl,
  whyCards,
}: WhyUsSectionProps) {
  return (
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
            preload="auto"
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
                        preload="auto"
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
  );
}
