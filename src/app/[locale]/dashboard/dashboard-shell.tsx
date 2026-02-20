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
  Mail,
  Tag,
  Ticket,
  CreditCard,
  MessageCircle,
  HelpCircle,
  FileText,
  Menu,
  ChevronLeft,
  LogOut,
  Bell,
  Search,
  Award,
  Megaphone
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserNav } from "@/components/user-nav";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { signOut } from "next-auth/react";
import Image from "next/image";

const iconMap = {
  overview: LayoutDashboard,
  products: Package,
  orders: ListOrdered,
  deals: Tag,
  coupons: Ticket,
  categories: ShoppingBag,
  customers: Users,
  payments: CreditCard,
  messages: MessageCircle,
  faqs: HelpCircle,
  legal: FileText,
  settings: Settings,
  aboutPage: Menu,
  homePage: LayoutDashboard,
  contactPage: Mail,
  certifications: Award,
  marketing: Megaphone,
  newsletter: Mail,
};

const sidebarGroups = [
  {
    title: "General",
    links: [
      { iconName: "overview" as const, label: "overview", href: "/dashboard" },
    ]
  },
  {
    title: "Shop Management",
    links: [
      { iconName: "products" as const, label: "products", href: "/dashboard/products" },
      { iconName: "categories" as const, label: "categories", href: "/dashboard/categories" },
      { iconName: "orders" as const, label: "orders", href: "/dashboard/orders" },
      { iconName: "customers" as const, label: "customers", href: "/dashboard/customers" },
      { iconName: "marketing" as const, label: "marketing", href: "/dashboard/marketing" },
      { iconName: "newsletter" as const, label: "newsletter", href: "/dashboard/newsletter" },
    ]
  },
  {
    title: "Campaigns",
    links: [
      { iconName: "deals" as const, label: "deals", href: "/dashboard/deals" },
      { iconName: "coupons" as const, label: "coupons", href: "/dashboard/coupons" },
    ]
  },
  {
    title: "CMS & Content",
    links: [
      { iconName: "homePage" as const, label: "homePage", href: "/dashboard/cms/home" },
      { iconName: "aboutPage" as const, label: "aboutPage", href: "/dashboard/cms/about" },
      { iconName: "contactPage" as const, label: "contactPage", href: "/dashboard/cms/contact" },
      { iconName: "certifications" as const, label: "certifications", href: "/dashboard/certifications" },
      { iconName: "faqs" as const, label: "faqs", href: "/dashboard/faqs" },
      { iconName: "legal" as const, label: "legal", href: "/dashboard/legal" },
    ]
  },
  {
    title: "System",
    links: [
      { iconName: "messages" as const, label: "messages", href: "/dashboard/messages" },
      { iconName: "payments" as const, label: "payments", href: "/dashboard/payments" },
      { iconName: "settings" as const, label: "settings", href: "/dashboard/settings" },
    ]
  }
];

interface DashboardShellProps {
  children: React.ReactNode;
  translations: any;
  settings: any;
}

export function DashboardShell({ 
  children, 
  translations: t = {}, 
  settings 
}: DashboardShellProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar - Desktop */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className={cn(
          "relative hidden md:flex flex-col h-full border-r bg-sidebar transition-all duration-300 ease-in-out z-40 overflow-hidden",
          !isSidebarOpen && "items-center"
        )}
      >
        <div className="flex h-24 items-center px-6 border-b font-bold text-xl overflow-hidden whitespace-nowrap shrink-0">
          <Link href="/" className="flex items-center gap-3 group w-full">
            <div className={cn(
              "flex-shrink-0 transition-all duration-300",
              isSidebarOpen ? "w-full flex justify-center py-2" : "w-10"
            )}>
              {settings?.logoUrl ? (
                <div className={cn(
                  "relative transition-all duration-300",
                  isSidebarOpen ? "h-16 w-40" : "h-10 w-10"
                )}>
                  <Image 
                    src={settings.logoUrl} 
                    alt="Logo" 
                    fill 
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform">
                  M
                </div>
              )}
            </div>
          </Link>
        </div>

        <ScrollArea className="flex-1 w-full py-4 min-h-0">
          <nav className="px-3 space-y-6">
            {sidebarGroups.map((group) => (
              <div key={group.title} className="space-y-2">
                {isSidebarOpen && (
                  <h4 className="px-4 text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">
                    {group.title}
                  </h4>
                )}
                <div className="space-y-1">
                  {group.links.map((link) => {
                    const active = pathname === link.href;
                    const Icon = iconMap[link.iconName];
                    return (
                      <Link key={link.href} href={link.href}>
                        <div
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative",
                            active 
                              ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                              : "text-muted-foreground hover:bg-muted"
                          )}
                        >
                          <Icon className={cn("h-5 w-5", active ? "text-primary-foreground" : "group-hover:text-primary")} />
                          {isSidebarOpen && (
                            <motion.span 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-sm font-medium"
                            >
                              {t[link.label]}
                            </motion.span>
                          )}
                          {!isSidebarOpen && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                              {t[link.label]}
                            </div>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </ScrollArea>

        <div className="p-4 border-t space-y-4">
          <Button 
            variant="ghost" 
            className={cn(
              "w-full flex items-center gap-3 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 px-3",
              !isSidebarOpen && "justify-center px-0"
            )}
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="h-5 w-5" />
            {isSidebarOpen && <span className="text-sm font-medium">{t.logout}</span>}
          </Button>
          
          <div className={cn(
            "flex items-center gap-3 px-1",
            !isSidebarOpen ? "flex-col" : "justify-between"
          )}>
            <div className="flex items-center gap-3 min-w-0">
               <UserNav />
               {isSidebarOpen && (
                 <div className="flex flex-col min-w-0 overflow-hidden">
                    <p className="text-xs font-bold truncate">Admin</p>
                    <p className="text-[10px] text-muted-foreground truncate">Management</p>
                 </div>
               )}
            </div>

            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 shrink-0 rounded-full"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <ChevronLeft className={cn("h-4 w-4 transition-transform", !isSidebarOpen && "rotate-180")} />
            </Button>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden absolute left-4 top-3 z-50">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72 flex flex-col h-full">
          <div className="flex h-24 items-center px-6 border-b font-bold text-xl shrink-0">
             <Link href="/" className="flex items-center justify-center w-full">
                {settings?.logoUrl ? (
                  <div className="relative h-16 w-40">
                    <Image src={settings.logoUrl} alt="Logo" fill className="object-contain" />
                  </div>
                ) : (
                  <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                    M
                  </div>
                )}
             </Link>
          </div>
          <ScrollArea className="flex-1 w-full min-h-0">
            <nav className="px-6 py-4 space-y-6">
              {sidebarGroups.map((group) => (
                <div key={group.title} className="space-y-2">
                  <h4 className="px-4 text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">
                    {group.title}
                  </h4>
                  <div className="space-y-1">
                    {group.links.map((link) => {
                      const active = pathname === link.href;
                      const Icon = iconMap[link.iconName];
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
                            <Icon className="h-5 w-5" />
                            <span className="text-sm font-medium">{t[link.label]}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
              <div className="pt-4 mt-4 border-t">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-3 text-rose-600"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="h-5 w-5" />
                  <span className="text-sm font-medium">{t.logout}</span>
                </Button>
              </div>
            </nav>
          </ScrollArea>
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
                placeholder={t.search} 
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
