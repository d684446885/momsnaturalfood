"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { 
  ShoppingBag, 
  Settings, 
  Package, 
  ArrowRight,
  Clock,
  CheckCircle2
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export default function AccountPage() {
  const { data: session } = useSession();
  const t = useTranslations("Account");

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-serif font-bold text-secondary">
          {t('welcome')} {session?.user?.name || session?.user?.email}
        </h1>
        <p className="text-muted-foreground">
          Manage your orders, profile, and account settings from here.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col gap-2">
          <ShoppingBag className="h-8 w-8 text-primary mb-2" />
          <div className="text-2xl font-bold text-primary">0</div>
          <div className="text-sm text-muted-foreground font-medium">Total Orders</div>
        </div>
        <div className="p-6 rounded-2xl bg-secondary/5 border border-secondary/10 flex flex-col gap-2">
          <Clock className="h-8 w-8 text-secondary mb-2" />
          <div className="text-2xl font-bold text-secondary">0</div>
          <div className="text-sm text-muted-foreground font-medium">Active Orders</div>
        </div>
        <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex flex-col gap-2">
          <CheckCircle2 className="h-8 w-8 text-emerald-500 mb-2" />
          <div className="text-2xl font-bold text-emerald-500">0</div>
          <div className="text-sm text-muted-foreground font-medium">Completed Orders</div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-serif font-bold text-secondary">
            {t('recentOrders')}
          </h2>
          <Button variant="ghost" asChild className="gap-2">
            <Link href="/account/orders">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="bg-muted/30 rounded-2xl border border-dashed p-12 text-center flex flex-col items-center gap-4">
          <div className="p-4 rounded-full bg-white dark:bg-zinc-800 shadow-sm">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="font-medium text-foreground">{t('noOrders')}</p>
            <p className="text-sm text-muted-foreground">Start your health journey today with Mom's Natural Foods.</p>
          </div>
          <Button asChild className="rounded-full px-8">
            <Link href="/products">{t('startShopping')}</Link>
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border bg-white dark:bg-zinc-900 group hover:border-primary transition-all">
          <h3 className="text-lg font-bold text-secondary mb-2">Personal Information</h3>
          <p className="text-sm text-muted-foreground mb-4">Update your profile details and email address.</p>
          <Button variant="outline" asChild className="rounded-full group-hover:bg-primary group-hover:text-primary-foreground">
            <Link href="/account/profile">{t('editProfile')}</Link>
          </Button>
        </div>
        <div className="p-6 rounded-2xl border bg-white dark:bg-zinc-900 group hover:border-primary transition-all">
          <h3 className="text-lg font-bold text-secondary mb-2">Account Settings</h3>
          <p className="text-sm text-muted-foreground mb-4">Manage your password and security settings.</p>
          <Button variant="outline" asChild className="rounded-full group-hover:bg-primary group-hover:text-primary-foreground">
            <Link href="/account/settings">{t('settings')}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
