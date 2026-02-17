"use client";

import React, { useState } from "react";
import { 
  Search, 
  User, 
  Mail, 
  Calendar, 
  ShoppingBag, 
  Euro, 
  ChevronRight,
  MoreHorizontal,
  ArrowUpRight,
  Filter,
  Download,
  Users,
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { useRouter } from "@/i18n/routing";
import { usePathname, useSearchParams } from "next/navigation";

interface Customer {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: any;
  orderCount: number;
  totalSpend: number;
  lastOrderDate: any | null;
}

interface CustomersClientProps {
  initialData: Customer[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  stats: {
    totalSpend: number;
    activeThisMonth: number;
  };
}

export function CustomersClient({ 
  initialData: customers, 
  totalCount, 
  currentPage, 
  pageSize, 
  stats 
}: CustomersClientProps) {
  const t = useTranslations("Dashboard");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

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

  const handlePageChange = (page: number) => {
    const query = createQueryString({ page });
    router.push(`${pathname}?${query}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(price);
  };

  const formatDate = (date: any) => {
    return format(new Date(date), "MMM dd, yyyy");
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b">
        <div className="space-y-1">
          <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20 mb-2 border-none font-bold uppercase tracking-wider text-[10px]">
             CRM Overview
          </Badge>
          <h1 className="text-4xl md:text-5xl font-serif font-bold italic tracking-tight text-secondary">
             Our Family
          </h1>
          <p className="text-zinc-500 font-light italic max-w-lg">
             Manage and connect with the wonderful people who choose natural goodness.
          </p>
        </div>
        <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-full px-6 h-12 border-zinc-200 hover:bg-zinc-50 gap-2">
                <Download className="h-4 w-4" />
                Export Directory
            </Button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-none bg-white shadow-sm overflow-hidden group">
              <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                      <div className="space-y-1">
                          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Total Customers</p>
                          <h4 className="text-3xl font-serif font-bold text-secondary italic">{totalCount}</h4>
                      </div>
                      <div className="h-12 w-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
                          <Users className="h-6 w-6" />
                      </div>
                  </div>
              </CardContent>
          </Card>
          <Card className="border-none bg-white shadow-sm overflow-hidden group">
              <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                      <div className="space-y-1">
                          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Average Value</p>
                          <h4 className="text-3xl font-serif font-bold text-secondary italic">
                              {formatPrice(totalCount ? stats.totalSpend / totalCount : 0)}
                          </h4>
                      </div>
                      <div className="h-12 w-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
                          <Euro className="h-6 w-6" />
                      </div>
                  </div>
              </CardContent>
          </Card>
          <Card className="border-none bg-white shadow-sm overflow-hidden group">
              <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                      <div className="space-y-1">
                          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Active This Month</p>
                          <h4 className="text-3xl font-serif font-bold text-secondary italic">
                              {stats.activeThisMonth}
                          </h4>
                      </div>
                      <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                          <ArrowUpRight className="h-6 w-6" />
                      </div>
                  </div>
              </CardContent>
          </Card>
      </div>

      {/* Main Table Card */}
      <Card className="shadow-2xl border-none bg-white rounded-[2rem] overflow-hidden">
        <CardHeader className="pb-6 px-10 pt-10 border-b bg-zinc-50/50">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
              <Input
                placeholder="Search by name, email or ID..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-12 h-12 rounded-2xl bg-white border-zinc-100 focus-visible:ring-accent transition-all shadow-sm"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-zinc-50/80">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-10 h-16 font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Customer</TableHead>
                  <TableHead className="font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Contact</TableHead>
                  <TableHead className="font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Joined On</TableHead>
                  <TableHead className="font-bold text-zinc-500 uppercase tracking-widest text-[10px] text-center">Orders</TableHead>
                  <TableHead className="font-bold text-zinc-500 uppercase tracking-widest text-[10px] text-right">Total Spent</TableHead>
                  <TableHead className="w-[100px] text-right pr-10 font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={6} className="h-64 text-center">
                           <div className="flex flex-col items-center justify-center opacity-40 grayscale">
                                <Users className="h-16 w-16 mb-4 text-zinc-300" />
                                <p className="text-xl font-serif italic">No discovery made yet</p>
                            </div>
                        </TableCell>
                    </TableRow>
                ) : customers.map((customer) => (
                  <TableRow key={customer.id} className="hover:bg-zinc-50/80 transition-all duration-300 group cursor-pointer">
                    <TableCell className="pl-10">
                      <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-white shadow-md transition-transform group-hover:scale-110">
                             <AvatarImage src={customer.image || ""} />
                             <AvatarFallback className="bg-secondary text-white font-bold">
                                {customer.name?.[0] || 'U'}
                             </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-bold text-secondary group-hover:text-accent transition-colors">
                              {customer.name || "Guest Account"}
                            </span>
                            <span className="text-[10px] font-mono text-zinc-400 uppercase">#{customer.id.slice(-8)}</span>
                          </div>
                      </div>
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-2 text-zinc-500 text-sm font-light">
                          <Mail className="h-3 w-3" />
                          {customer.email}
                       </div>
                    </TableCell>
                    <TableCell className="text-sm font-medium text-zinc-600">
                        <div className="flex items-center gap-2">
                           <Calendar className="h-4 w-4 text-zinc-300" />
                           {formatDate(customer.createdAt)}
                        </div>
                    </TableCell>
                    <TableCell className="text-center">
                        <Badge variant="secondary" className="bg-zinc-100 text-zinc-600 border-none font-bold rounded-full px-3">
                           {customer.orderCount} Orders
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right font-serif font-bold text-lg text-secondary">
                        {formatPrice(customer.totalSpend)}
                    </TableCell>
                    <TableCell className="text-right pr-10">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-10 w-10 p-0 rounded-full hover:bg-white hover:shadow-xl transition-all">
                              <MoreHorizontal className="h-5 w-5 text-zinc-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-2xl border-zinc-100">
                            <DropdownMenuLabel className="px-3 py-2 text-xs font-bold uppercase tracking-widest text-zinc-400">Customer Options</DropdownMenuLabel>
                            <DropdownMenuSeparator className="my-1" />
                            <DropdownMenuItem className="rounded-xl px-3 py-2.5 gap-3 font-medium transition-all focus:bg-primary/5">
                                <ShoppingBag className="h-4 w-4 text-secondary" />
                                View Purchase History
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl px-3 py-2.5 gap-3 font-medium transition-all focus:bg-primary/5">
                                <Mail className="h-4 w-4 text-accent" />
                                Send Message
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-10">
        <div className="text-sm text-zinc-500 italic">
          Showing {customers.length} of {totalCount} customers
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
    </div>
  );
}
