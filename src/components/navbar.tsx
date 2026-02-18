"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Search, ShoppingCart, Menu, Heart, User, HelpCircle, FileText } from "lucide-react";
import { CartSheet } from "./cart-sheet";
import { UserNav } from "./user-nav";
import { LocaleSwitcher } from "./locale-switcher";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

import Image from "next/image";

interface LegalPage {
  id: string;
  title: string;
  slug: string;
}

export function Navbar({ 
  legalPages = [],
  logoUrl,
  businessName,
}: { 
  legalPages?: LegalPage[];
  logoUrl?: string | null;
  businessName?: string | null;
}) {
  const t = useTranslations("Navbar");
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 items-center px-4">
        {/* Left: Logo */}
        <div className="flex-1 flex items-center">
          <Link href="/" className="flex items-center">
            {logoUrl ? (
              <div className="relative h-10 w-28">
                <Image 
                  src={logoUrl} 
                  alt="Logo" 
                  fill 
                  className="object-contain object-left"
                />
              </div>
            ) : (
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                M
              </div>
            )}
          </Link>
        </div>

        {/* Center: Menu */}
        <div className="hidden md:flex flex-[2] items-center justify-center">
          <div className="flex items-center space-x-8 text-sm font-medium">
            <Link
              className="transition-colors hover:text-primary text-foreground font-semibold"
              href="/"
            >
              {t('home')}
            </Link>
            <Link
              className="transition-colors hover:text-primary text-foreground font-semibold"
              href="/products"
            >
              {t('products')}
            </Link>
            <Link
              className="transition-colors hover:text-primary text-foreground font-semibold"
              href="/about"
            >
              {t('about')}
            </Link>
            <Link
              className="transition-colors hover:text-primary text-foreground font-semibold"
              href="/contact"
            >
              {t('contact')}
            </Link>
            <div className="relative group">
              <button className="flex items-center gap-1 transition-colors hover:text-primary text-foreground py-2 font-semibold">
                Help
                <span className="text-[10px] opacity-50 group-hover:rotate-180 transition-transform duration-200">▼</span>
              </button>
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-0 w-[400px] bg-white border border-zinc-100 shadow-2xl rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 p-4 transform origin-top scale-95 group-hover:scale-100">
                <div className="grid grid-cols-2 gap-2">
                  <div className="col-span-2 pb-2 mb-2 border-b border-zinc-50">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Customer Support</p>
                  </div>
                  <Link href="/faq" className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/5 transition-all group/item border border-transparent hover:border-secondary/10">
                    <div className="p-2 bg-secondary/10 rounded-lg text-secondary group-hover/item:bg-secondary group-hover/item:text-white transition-colors">
                      <HelpCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-secondary">{t('faq')}</p>
                      <p className="text-[10px] text-muted-foreground">Most asked questions</p>
                    </div>
                  </Link>
                  {legalPages.map((page) => (
                    <Link 
                      key={page.id} 
                      href={`/legal/${page.slug}`} 
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/5 transition-all group/item border border-transparent hover:border-secondary/10"
                    >
                      <div className="p-2 bg-secondary/10 rounded-lg text-secondary group-hover/item:bg-secondary group-hover/item:text-white transition-colors">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-secondary truncate max-w-[120px]">{page.title}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">Legal info</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex-1 flex items-center justify-end space-x-4">
          <div className="relative hidden xl:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Zoek natuurlijke producten..."
              className="pl-8 w-[200px] h-9 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary rounded-full"
            />
          </div>
          <nav className="flex items-center gap-1">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Heart className="h-5 w-5" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <LocaleSwitcher />
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <CartSheet />
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <UserNav />
            </motion.div>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-6 px-6">
                  <Link href="/" className="text-lg font-medium" onClick={() => setIsOpen(false)}>
                    {t('home')}
                  </Link>
                  <Link href="/products" className="text-lg font-medium" onClick={() => setIsOpen(false)}>
                    {t('products')}
                  </Link>
                  <Link href="/about" className="text-lg font-medium" onClick={() => setIsOpen(false)}>
                    {t('about')}
                  </Link>

                  <Link href="/contact" className="text-lg font-medium" onClick={() => setIsOpen(false)}>
                    {t('contact')}
                  </Link>
                  <Link href="/faq" className="text-lg font-medium" onClick={() => setIsOpen(false)}>
                    {t('faq')}
                  </Link>
                  {legalPages.map((page) => (
                    <Link 
                      key={page.id} 
                      href={`/legal/${page.slug}`} 
                      className="text-lg font-medium pl-4 text-muted-foreground border-l-2"
                      onClick={() => setIsOpen(false)}
                    >
                      {page.title}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </nav>
        </div>
      </div>
    </motion.nav>
  );
}
