"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Search, ShoppingCart, Menu, Heart, User } from "lucide-react";
import { CartSheet } from "./cart-sheet";
import { UserNav } from "./user-nav";
import { LocaleSwitcher } from "./locale-switcher";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export function Navbar() {
  const t = useTranslations("Navbar");
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 items-center px-4">
        <div className="mr-8 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2 font-bold text-2xl">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-serif text-primary"
            >
              MoM's NaturalFood
            </motion.span>
          </Link>
          <div className="flex items-center space-x-6 text-sm font-medium">
            <Link
              className="transition-colors hover:text-foreground/80 text-foreground"
              href="/"
            >
              {t('home')}
            </Link>
            <Link
              className="transition-colors hover:text-foreground/80 text-foreground"
              href="/products"
            >
              {t('products')}
            </Link>
            <Link
              className="transition-colors hover:text-foreground/80 text-foreground"
              href="/about"
            >
              {t('about')}
            </Link>
            <Link
              className="transition-colors hover:text-foreground/80 text-foreground"
              href="/deals"
            >
              {t('deals')}
            </Link>
            <Link
              className="transition-colors hover:text-foreground/80 text-foreground"
              href="/contact"
            >
              {t('contact')}
            </Link>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative hidden lg:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Zoek natuurlijke producten..."
                className="pl-8 w-[200px] lg:w-[300px] h-9 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>
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
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-6">
                  <Link href="/" className="text-lg font-medium">
                    {t('home')}
                  </Link>
                  <Link href="/products" className="text-lg font-medium">
                    {t('products')}
                  </Link>
                  <Link href="/about" className="text-lg font-medium">
                    {t('about')}
                  </Link>
                  <Link href="/deals" className="text-lg font-medium">
                    {t('deals')}
                  </Link>
                  <Link href="/contact" className="text-lg font-medium">
                    {t('contact')}
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </nav>
        </div>
      </div>
    </motion.nav>
  );
}
