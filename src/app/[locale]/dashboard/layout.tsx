import React from "react";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Settings as SettingsIcon, 
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
  Award
} from "lucide-react";
import { db } from "@/lib/db";
import { getTranslations } from "next-intl/server";
import { DashboardShell } from "./dashboard-shell";

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
  { icon: HelpCircle, label: "faqs", href: "/dashboard/faqs" },
  { icon: FileText, label: "legal", href: "/dashboard/legal" },
  { icon: SettingsIcon, label: "settings", href: "/dashboard/settings" },
  { icon: Menu, label: "aboutPage", href: "/dashboard/cms/about" },
  { icon: LayoutDashboard, label: "homePage", href: "/dashboard/cms/home" },
  { icon: Mail, label: "contactPage", href: "/dashboard/cms/contact" },
  { icon: Award, label: "certifications", href: "/dashboard/cms/certifications" },
];

export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Dashboard" });
  
  // Fetch settings for logo and business name
  const settings = await db.settings.findUnique({
    where: { id: "global" }
  });

  // Prepare translations for client component
  const translations = {
    overview: t('overview'),
    products: t('products'),
    orders: t('orders'),
    deals: t('deals'),
    coupons: t('coupons'),
    categories: t('categories'),
    customers: t('customers'),
    payments: t('payments'),
    messages: t('messages'),
    faqs: t('faqs'),
    legal: t('legal'),
    settings: t('settings'),
    aboutPage: t('aboutPage'),
    homePage: t('homePage'),
    contactPage: t('contactPage'),
    certifications: t('certifications'),
    logout: t('logout'),
    search: t('search'),
    adminTitle: t('adminTitle')
  };

  return (
    <DashboardShell 
      translations={translations}
      settings={settings}
    >
      {children}
    </DashboardShell>
  );
}
