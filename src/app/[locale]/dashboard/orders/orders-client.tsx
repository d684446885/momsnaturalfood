"use client";

import React, { useState } from "react";
import { 
  Search, 
  Eye, 
  MoreHorizontal, 
  Download,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Calendar,
  User,
  CreditCard,
  ChevronRight,
  Printer,
  Loader2,
  ExternalLink,
  ChevronLeft
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import Image from "next/image";
import { normalizeImageUrl } from "@/lib/image-utils";
import { useRouter } from "@/i18n/routing";
import { usePathname, useSearchParams } from "next/navigation";

interface Order {
  id: string;
  total: any;
  status: string;
  createdAt: any;
  user: {
    name: string | null;
    email: string;
  };
  items: any[];
  courierName?: string | null;
  trackingLink?: string | null;
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
}

interface AdminOrdersClientProps {
  orders: Order[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  statusCounts: Record<string, number>;
}

const statusColors: Record<string, { border: string, text: string, bg: string, icon: any, label: string }> = {
  PENDING: { border: "border-amber-200", text: "text-amber-700", bg: "bg-amber-50", icon: Clock, label: "Pending" },
  PROCESSING: { border: "border-blue-200", text: "text-blue-700", bg: "bg-blue-50", icon: Package, label: "Processing" },
  SHIPPED: { border: "border-indigo-200", text: "text-indigo-700", bg: "bg-indigo-50", icon: Truck, label: "Shipped" },
  DELIVERED: { border: "border-emerald-200", text: "text-emerald-700", bg: "bg-emerald-50", icon: CheckCircle, label: "Delivered" },
  CANCELLED: { border: "border-rose-200", text: "text-rose-700", bg: "bg-rose-50", icon: XCircle, label: "Cancelled" },
};

export function AdminOrdersClient({ 
  orders, 
  totalCount, 
  currentPage, 
  pageSize, 
  statusCounts 
}: AdminOrdersClientProps) {
  const t = useTranslations("AdminOrders");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedStatus, setSelectedStatus] = useState<string>(searchParams.get("status") || "all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const createQueryString = (params: Record<string, string | number | null>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    
    for (const [key, value] of Object.entries(params)) {
      if (value === null || value === "" || value === "all") {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, String(value));
      }
    }
    
    return newSearchParams.toString();
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    const query = createQueryString({ search: value, page: 1 });
    router.push(`${pathname}?${query}`);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    const query = createQueryString({ status: value, page: 1 });
    router.push(`${pathname}?${query}`);
  };

  const handlePageChange = (page: number) => {
    const query = createQueryString({ page });
    router.push(`${pathname}?${query}`);
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      setIsUpdating(orderId);
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      toast.success(`${t('statuses.' + newStatus)} updated successfully`);
      router.refresh();
    } catch (error) {
      toast.error("Failed to update order status");
    } finally {
      setIsUpdating(null);
    }
  };

  const formatPrice = (price: any) => {
    const val = typeof price === 'object' ? parseFloat(price.toString()) : parseFloat(String(price));
    return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(val);
  };

  const formatDate = (date: any) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const openDetails = (order: Order) => {
      setSelectedOrder(order);
      setTrackingData({
          courierName: order.courierName || "",
          trackingLink: order.trackingLink || ""
      });
      setIsDetailsOpen(true);
  };

  const [trackingData, setTrackingData] = useState({
      courierName: "",
      trackingLink: ""
  });

  const updateTracking = async () => {
    if (!selectedOrder) return;
    try {
      setIsUpdating(selectedOrder.id);
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trackingData),
      });

      if (!res.ok) throw new Error("Failed to update tracking");

      toast.success(t('tracking.successUpdate'));
      router.refresh();
      setIsDetailsOpen(false);
    } catch (error) {
      toast.error("Failed to update tracking information");
    } finally {
      setIsUpdating(null);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b">
        <div className="space-y-1">
          <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20 mb-2 border-none font-bold uppercase tracking-wider text-[10px]">
            Order Management
          </Badge>
          <h1 className="text-4xl md:text-5xl font-serif font-bold italic tracking-tight text-secondary">
             {t('title')}
          </h1>
          <p className="text-zinc-500 font-light italic max-w-lg">
             {t('subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-full px-6 h-12 border-zinc-200 hover:bg-zinc-50 gap-2">
                <Download className="h-4 w-4" />
                {t('export')}
            </Button>
            <Button className="rounded-full px-6 h-12 bg-secondary hover:bg-secondary/90 gap-2 shadow-lg shadow-secondary/20">
                <Printer className="h-4 w-4" />
                Batch Print
            </Button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 overflow-x-auto pb-4 scrollbar-hide">
          {Object.entries(statusColors).map(([status, style]) => (
              <Card key={status} className={cn(
                "border-none bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group min-w-[200px] cursor-pointer",
                selectedStatus === status && "ring-2 ring-accent"
              )} onClick={() => handleStatusChange(status)}>
                  <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                          <div className="space-y-1">
                              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                                {t(`statuses.${status}`)}
                              </p>
                              <h4 className="text-3xl font-serif font-bold text-secondary italic">
                                  {statusCounts[status] || 0}
                              </h4>
                          </div>
                          <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110", style.bg, style.text)}>
                              <style.icon className="h-6 w-6" />
                          </div>
                      </div>
                      <div className={cn("h-1 w-0 group-hover:w-full transition-all duration-500 mt-4 rounded-full opacity-30", style.text.replace('text-', 'bg-'))} />
                  </CardContent>
              </Card>
          ))}
      </div>

      {/* Main Table Card */}
      <Card className="shadow-2xl border-none bg-white rounded-[2rem] overflow-hidden">
        <CardHeader className="pb-6 px-10 pt-10 border-b bg-zinc-50/50">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
              <Input
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-12 h-12 rounded-2xl bg-white border-zinc-100 focus-visible:ring-accent transition-all shadow-sm"
              />
            </div>
            <div className="flex items-center gap-4">
                <select 
                    className="h-12 w-[220px] rounded-2xl bg-white border border-zinc-100 px-4 text-sm font-medium focus:ring-2 ring-accent outline-none shadow-sm cursor-pointer hover:border-accent/30 transition-all"
                    value={selectedStatus}
                    onChange={(e) => handleStatusChange(e.target.value)}
                >
                    <option value="all">All Statuses</option>
                    {Object.keys(statusColors).map(s => (
                      <option key={s} value={s}>{t(`statuses.${s}`)}</option>
                    ))}
                </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-zinc-50/80">
                <TableRow className="hover:bg-transparent px-10">
                  <TableHead className="w-[150px] pl-10 h-16 font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Order ID</TableHead>
                  <TableHead className="font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Customer</TableHead>
                  <TableHead className="font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Date & Time</TableHead>
                  <TableHead className="font-bold text-zinc-500 uppercase tracking-widest text-[10px] text-right">Total Amount</TableHead>
                  <TableHead className="font-bold text-zinc-500 uppercase tracking-widest text-[10px] text-center">Current Status</TableHead>
                  <TableHead className="w-[120px] text-right pr-10 font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={6} className="h-64 text-center">
                            <div className="flex flex-col items-center justify-center opacity-40 grayscale">
                                <Package className="h-16 w-16 mb-4 text-zinc-300" />
                                <p className="text-xl font-serif italic">{t('noOrders')}</p>
                            </div>
                        </TableCell>
                    </TableRow>
                ) : orders.map((order) => {
                  const style = statusColors[order.status] || { border: "border-zinc-200", text: "text-zinc-600", bg: "bg-zinc-50", icon: Clock };
                  const isUpdatingThis = isUpdating === order.id;
                  
                  return (
                    <TableRow key={order.id} className="hover:bg-zinc-50/80 transition-all duration-300 cursor-pointer group" onClick={() => openDetails(order)}>
                      <TableCell className="pl-10 font-mono text-xs text-zinc-400 font-bold uppercase">
                        #{order.id.slice(-8)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-sm shadow-md">
                                {order.user.name?.[0] || 'U'}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-secondary group-hover:text-accent transition-colors">{order.user.name || "Guest User"}</span>
                              <span className="text-xs text-zinc-400 font-light">{order.user.email}</span>
                            </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-medium text-zinc-600">
                        <div className="flex items-center gap-2">
                           <Calendar className="h-4 w-4 text-zinc-300" />
                           {formatDate(order.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-bold text-lg text-secondary">
                        {formatPrice(order.total)}
                      </TableCell>
                      <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-center">
                            {isUpdatingThis ? (
                                <Loader2 className="h-5 w-5 animate-spin text-accent" />
                            ) : (
                                <Badge 
                                  variant="outline" 
                                  className={cn(
                                    "px-4 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-widest border-2 transition-all hover:scale-105",
                                    style.border,
                                    style.bg,
                                    style.text
                                  )}
                                >
                                  {t(`statuses.${order.status}`)}
                                </Badge>
                            )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-10" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-white hover:shadow-xl transition-all" onClick={() => openDetails(order)}>
                              <Eye className="h-5 w-5 text-zinc-400 group-hover:text-amber-500" />
                            </Button>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-10 w-10 p-0 rounded-full hover:bg-white hover:shadow-xl transition-all">
                                  <MoreHorizontal className="h-5 w-5 text-zinc-400" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-2xl border-zinc-100">
                                <DropdownMenuLabel className="px-3 py-2 text-xs font-bold uppercase tracking-widest text-zinc-400">{t('actions.updateStatus')}</DropdownMenuLabel>
                                <DropdownMenuSeparator className="my-1" />
                                {Object.keys(statusColors).map((status) => (
                                    <DropdownMenuItem 
                                        key={status}
                                        className={cn(
                                            "rounded-xl px-3 py-2.5 gap-3 font-medium transition-all",
                                            statusColors[status].text,
                                            order.status === status && "bg-zinc-50 font-bold"
                                        )}
                                        onClick={() => updateStatus(order.id, status)}
                                    >
                                        <div className={cn("h-2 w-2 rounded-full", statusColors[status].text.replace('text-', 'bg-'))} />
                                        {t(`statuses.${status}`)}
                                    </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-10">
        <div className="text-sm text-zinc-500 italic">
          {t('showing', { 
            count: orders.length, 
            total: totalCount 
          })}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="rounded-xl px-4 border-zinc-200"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum = i + 1;
              if (totalPages > 5) {
                if (currentPage > 3) pageNum = currentPage - 3 + i + 1;
                if (pageNum > totalPages) pageNum = totalPages - (5 - i - 1);
              }
              if (pageNum <= 0 || pageNum > totalPages) return null;

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  className={cn(
                    "w-10 h-10 rounded-xl font-bold",
                    currentPage === pageNum ? "bg-secondary text-white shadow-lg shadow-secondary/20" : "border-zinc-200 text-zinc-500"
                  )}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          <Button
            variant="outline"
            className="rounded-xl px-4 border-zinc-200"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Order Details Sheet */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <SheetContent className="w-full sm:max-w-xl p-0 border-none bg-zinc-50 overflow-y-auto">
              {selectedOrder && (
                  <div className="flex flex-col h-full animate-in slide-in-from-right duration-500">
                      {/* Header */}
                      <div className="p-8 bg-secondary text-white rounded-b-[3rem] shadow-2xl space-y-4">
                          <div className="flex justify-between items-start">
                              <Badge className="bg-white/10 text-accent border border-white/20 px-3 py-1 font-bold uppercase tracking-widest text-[10px]">
                                  #{selectedOrder.id.slice(-12)}
                              </Badge>
                              <Button variant="ghost" size="icon" className="text-white/50 hover:text-white" onClick={() => setIsDetailsOpen(false)}>
                                  <XCircle className="h-6 w-6" />
                              </Button>
                          </div>
                          <div>
                              <h2 className="text-3xl font-serif font-bold italic tracking-tight leading-tight">
                                  Order Details
                              </h2>
                              <p className="text-white/60 font-light italic mt-1 flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  Placed on {formatDate(selectedOrder.createdAt)}
                              </p>
                          </div>
                      </div>

                      <div className="p-8 space-y-8">
                          {/* Status & Customer Info */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Card className="border-none shadow-sm rounded-3xl p-6 bg-white overflow-hidden relative">
                                  <div className="absolute top-0 left-0 w-1.5 h-full bg-secondary" />
                                  <div className="space-y-4">
                                      <div className="flex items-center gap-2 text-zinc-400">
                                          <Truck className="h-4 w-4" />
                                          <span className="text-[10px] font-bold uppercase tracking-widest">Delivery Status</span>
                                      </div>
                                      <div className="flex items-center justify-between">
                                           <span className={cn("text-xl font-bold font-serif italic", statusColors[selectedOrder.status].text)}>
                                               {t(`statuses.${selectedOrder.status}`)}
                                           </span>
                                           {(() => {
                                               const Icon = statusColors[selectedOrder.status]?.icon;
                                               return Icon ? <Icon className={cn("h-8 w-8", statusColors[selectedOrder.status].text)} /> : null;
                                           })()}
                                      </div>
                                  </div>
                              </Card>

                               <Card className="border-none shadow-sm rounded-3xl p-6 bg-white overflow-hidden relative">
                                   <div className="absolute top-0 left-0 w-1.5 h-full bg-accent" />
                                   <div className="space-y-4">
                                       <div className="flex items-center gap-2 text-zinc-400">
                                           <User className="h-4 w-4" />
                                           <span className="text-[10px] font-bold uppercase tracking-widest">Customer Information</span>
                                       </div>
                                       <div className="flex flex-col space-y-1">
                                            <span className="text-lg font-bold text-secondary">
                                                {selectedOrder.customerName || selectedOrder.user.name || "Guest Account"}
                                            </span>
                                            <span className="text-sm text-zinc-500 font-medium">
                                                {selectedOrder.customerEmail || selectedOrder.user.email}
                                            </span>
                                            {selectedOrder.customerPhone && (
                                                <span className="text-sm text-primary font-bold flex items-center gap-1">
                                                    <span className="text-zinc-400 font-normal">Phone:</span> {selectedOrder.customerPhone}
                                                </span>
                                            )}
                                       </div>
                                   </div>
                               </Card>
                          </div>

                          {/* Order Items */}
                          <div className="space-y-4">
                              <div className="flex items-center justify-between px-2">
                                  <h3 className="font-serif font-bold italic text-secondary text-xl">Order Items</h3>
                                  <span className="text-xs font-bold text-zinc-400 bg-white px-3 py-1 rounded-full shadow-sm">
                                      {selectedOrder.items.length} items
                                  </span>
                              </div>
                              <div className="space-y-3">
                                  {selectedOrder.items.map((item, idx) => (
                                      <div key={idx} className="bg-white p-4 rounded-3xl flex items-center justify-between group hover:shadow-lg transition-all border border-transparent hover:border-accent/10">
                                          <div className="flex items-center gap-4">
                                              <div className="h-16 w-16 rounded-2xl bg-zinc-50 overflow-hidden relative border border-zinc-100 shadow-inner">
                                                  {item.product.images?.[0] ? (
                                                      <Image src={normalizeImageUrl(item.product.images[0])} alt={item.product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                                  ) : (
                                                      <div className="h-full w-full flex items-center justify-center text-zinc-200">
                                                          <Package className="h-8 w-8" />
                                                      </div>
                                                  )}
                                              </div>
                                              <div>
                                                  <h4 className="font-bold text-secondary group-hover:text-accent transition-colors leading-tight line-clamp-1">{item.product.name}</h4>
                                                  <p className="text-xs text-secondary/60 font-medium">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                                              </div>
                                          </div>
                                          <div className="text-right">
                                              <p className="font-bold text-secondary">{formatPrice(item.price * item.quantity)}</p>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          </div>

                          {/* Order Totals */}
                          <Card className="border-none shadow-xl rounded-[2.5rem] bg-secondary text-white p-8 relative overflow-hidden">
                              <div className="absolute top-0 right-0 h-32 w-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
                              <div className="space-y-4 relative z-10">
                                  <div className="flex justify-between items-center text-white/50 text-sm font-medium">
                                      <span>Subtotal</span>
                                      <span>{formatPrice(selectedOrder.total)}</span>
                                  </div>
                                  <div className="flex justify-between items-center text-white/50 text-sm font-medium">
                                      <span>Shipping</span>
                                      <span className="text-accent font-bold uppercase tracking-widest text-[10px]">Complimentary</span>
                                  </div>
                                  <div className="h-[1px] bg-white/10 my-4" />
                                  <div className="flex justify-between items-center">
                                      <div className="flex flex-col">
                                          <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Grand Total</span>
                                          <span className="text-4xl font-serif font-xl font-bold italic tracking-tight">{formatPrice(selectedOrder.total)}</span>
                                      </div>
                                      <CreditCard className="h-10 w-10 text-white/20" />
                                  </div>
                              </div>
                          </Card>

                          {/* Tracking Module */}
                          <div className="space-y-4">
                              <h3 className="font-serif font-bold italic text-secondary text-xl px-2">{t('tracking.title')}</h3>
                              <Card className="border-none shadow-sm rounded-3xl p-6 bg-white space-y-4">
                                  <div className="space-y-4">
                                      <div className="space-y-2">
                                          <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                                              {t('tracking.courierName')}
                                          </label>
                                          <Input 
                                              value={trackingData.courierName}
                                              onChange={(e) => setTrackingData({...trackingData, courierName: e.target.value})}
                                              placeholder={t('tracking.courierPlaceholder')}
                                              className="rounded-xl border-zinc-100 h-11"
                                          />
                                      </div>
                                      <div className="space-y-2">
                                          <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                                              {t('tracking.trackingLink')}
                                          </label>
                                          <Input 
                                              value={trackingData.trackingLink}
                                              onChange={(e) => setTrackingData({...trackingData, trackingLink: e.target.value})}
                                              placeholder={t('tracking.trackingPlaceholder')}
                                              className="rounded-xl border-zinc-100 h-11"
                                          />
                                      </div>
                                      <Button 
                                          onClick={updateTracking}
                                          disabled={isUpdating === selectedOrder.id}
                                          className="w-full rounded-xl bg-secondary hover:bg-secondary/90 h-11"
                                      >
                                          {isUpdating === selectedOrder.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                          {t('tracking.updateTracking')}
                                      </Button>
                                  </div>
                              </Card>
                          </div>

                          {/* Actions */}
                          <div className="grid grid-cols-2 gap-4 pb-8">
                                <Button className="h-14 rounded-2xl bg-white text-secondary hover:bg-zinc-100 font-bold shadow-sm border border-zinc-200 gap-2">
                                    <Printer className="h-4 w-4" />
                                    Download Invoice
                                </Button>
                                {selectedOrder.trackingLink ? (
                                    <a 
                                        href={selectedOrder.trackingLink.startsWith('http') ? selectedOrder.trackingLink : `https://${selectedOrder.trackingLink}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="h-14 rounded-2xl bg-accent text-secondary hover:bg-white hover:text-secondary font-bold shadow-lg shadow-accent/20 flex items-center justify-center gap-2 transition-all group no-underline"
                                    >
                                        Logistics Tracking
                                        <ExternalLink className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                    </a>
                                ) : (
                                    <Button disabled className="h-14 rounded-2xl bg-zinc-200 text-zinc-500 font-bold cursor-not-allowed gap-2">
                                        Logistics Tracking
                                        <Truck className="h-4 w-4 opacity-50" />
                                    </Button>
                                )}
                          </div>
                      </div>
                  </div>
              )}
          </SheetContent>
      </Sheet>
    </div>
  );
}
