"use client";

import React from "react";
import { useWishlist } from "@/store/use-wishlist";
import { useCart } from "@/store/use-cart";
import { ProductCard } from "@/components/product-card";
import { useTranslations } from "next-intl";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function WishlistPage() {
  const wishlist = useWishlist();
  const cart = useCart();
  const t = useTranslations("Account");
  const ct = useTranslations("Common");

  if (wishlist.items.length === 0) {
    return (
      <div className="container px-4 py-20 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-secondary/5 rounded-full flex items-center justify-center mb-6">
          <Heart className="h-10 w-10 text-muted-foreground/40" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-secondary mb-4">
          {t('wishlistEmpty')}
        </h1>
        <p className="text-muted-foreground max-w-md mb-8">
          {t('wishlistDescription')}
        </p>
        <Link href="/products">
          <Button size="lg" className="rounded-full px-8">
            {ct('viewAll')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold text-secondary mb-2">
            {t('wishlist')}
          </h1>
          <p className="text-muted-foreground">
            {t('wishlistCount', { count: wishlist.items.length })}
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => wishlist.clearWishlist()}
            className="text-destructive hover:bg-destructive/5 hover:text-destructive border-destructive/20"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t('clearWishlist')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {wishlist.items.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <ProductCard 
                product={{
                  id: item.id,
                  name: item.name,
                  description: item.description,
                  price: item.price,
                  salePrice: item.salePrice,
                  stock: item.stock,
                  images: [item.image || ""],
                  category: { id: "", name: item.category, slug: "" }
                }} 
                index={index}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
