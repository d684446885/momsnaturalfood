"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Award, X, Search, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Certification {
  id: string;
  title: string;
  imageUrl: string;
  order: number;
}

interface CertificationsClientProps {
  certifications: Certification[];
}

export function CertificationsClient({ certifications }: CertificationsClientProps) {
  const t = useTranslations("AdminCertifications");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="flex flex-col min-h-screen bg-transparent">

      {/* Certifications Grid */}
      <section className="py-24 bg-zinc-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
             <h2 className="font-serif text-3xl md:text-5xl font-bold text-secondary italic">
                Our Achievement Badges
             </h2>
             <div className="h-1 w-20 bg-accent mx-auto rounded-full" />
             <p className="text-zinc-500 max-w-2xl mx-auto font-light italic">
                These symbols represent the standard of excellence we uphold in every batch we produce.
             </p>
          </div>

          {certifications.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {certifications.map((cert, idx) => (
                <motion.div
                  key={cert.id}
                  {...fadeIn}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setSelectedImage(cert.imageUrl)}
                  className="group relative aspect-square rounded-[2rem] overflow-hidden bg-white border border-zinc-100 hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500 cursor-zoom-in"
                >
                  <div className="relative w-full h-full p-6 md:p-10 grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110">
                    <Image
                      src={cert.imageUrl}
                      alt={cert.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/40 transition-all duration-500 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                      <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg">
                        <ZoomIn className="h-6 w-6 text-secondary" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Title overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-secondary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <p className="text-white text-center text-sm font-serif italic">{cert.title}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-zinc-200">
               <Award className="h-16 w-16 text-zinc-300 mx-auto mb-4" />
               <p className="text-zinc-400 font-serif italic">Our certifications are being prepared for display.</p>
            </div>
          )}
        </div>
      </section>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full h-full max-h-[90vh]"
            >
              <Image
                src={selectedImage}
                alt="Certification Preview"
                fill
                className="object-contain"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(null);
                }}
                className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors"
              >
                <X className="h-8 w-8" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact CTA */}
      <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
              <div className="relative rounded-[4rem] bg-accent p-12 md:p-24 overflow-hidden text-center space-y-8">
                  <div className="absolute inset-0 opacity-10 bg-[url('/grain_texture.png')] bg-repeat" />
                  <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                      <h2 className="text-4xl md:text-6xl font-bold text-white font-serif italic">
                         Have questions about our quality standards?
                      </h2>
                      <p className="text-xl text-white/90 font-light italic font-serif">
                         We are committed to total transparency. Feel free to reach out to us for more information about our production process.
                      </p>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Link href="/contact">
                              <Button className="bg-white text-accent hover:bg-secondary hover:text-white rounded-full h-16 px-12 text-lg font-bold shadow-2xl transition-all">
                                 Contact Us
                              </Button>
                          </Link>
                      </motion.div>
                  </div>
              </div>
          </div>
      </section>
    </div>
  );
}
