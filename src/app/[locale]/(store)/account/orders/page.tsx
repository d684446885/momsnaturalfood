"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Package, ShoppingBag } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export default function OrdersPage() {
  const t = useTranslations("Account");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-serif font-bold text-secondary">{t('orders')}</h1>
        <p className="text-muted-foreground">Track and manage your order history.</p>
      </div>

      <div className="bg-muted/30 rounded-2xl border border-dashed p-12 text-center flex flex-col items-center gap-4">
        <div className="p-4 rounded-full bg-white dark:bg-zinc-800 shadow-sm">
          <Package className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="font-medium text-foreground">{t('noOrders')}</p>
          <p className="text-sm text-muted-foreground">When you place an order, it will appear here.</p>
        </div>
        <Button asChild className="rounded-full px-8">
          <Link href="/products">{t('startShopping')}</Link>
        </Button>
      </div>
    </div>
  );
}
