"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import Image from "next/image";

import { toast } from "sonner";

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
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const onSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }

      toast.success("Successfully subscribed to our newsletter!");
      setEmail("");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-12 md:py-24 container mx-auto px-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative flex flex-col md:flex-row md:items-center rounded-3xl md:rounded-[4rem] overflow-hidden bg-secondary"
      >
        {/* Media Section — stacks on top for mobile, right side for desktop */}
        <div className="relative w-full md:absolute md:right-0 md:top-0 md:bottom-0 md:w-1/2">
          {ctaMediaUrl ? (
            ctaMediaType === "video" ? (
              <video
                src={ctaMediaUrl}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="w-full h-48 sm:h-56 md:h-full object-cover"
              />
            ) : (
              <div className="relative w-full h-48 sm:h-56 md:h-full md:absolute md:inset-0">
                <Image
                  src={ctaMediaUrl}
                  alt={ctaTitle}
                  fill
                  className="object-cover"
                />
              </div>
            )
          ) : (
            <div className="w-full h-48 sm:h-56 md:h-full bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80')] bg-cover bg-center" />
          )}
          {/* Mobile gradient overlay — fades from bottom of image into content below */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-secondary md:hidden" />
          {/* Desktop gradient overlay — fades from left */}
          <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/60 to-transparent hidden md:block" />
        </div>

        {/* Grain texture overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('/grain_texture.png')] bg-repeat pointer-events-none z-[1]" />

        {/* Content Section */}
        <div className="relative z-10 w-full md:w-1/2 px-6 sm:px-8 md:px-20 py-10 md:py-20 text-white space-y-5 md:space-y-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif font-bold italic leading-tight">
            {ctaTitle}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/80 font-light italic leading-relaxed">
            {ctaSubtitle}
          </p>
          
          {/* Email Input + Subscribe */}
          <form onSubmit={onSubscribe} className="space-y-3 sm:space-y-0 sm:flex sm:gap-3 max-w-lg">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholderText}
              disabled={isLoading}
              className="w-full sm:flex-1 h-12 sm:h-14 md:h-16 px-5 md:px-6 rounded-xl md:rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-sm md:text-base disabled:opacity-50"
            />
            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto h-12 sm:h-14 md:h-16 px-6 md:px-10 rounded-xl md:rounded-2xl bg-accent hover:bg-white text-secondary transition-all font-bold text-sm md:text-lg shadow-xl shadow-accent/20 gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-secondary/30 border-t-secondary animate-spin rounded-full" />
              ) : (
                <Send className="h-4 w-4 md:h-5 md:w-5" />
              )}
              {isLoading ? "Subscribing..." : subscribeText}
            </Button>
          </form>
        </div>
      </motion.div>
    </section>
  );
}
