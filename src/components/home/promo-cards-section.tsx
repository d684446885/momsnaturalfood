"use client";

import React from "react";
import { motion } from "framer-motion";

interface PromoCardsSectionProps {
  promoCards: any[];
  promoSectionBgUrl?: string | null;
}

export default function PromoCardsSection({
  promoCards,
  promoSectionBgUrl,
}: PromoCardsSectionProps) {
  if (!promoCards || promoCards.length === 0) return null;

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Section Background Video */}
      {promoSectionBgUrl ? (
        <>
          <video
            src={promoSectionBgUrl}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
          <div className="absolute inset-0 bg-black/50 z-[1]" />
        </>
      ) : (
        <div className="absolute inset-0 bg-white z-0" />
      )}
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {promoCards.slice(0, 2).map((card: any, idx: number) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="relative group aspect-square rounded-[3rem] overflow-hidden shadow-2xl bg-zinc-100"
            >
              {/* Video Background */}
              {card.videoUrl ? (
                <video
                  src={card.videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="absolute inset-0 bg-secondary/10" />
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

              {/* Content */}
              <div className="absolute inset-0 p-10 flex flex-col justify-end z-20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-3xl font-serif font-bold text-white italic mb-3">
                  {card.title}
                </h3>
                <p className="text-white/80 font-light italic font-serif leading-relaxed line-clamp-2">
                  {card.description}
                </p>
                <div className="mt-6 w-12 h-1 bg-accent rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
