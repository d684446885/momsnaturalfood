"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react";
import { PwaInstallButton } from "./pwa-install-button";
import { useTranslations } from "next-intl";
import React from "react";
import { toast } from "sonner";

interface LegalPage {
  id: string;
  title: string;
  slug: string;
}

export function Footer({ 
  legalPages = [],
  businessName,
  newsletterEnabled = true,
}: { 
  legalPages?: LegalPage[];
  businessName?: string | null;
  newsletterEnabled?: boolean;
}) {
  const t = useTranslations("Footer");
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

      toast.success(t('newsletter.success') || "Successfully subscribed!");
      setEmail("");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="bg-footer border-t"
    >
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="font-serif text-2xl font-bold text-secondary">
              {businessName || "MoM's NaturalFood"}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('about')}
            </p>
            <div className="flex space-x-4">
              <motion.a
                href="#"
                whileHover={{ scale: 1.2, color: "#1877f2" }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.2, color: "#1da1f2" }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.2, color: "#e4405f" }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.2, color: "#ff0000" }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </motion.a>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-semibold">{t('quickLinks.title')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('quickLinks.allProducts')}
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('quickLinks.categories')}
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('quickLinks.specialDeals')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('quickLinks.aboutUs')}
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-semibold">{t('customerService.title')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('customerService.contactUs')}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('customerService.faq')}
                </Link>
              </li>
              {legalPages.map((page) => (
                <li key={page.id}>
                  <Link href={`/legal/${page.slug}`} className="text-muted-foreground hover:text-foreground transition-colors">
                    {page.title}
                  </Link>
                </li>
              ))}
              <li>
                <PwaInstallButton variant="footer" />
              </li>
            </ul>
          </motion.div>

          {newsletterEnabled && (
            <motion.div variants={itemVariants} className="space-y-4">
              <h3 className="text-lg font-semibold">{t('newsletter.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('newsletter.description')}
              </p>
              <form onSubmit={onSubscribe} className="flex gap-2">
                <Input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  placeholder={t('newsletter.placeholder')} 
                  className="flex-1 rounded-xl bg-white/5 border-zinc-200 focus:ring-primary h-11" 
                />
                <Button size="icon" type="submit" disabled={isLoading} className="rounded-xl h-11 w-11 shrink-0">
                  {isLoading ? (
                    <div className="h-4 w-4 border-2 border-primary/30 border-t-primary animate-spin rounded-full" />
                  ) : (
                    <Mail className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </motion.div>
          )}
        </div>

        <Separator className="my-8" />

        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground"
        >
          <p>{t('rights')}</p>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-foreground transition-colors">
              {t('privacy')}
            </Link>
            <Link href="/" className="hover:text-foreground transition-colors">
              {t('terms')}
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
