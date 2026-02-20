"use client";

import React from "react";
import { Home, ShoppingBag, ShoppingCart, LayoutDashboard, Heart, MessageCircle } from "lucide-react";
import { Link } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useWishlist } from "@/store/use-wishlist";
import { useCart } from "@/store/use-cart";

export function MobileBottomNav() {
  const pathname = usePathname();
  const wishlist = useWishlist();
  const cart = useCart();

  const navItems = [
    {
      label: "Home",
      icon: Home,
      href: "/",
    },
    {
      label: "Shop",
      icon: ShoppingBag,
      href: "/products",
    },
    {
      label: "Cart",
      icon: ShoppingCart,
      href: "/checkout",
    },
    {
      label: "Chat",
      icon: MessageCircle,
      onClick: () => {
        window.dispatchEvent(new CustomEvent('open-chat-widget'));
      },
    },
    {
      label: "User",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pointer-events-none">
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="bg-navbar backdrop-blur-lg border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl flex items-center justify-around p-2 pointer-events-auto max-w-md mx-auto"
      >
        {navItems.map((item) => {
          const hasHref = 'href' in item && item.href;
          const isActive = hasHref && (pathname === (item as any).href || ((item as any).href !== "/" && pathname?.startsWith((item as any).href)));
          const Icon = item.icon;
          
          let count = 0;
          if (item.label === "Wishlist") count = wishlist.items.length;
          if (item.label === "Cart") count = cart.items.length;

          const content = (
            <>
              <div className="relative">
                <Icon className={cn("h-5 w-5", isActive && "stroke-[2.5px]")} />
                {count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-white border border-white">
                    {count}
                  </span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-tight">{item.label}</span>
            </>
          );

          if (hasHref) {
            return (
              <Link
                key={(item as any).href}
                href={(item as any).href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 flex-1 py-1 rounded-xl transition-all duration-300 relative",
                  isActive ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {content}
              </Link>
            );
          }

          return (
            <button
              key={item.label}
              onClick={(item as any).onClick}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 py-1 rounded-xl transition-all duration-300 relative text-muted-foreground hover:text-foreground"
              )}
            >
              {content}
            </button>
          );
        })}
      </motion.div>
    </div>
  );
}
