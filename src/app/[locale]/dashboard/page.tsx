"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  DollarSign, 
  Users, 
  CreditCard, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Package,
  Calendar
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslations } from "next-intl";

export default function DashboardPage() {
  const t = useTranslations("Dashboard");
  const tOrders = useTranslations("AdminOrders");
  
  const stats = [
    {
      title: t('Stats.totalRevenue'),
      value: "$45,231.89",
      description: `+20.1% ${t('Stats.fromLastMonth')}`,
      icon: DollarSign,
      trend: "up",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      title: t('Stats.subscriptions'),
      value: "+2350",
      description: `+180.1% ${t('Stats.fromLastMonth')}`,
      icon: Users,
      trend: "up",
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      title: t('Stats.sales'),
      value: "+12,234",
      description: `+19% ${t('Stats.fromLastMonth')}`,
      icon: CreditCard,
      trend: "up",
      color: "text-orange-500",
      bg: "bg-orange-500/10"
    },
    {
      title: t('Stats.activeNow'),
      value: "+573",
      description: `+201 ${t('Stats.sinceLastHour')}`,
      icon: Activity,
      trend: "up",
      color: "text-rose-500",
      bg: "bg-rose-500/10"
    },
  ];

  const recentOrders = [
    { id: "#3210", customer: "Olivia Martin", email: "olivia.martin@email.com", amount: "$1,999.00", status: "DELIVERED", date: "2023-11-23" },
    { id: "#3211", customer: "Jackson Lee", email: "jackson.lee@email.com", amount: "$39.00", status: "PROCESSING", date: "2023-11-23" },
    { id: "#3212", customer: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: "$299.00", status: "SHIPPED", date: "2023-11-22" },
    { id: "#3213", customer: "William Kim", email: "will@email.com", amount: "$99.00", status: "CANCELLED", date: "2023-11-22" },
    { id: "#3214", customer: "Sofia Davis", email: "sofia.davis@email.com", amount: "$39.00", status: "DELIVERED", date: "2023-11-21" },
  ];
  return (
    <div className="space-y-8 pb-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-bold tracking-tight">{t('Welcome.title')}</h1>
          <p className="text-muted-foreground">{t('Welcome.subtitle')}</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            {t('Welcome.last30Days')}
          </Button>
          <Button className="gap-2 shadow-lg shadow-primary/20">
            <TrendingUp className="h-4 w-4" />
            {t('Welcome.downloadReport')}
          </Button>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={cn("p-2 rounded-lg", stat.bg)}>
                  <stat.icon className={cn("h-4 w-4", stat.color)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-rose-500" />
                  )}
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Sales Chart Placeholder */}
        <Card className="col-span-1 md:col-span-1 lg:col-span-4 shadow-sm overflow-hidden flex flex-col">
          <CardHeader>
            <CardTitle>{t('Revenue.title')}</CardTitle>
            <CardDescription>
              {t('Revenue.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-[300px] flex items-center justify-center bg-muted/20 relative group">
             <div className="absolute inset-x-8 bottom-8 top-16 flex items-end justify-between gap-2">
                {[45, 66, 44, 70, 55, 80, 60, 90, 75, 85, 65, 95].map((height, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: i * 0.05 + 0.5, duration: 1 }}
                    className="flex-1 bg-primary/20 hover:bg-primary transition-colors rounded-t-sm relative group/bar"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-10">
                      ${height}k
                    </div>
                  </motion.div>
                ))}
             </div>
             <div className="flex flex-col items-center justify-center z-0">
                <TrendingUp className="h-12 w-12 text-primary/10 mb-2" />
                <p className="text-sm text-muted-foreground font-medium">{t('Revenue.forecast')}</p>
             </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="col-span-1 md:col-span-1 lg:col-span-3 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{t('RecentSales.title')}</CardTitle>
              <CardDescription>
                {t('RecentSales.subtitle', { count: 265 })}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="h-8 text-xs underline">
              {t('RecentSales.viewAll')}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentOrders.map((order, i) => (
                <div key={order.id} className="flex items-center gap-4">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/5 text-primary text-xs">
                      {order.customer.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 flex flex-col min-w-0">
                    <p className="text-sm font-medium leading-none truncate">{order.customer}</p>
                    <p className="text-xs text-muted-foreground truncate">{order.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{order.amount}</p>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-[10px] h-4.5 px-1.5",
                        order.status === "DELIVERED" && "border-emerald-500 text-emerald-600 bg-emerald-50",
                        order.status === "PROCESSING" && "border-blue-500 text-blue-600 bg-blue-50",
                        order.status === "CANCELLED" && "border-rose-500 text-rose-600 bg-rose-50",
                        order.status === "SHIPPED" && "border-orange-500 text-orange-600 bg-orange-50",
                      )}
                    >
                      {tOrders(`statuses.${order.status}`)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick Actions / Featured Products */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-none">
             <CardHeader>
                <CardTitle className="flex items-center gap-2">
                   <Package className="h-5 w-5" />
                   {t('Inventory.title')}
                </CardTitle>
                <CardDescription className="text-primary-foreground/80">
                   {t('Inventory.subtitle', { count: 12 })}
                </CardDescription>
             </CardHeader>
             <CardContent>
                <div className="flex items-center justify-between">
                   <div>
                      <h4 className="text-3xl font-bold">42</h4>
                      <p className="text-xs text-primary-foreground/70 mt-1">{t('Inventory.totalActive')}</p>
                   </div>
                   <Button variant="secondary" size="sm" className="bg-white text-primary hover:bg-white/90">
                      {t('Inventory.manageStock')}
                   </Button>
                </div>
             </CardContent>
          </Card>
          
          <Card className="border-2 border-dashed border-muted-foreground/20 bg-muted/5 flex items-center justify-center p-8">
             <div className="text-center group cursor-pointer">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                   <Users className="h-6 w-6" />
                </div>
                <h4 className="font-bold">{t('QuickActions.addStaff')}</h4>
                <p className="text-sm text-muted-foreground mt-2">{t('QuickActions.manageTeam')}</p>
             </div>
          </Card>
          
          <Card className="border-2 border-dashed border-muted-foreground/20 bg-muted/5 flex items-center justify-center p-8">
             <div className="text-center group cursor-pointer">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                   <ArrowUpRight className="h-6 w-6" />
                </div>
                <h4 className="font-bold">{t('QuickActions.scaleBusiness')}</h4>
                <p className="text-sm text-muted-foreground mt-2">{t('QuickActions.exploreTools')}</p>
             </div>
          </Card>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

