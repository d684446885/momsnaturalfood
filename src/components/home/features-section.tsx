"use client";

import React from "react";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { Star } from "lucide-react";

interface FeaturesSectionProps {
  featuresList: any[];
}

export default function FeaturesSection({ featuresList }: FeaturesSectionProps) {
  // Helper to get icon component
  const getIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName] || Star;
    return IconComponent;
  };

  return (
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
            )
          })}
        </div>
      </div>
    </section>
  );
}
