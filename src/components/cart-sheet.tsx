"use client";

import React, { useEffect, useState } from "react";
import { 
  ShoppingCart, 
  Trash2, 
  Minus, 
  Plus, 
  ArrowRight,
  ShoppingBasket
} from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/store/use-cart";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function CartSheet() {
  const cart = useCart();
  const t = useTranslations("Cart");
  const [mounted, setMounted] = useState(false);

  // Prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="relative group">
        <ShoppingBasket className="h-6 w-6 text-foreground group-hover:text-primary transition-colors" />
      </Button>
    );
  }

  const total = cart.totalPrice();
  const itemCount = cart.totalItems();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative group">
          <ShoppingBasket className="h-6 w-6 text-foreground group-hover:text-primary transition-colors" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center animate-in zoom-in">
              {itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg border-l-primary/10 bg-background/95 backdrop-blur-xl">
        <SheetHeader className="px-6 border-b pb-4">
          <SheetTitle className="font-serif text-2xl flex items-center gap-2 text-secondary">
            {t('title')}
            <span className="text-sm font-sans font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full mt-1">
              {itemCount} {t('items')}
            </span>
          </SheetTitle>
        </SheetHeader>
        
        {itemCount > 0 ? (
          <>
            <ScrollArea className="flex-1 pr-6 pb-4">
              <div className="flex flex-col gap-5 p-6">
                <AnimatePresence mode="popLayout">
                  {cart.items.map((item) => (
                    <motion.div
                      layout
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex items-center gap-4 group"
                    >
                      <div className="h-20 w-20 flex-shrink-0 rounded-xl bg-muted overflow-hidden border border-primary/5 flex items-center justify-center relative shadow-sm">
                         {item.image ? (
                           <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                         ) : (
                           <span className="font-serif text-2xl text-primary/30 uppercase">{item.name[0]}</span>
                         )}
                      </div>
                      <div className="flex flex-1 flex-col self-start">
                        <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                          {item.category}
                        </span>
                        <h4 className="font-serif text-lg leading-none mb-2 text-secondary group-hover:text-primary transition-colors">
                          {item.name}
                        </h4>
                        <div className="flex items-center justify-between mt-auto">
                           <div className="flex items-center border rounded-lg overflow-hidden bg-muted/50">
                              <button 
                                onClick={() => cart.updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 px-2 hover:bg-primary/10 transition-colors"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="px-3 text-sm font-bold min-w-[30px] text-center">
                                {item.quantity}
                              </span>
                              <button 
                                onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 px-2 hover:bg-primary/10 transition-colors"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                           </div>
                           <p className="font-serif font-bold text-primary">
                             €{(item.price * item.quantity).toFixed(2)}
                           </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => cart.removeItem(item.id)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
            <div className="px-6 py-6 bg-muted/20 mt-auto border-t space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-muted-foreground text-sm uppercase tracking-widest font-semibold">
                  <span>Subtotal</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground text-sm uppercase tracking-widest font-semibold">
                  <span>Shipping</span>
                  <span className="text-secondary">Free</span>
                </div>
                <Separator className="my-4" />
                <div className="flex items-center justify-between text-xl font-bold font-serif text-secondary">
                  <span>{t('total')}</span>
                  <span className="text-primary text-2xl">€{total.toFixed(2)}</span>
                </div>
              </div>
              <SheetFooter className="pt-2">
                <Link href="/checkout" className="w-full">
                  <Button className="w-full py-6 text-lg font-bold gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform">
                    {t('checkout')}
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </SheetFooter>
              <p className="text-center text-xs text-muted-foreground mt-4 italic">
                * Taxes calculated at checkout
              </p>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-6 pt-12">
            <div className="h-40 w-40 rounded-full bg-muted/50 flex items-center justify-center relative">
               <motion.div
                 animate={{ y: [0, -10, 0] }}
                 transition={{ repeat: Infinity, duration: 2 }}
               >
                 <ShoppingCart className="h-20 w-20 text-muted-foreground/30" />
               </motion.div>
               <div className="absolute top-8 right-8 h-4 w-4 bg-primary/20 rounded-full blur-xl" />
            </div>
            <div className="text-center space-y-2">
               <h3 className="font-serif text-2xl text-secondary">{t('empty')}</h3>
               <p className="text-muted-foreground max-w-[250px]">
                 Explore our wholesome natural products and find something healthy today.
               </p>
            </div>
            <SheetTrigger asChild>
              <Button variant="outline" className="mt-4 gap-2">
                Continue Shopping
                <ArrowRight className="h-4 w-4" />
              </Button>
            </SheetTrigger>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

