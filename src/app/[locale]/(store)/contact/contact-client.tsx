"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  Instagram, 
  Facebook, 
  Twitter,
  MessageCircle,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ContactClientProps {
  content: any;
}

export function ContactClient({ content }: ContactClientProps) {
  const t = useTranslations("Contact");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  // Math captcha state
  const [captchaA, setCaptchaA] = useState(0);
  const [captchaB, setCaptchaB] = useState(0);
  const [captchaOp, setCaptchaOp] = useState<"+" | "-" | "*">("+");
  const [captchaAnswer, setCaptchaAnswer] = useState("");

  const generateCaptcha = () => {
    const ops: Array<"+" | "-" | "*"> = ["+", "-", "*"];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a, b;
    
    if (op === "*") {
      a = Math.floor(Math.random() * 10) + 1;
      b = Math.floor(Math.random() * 5) + 1;
    } else {
      a = Math.floor(Math.random() * 20) + 1;
      b = Math.floor(Math.random() * 10) + 1;
    }

    // Ensure subtraction doesn't go negative
    if (op === "-" && b > a) {
      [a, b] = [b, a];
    }
    setCaptchaA(a);
    setCaptchaB(b);
    setCaptchaOp(op);
    setCaptchaAnswer("");
  };

  // Generate captcha on mount
  useState(() => {
    generateCaptcha();
  });

  const getCorrectAnswer = () => {
    if (captchaOp === "+") return captchaA + captchaB;
    if (captchaOp === "-") return captchaA - captchaB;
    return captchaA * captchaB;
  };

  const heroTitle = content?.heroTitle || t('title');
  const heroSubtitle = content?.heroSubtitle || t('subtitle');
  const heroDesc = content?.heroDescription || t('description');

  const contactInfo = [
    { 
      icon: <Mail className="h-6 w-6" />, 
      label: t('info.email'), 
      value: content?.email || "hello@momsnaturalfoods.com",
      href: `mailto:${content?.email || "hello@momsnaturalfoods.com"}`
    },
    { 
      icon: <Phone className="h-6 w-6" />, 
      label: t('info.phone'), 
      value: content?.phone || "+31 (0) 612345678",
      href: `tel:${content?.phone?.replace(/\s/g, '') || "+31612345678"}`
    },
    { 
      icon: <MapPin className="h-6 w-6" />, 
      label: t('info.address'), 
      value: content?.address || "Amsterdam, Netherlands",
      href: "#"
    },
    { 
      icon: <Clock className="h-6 w-6" />, 
      label: t('info.hours'), 
      value: content?.hours || "Mon-Fri: 9:00 - 18:00",
      href: null
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate captcha
    if (parseInt(captchaAnswer) !== getCorrectAnswer()) {
      toast.error("Incorrect answer. Please try again.");
      generateCaptcha();
      return;
    }

    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send message");
      }

      toast.success(t('form.success'));
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      generateCaptcha();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-transparent">

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Dynamic Background */}
        {content?.heroBackgroundUrl ? (
          <>
            {content.heroBackgroundType === "video" ? (
              <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0"
                src={content.heroBackgroundUrl}
              />
            ) : (
              <div
                className="absolute inset-0 w-full h-full bg-cover bg-center z-0"
                style={{ backgroundImage: `url(${content.heroBackgroundUrl})` }}
              />
            )}
            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-black/60 z-[1]" />
          </>
        ) : (
          /* Fallback gradient */
          <div className="absolute inset-0 bg-secondary z-0">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/50 via-transparent to-transparent" />
            <div className="absolute inset-0 opacity-10 bg-[url('/grain_texture.png')] bg-repeat" />
          </div>
        )}
        
        <div className="container mx-auto px-6 relative z-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-accent text-sm font-bold tracking-widest uppercase">
              <MessageCircle className="h-4 w-4" />
              {heroSubtitle}
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-serif font-bold italic tracking-tight leading-[1.1]">
              {heroTitle}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl font-light text-white/80 font-serif italic max-w-2xl mx-auto">
              {heroDesc}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-12 md:py-24 relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Contact Form */}
            <motion.div {...fadeIn} className="lg:col-span-7">
              <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 shadow-2xl border border-zinc-100">
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-secondary italic mb-8">
                  {t('form.send')}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-700 uppercase tracking-wider">{t('form.name')}</label>
                      <Input 
                        required 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe" 
                        className="h-14 rounded-2xl bg-zinc-50 border-zinc-100 focus:ring-accent transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-700 uppercase tracking-wider">{t('form.email')}</label>
                      <Input 
                        required 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com" 
                        className="h-14 rounded-2xl bg-zinc-50 border-zinc-100 focus:ring-accent transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-700 uppercase tracking-wider">{t('form.phone')}</label>
                      <Input 
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+31 612345678" 
                        className="h-14 rounded-2xl bg-zinc-50 border-zinc-100 focus:ring-accent transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-700 uppercase tracking-wider">{t('form.subject')}</label>
                      <Input 
                        required 
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="How can we help?" 
                        className="h-14 rounded-2xl bg-zinc-50 border-zinc-100 focus:ring-accent transition-all"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700 uppercase tracking-wider">{t('form.message')}</label>
                    <Textarea 
                      required 
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Your message here..." 
                      className="min-h-[200px] rounded-3xl bg-zinc-50 border-zinc-100 focus:ring-accent transition-all p-6"
                    />
                  </div>

                  {/* Math Captcha */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-2">
                      🔒 {t('form.captcha')}
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 h-14 px-6 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center">
                        <span className="text-lg font-bold text-secondary font-mono">
                          {captchaA} {captchaOp === "*" ? "x" : captchaOp} {captchaB} = ?
                        </span>
                      </div>
                      <Input
                        required
                        type="number"
                        value={captchaAnswer}
                        onChange={(e) => setCaptchaAnswer(e.target.value)}
                        placeholder="Your answer"
                        className="h-14 rounded-2xl bg-zinc-50 border-zinc-100 focus:ring-accent transition-all max-w-[150px]"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    disabled={isSubmitting}
                    className="w-full h-16 rounded-[2rem] bg-secondary hover:bg-accent text-white font-bold text-lg shadow-xl transition-all gap-3"
                  >
                    {isSubmitting ? t('form.sending') : t('form.send')}
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="lg:col-span-5 space-y-8">
              <div className="grid grid-cols-1 gap-6">
                {contactInfo.map((info, idx) => (
                  <div 
                    key={idx}
                    className="group flex items-center md:items-start gap-4 md:gap-6 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-secondary/5 border border-secondary/10 hover:bg-white hover:shadow-2xl transition-all duration-500"
                  >
                    <div className="h-12 w-12 md:h-14 md:w-14 shrink-0 rounded-xl md:rounded-2xl bg-secondary text-white flex items-center justify-center group-hover:bg-accent group-hover:scale-110 transition-all duration-500 shadow-lg">
                      {React.cloneElement(info.icon as React.ReactElement, { className: "h-5 w-5 md:h-6 md:w-6" })}
                    </div>
                    <div className="space-y-0.5 md:space-y-1 min-w-0">
                      <p className="text-[10px] md:text-xs font-bold text-accent uppercase tracking-widest">{info.label}</p>
                      {info.href ? (
                        <a href={info.href} className="text-lg md:text-xl font-serif font-bold text-secondary hover:text-accent transition-colors italic break-words line-clamp-2 md:line-clamp-none">
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-lg md:text-xl font-serif font-bold text-secondary italic break-words line-clamp-2 md:line-clamp-none">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-accent text-secondary">
                <h3 className="text-xl md:text-2xl font-serif font-bold italic mb-6">Follow Our Journey</h3>
                <div className="flex gap-4">
                  {[
                    { icon: <Instagram />, href: "#" },
                    { icon: <Facebook />, href: "#" },
                    { icon: <Twitter />, href: "#" },
                  ].map((social, i) => (
                    <a 
                      key={i} 
                      href={social.href} 
                      className="h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white hover:text-accent transition-all duration-500"
                    >
                      {React.cloneElement(social.icon as React.ReactElement, { className: "h-5 w-5 md:h-6 md:w-6" })}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      {content?.mapEmbedUrl && (() => {
        // Extract src from iframe HTML if accidentally stored as full embed code
        let mapSrc = content.mapEmbedUrl;
        const srcMatch = mapSrc.match(/src=["']([^"']+)["']/i);
        if (srcMatch && srcMatch[1]) {
          mapSrc = srcMatch[1];
        }
        return (
        <section className="py-24 px-6">
          <motion.div 
            {...fadeIn}
             className="container mx-auto h-[500px] rounded-[4rem] overflow-hidden shadow-2xl border-4 border-white"
          >
            <iframe 
              src={mapSrc}
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </section>
        );
      })()}

      {/* FAQs Highlight */}
      <section className="py-24 bg-white border-y border-zinc-100">
        <div className="container mx-auto px-6 text-center">
            <motion.div {...fadeIn} className="max-w-2xl mx-auto space-y-8">
                <h2 className="text-4xl md:text-5xl font-serif font-bold italic text-secondary">Looking for something else?</h2>
                <p className="text-lg text-zinc-500 font-light italic font-serif">
                   Check out our Frequently Asked Questions or visit our product catalog to explore our natural goodies.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button variant="outline" className="h-14 px-8 rounded-full border-secondary text-secondary hover:bg-secondary hover:text-white font-bold transition-all">
                        Visit FAQ
                    </Button>
                    <Button className="h-14 px-8 rounded-full bg-accent text-secondary hover:bg-secondary hover:text-white font-bold shadow-xl transition-all group">
                        Browse Products
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </motion.div>
        </div>
      </section>

    </div>
  );
}
