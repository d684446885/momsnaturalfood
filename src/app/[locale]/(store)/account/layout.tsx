"use client";

import React from "react";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { 
  User, 
  ShoppingBag, 
  Settings, 
  Heart, 
  MapPin,
  LogOut,
  LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const accountLinks = [
  { icon: LayoutDashboard, label: "overview", href: "/account" },
  { icon: ShoppingBag, label: "orders", href: "/account/orders" },
  { icon: User, label: "profile", href: "/account/profile" },
  { icon: MapPin, label: "addresses", href: "/account/addresses" },
  { icon: Heart, label: "wishlist", href: "/account/wishlist" },
  { icon: Settings, label: "settings", href: "/account/settings" },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("Account");
  const pathname = usePathname();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Account Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border shadow-sm p-4 sticky top-24">
            <div className="flex flex-col gap-1">
              {accountLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link key={link.href} href={link.href}>
                    <div
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                        active 
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <link.icon className={cn("h-5 w-5", active ? "text-primary-foreground" : "group-hover:text-primary")} />
                      <span className="text-sm font-medium">{t(link.label)}</span>
                    </div>
                  </Link>
                );
              })}
              <div className="my-2 border-t" />
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 px-4 py-6 rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                onClick={() => signOut()}
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm font-medium">{t('logout')}</span>
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border shadow-sm p-6 md:p-8 min-h-[600px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
