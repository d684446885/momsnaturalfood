"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Settings, 
  Package, 
  ListOrdered, 
  Bell,
  Search,
  Menu,
  ChevronLeft,
  Mail,
  Tag,
  Ticket,
  CreditCard,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserNav } from "@/components/user-nav";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

const sidebarLinks = [
  { icon: LayoutDashboard, label: "overview", href: "/dashboard" },
  { icon: Package, label: "products", href: "/dashboard/products" },
  { icon: ListOrdered, label: "orders", href: "/dashboard/orders" },
  { icon: Tag, label: "deals", href: "/dashboard/deals" },
  { icon: Ticket, label: "coupons", href: "/dashboard/coupons" },
  { icon: ShoppingBag, label: "categories", href: "/dashboard/categories" },
  { icon: Users, label: "customers", href: "/dashboard/customers" },
  { icon: CreditCard, label: "payments", href: "/dashboard/payments" },
  { icon: MessageCircle, label: "messages", href: "/dashboard/messages" },
  { icon: Settings, label: "settings", href: "/dashboard/settings" },
  { icon: Menu, label: "aboutPage", href: "/dashboard/cms/about" },
  { icon: LayoutDashboard, label: "homePage", href: "/dashboard/cms/home" },
  { icon: Mail, label: "contactPage", href: "/dashboard/cms/contact" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("Dashboard");
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  return (
    <div className="flex h-screen bg-gray-50/50 dark:bg-zinc-950 overflow-hidden">
      {/* Sidebar - Desktop */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className={cn(
          "relative hidden md:flex flex-col border-r bg-white dark:bg-zinc-900 transition-all duration-300 ease-in-out",
          !isSidebarOpen && "items-center"
        )}
      >
        <div className="flex h-16 items-center px-6 border-b font-bold text-xl overflow-hidden whitespace-nowrap">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center text-secondary-foreground shadow-lg shadow-secondary/20">
              M
            </div>
            {isSidebarOpen && (
              <motion.span 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="font-serif font-bold text-secondary"
              >
                {t('adminTitle')}
              </motion.span>
            )}
          </Link>
        </div>

        <ScrollArea className="flex-1 py-4">
          <nav className="px-3 space-y-1">
            {sidebarLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link key={link.href} href={link.href}>
                  <div
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative",
                      active 
                        ? "bg-primary text-primary-foreground" 
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <link.icon className={cn("h-5 w-5", active ? "text-primary-foreground" : "group-hover:text-primary")} />
                    {isSidebarOpen && (
                      <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm font-medium"
                      >
                        {t(link.label)}
                      </motion.span>
                    )}
                    {!isSidebarOpen && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                        {t(link.label)}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        <div className="p-4 border-t">
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-full justify-center"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <ChevronLeft className={cn("h-5 w-5 transition-transform", !isSidebarOpen && "rotate-180")} />
          </Button>
        </div>
      </motion.aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden absolute left-4 top-3 z-50">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          <div className="flex h-16 items-center px-6 border-b font-bold text-xl">
             {t('adminTitle')}
          </div>
          <nav className="p-4 space-y-1">
            {sidebarLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link key={link.href} href={link.href}>
                  <div
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-lg transition-all",
                      active 
                        ? "bg-primary text-primary-foreground" 
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <link.icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{t(link.label)}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 border-b bg-white dark:bg-zinc-900 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-md w-full hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder={t('search')} 
                className="pl-9 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <LocaleSwitcher />
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900" />
            </Button>
            <div className="h-8 w-[1px] bg-border mx-1" />
            <UserNav />
          </div>
        </header>

        {/* Page Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

