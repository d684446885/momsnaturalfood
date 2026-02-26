"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Eye,
  Trash2,
  Search,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  PhoneCall,
  Package,
  MapPin,
  Mail,
  Phone,
  FileText,
  Loader2,
  InboxIcon,
  X,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface WholesaleProduct {
  id: string;
  productId: string;
  quantity: number;
  productName?: string;
}

interface WholesaleInquiry {
  id: string;
  fullName: string;
  contact: string;
  email: string | null;
  address: string;
  description: string | null;
  status: "PENDING" | "CONTACTED" | "COMPLETED" | "REJECTED";
  createdAt: string;
  products: WholesaleProduct[];
}

const STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: Clock,
    dot: "bg-amber-400",
  },
  CONTACTED: {
    label: "Contacted",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: PhoneCall,
    dot: "bg-blue-400",
  },
  COMPLETED: {
    label: "Completed",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
    dot: "bg-emerald-400",
  },
  REJECTED: {
    label: "Rejected",
    color: "bg-red-100 text-red-700 border-red-200",
    icon: XCircle,
    dot: "bg-red-400",
  },
};

export default function WholesaleInquiries() {
  const [inquiries, setInquiries] = useState<WholesaleInquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<
    WholesaleInquiry[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] =
    useState<WholesaleInquiry | null>(null);
  const [productNames, setProductNames] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [inquiryRes, productRes] = await Promise.all([
        fetch("/api/admin/wholesale"),
        fetch("/api/products?limit=200"),
      ]);
      const inquiryData = await inquiryRes.json();
      const productData = await productRes.json();

      if (inquiryData.success) {
        setInquiries(inquiryData.data);
        setFilteredInquiries(inquiryData.data);
      }

      const names: Record<string, string> = {};
      productData.products?.forEach((p: any) => {
        names[p.id] = p.name;
      });
      setProductNames(names);
    } catch {
      toast.error("Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter & Search
  useEffect(() => {
    let results = inquiries;

    if (statusFilter !== "ALL") {
      results = results.filter((i) => i.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (i) =>
          i.fullName.toLowerCase().includes(q) ||
          i.contact.toLowerCase().includes(q) ||
          (i.email && i.email.toLowerCase().includes(q)) ||
          i.address.toLowerCase().includes(q)
      );
    }

    setFilteredInquiries(results);
  }, [searchQuery, statusFilter, inquiries]);

  const updateStatus = async (id: string, status: string) => {
    setUpdatingStatus(id);
    try {
      const res = await fetch(`/api/admin/wholesale/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Status updated successfully");
        setInquiries((prev) =>
          prev.map((i) => (i.id === id ? { ...i, status: status as any } : i))
        );
        if (selectedInquiry?.id === id) {
          setSelectedInquiry((prev) =>
            prev ? { ...prev, status: status as any } : null
          );
        }
      } else {
        toast.error("Failed to update status");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      const res = await fetch(`/api/admin/wholesale/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Inquiry deleted");
        setInquiries((prev) => prev.filter((i) => i.id !== id));
        if (selectedInquiry?.id === id) setSelectedInquiry(null);
      } else {
        toast.error("Failed to delete");
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  // Stats
  const stats = {
    total: inquiries.length,
    pending: inquiries.filter((i) => i.status === "PENDING").length,
    contacted: inquiries.filter((i) => i.status === "CONTACTED").length,
    completed: inquiries.filter((i) => i.status === "COMPLETED").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b">
        <div className="space-y-1">
          <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20 mb-2 border-none font-bold uppercase tracking-wider text-[10px]">
            B2B Management
          </Badge>
          <h1 className="text-4xl md:text-5xl font-serif font-bold italic tracking-tight text-secondary">
            Wholesale Inquiries
          </h1>
          <p className="text-zinc-500 font-light italic max-w-lg">
            Review, manage and respond to bulk purchase inquiries from potential
            wholesale partners.
          </p>
        </div>
        <Button
          variant="outline"
          className="gap-2 rounded-full border-zinc-200 h-11"
          onClick={fetchData}
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total",
            value: stats.total,
            icon: Users,
            color: "text-secondary bg-secondary/10",
          },
          {
            label: "Pending",
            value: stats.pending,
            icon: Clock,
            color: "text-amber-600 bg-amber-100",
          },
          {
            label: "Contacted",
            value: stats.contacted,
            icon: PhoneCall,
            color: "text-blue-600 bg-blue-100",
          },
          {
            label: "Completed",
            value: stats.completed,
            icon: TrendingUp,
            color: "text-emerald-600 bg-emerald-100",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="border-none bg-white shadow-sm overflow-hidden"
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                      {stat.label}
                    </p>
                    <h4 className="text-3xl font-serif font-bold text-secondary italic mt-1">
                      {stat.value}
                    </h4>
                  </div>
                  <div
                    className={cn(
                      "h-12 w-12 rounded-2xl flex items-center justify-center",
                      stat.color
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card className="shadow-sm border-none bg-white rounded-[2rem] overflow-hidden">
        <div className="px-8 pt-8 pb-5 border-b bg-zinc-50/50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Search by name, contact, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-11 rounded-2xl bg-white border-zinc-100 shadow-sm"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["ALL", "PENDING", "CONTACTED", "COMPLETED", "REJECTED"].map(
                (s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={cn(
                      "px-4 h-11 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all",
                      statusFilter === s
                        ? "bg-secondary text-white shadow-lg shadow-secondary/20"
                        : "bg-white border border-zinc-100 text-zinc-500 hover:border-secondary hover:text-secondary"
                    )}
                  >
                    {s === "ALL" ? "All" : STATUS_CONFIG[s as keyof typeof STATUS_CONFIG].label}
                    {s !== "ALL" && (
                      <span className="ml-1.5 opacity-70">
                        (
                        {
                          inquiries.filter(
                            (i) => i.status === s
                          ).length
                        }
                        )
                      </span>
                    )}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {filteredInquiries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-zinc-300">
              <InboxIcon className="h-20 w-20 mb-4" />
              <p className="text-2xl font-serif italic">No inquiries found</p>
              <p className="text-sm mt-2">
                {searchQuery || statusFilter !== "ALL"
                  ? "Try adjusting your filters"
                  : "Wholesale inquiries will appear here once submitted"}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-zinc-50/80">
                <tr>
                  {[
                    "Customer",
                    "Contact",
                    "Products",
                    "Address",
                    "Status",
                    "Date",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className={cn(
                        "h-14 px-6 text-left font-bold text-zinc-400 uppercase tracking-widest text-[10px]",
                        h === "Actions" && "text-right"
                      )}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredInquiries.map((inquiry) => {
                  const status = STATUS_CONFIG[inquiry.status];
                  const StatusIcon = status.icon;
                  return (
                    <tr
                      key={inquiry.id}
                      className="border-t border-zinc-50 hover:bg-zinc-50/60 transition-all duration-200 group"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-secondary text-sm">
                            {inquiry.fullName}
                          </p>
                          {inquiry.email && (
                            <p className="text-xs text-zinc-400 mt-0.5">
                              {inquiry.email}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-zinc-600">
                          {inquiry.contact}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant="secondary"
                          className="bg-zinc-100 text-zinc-600 border-none font-bold rounded-full"
                        >
                          {inquiry.products.length}{" "}
                          {inquiry.products.length === 1 ? "item" : "items"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-zinc-500 max-w-[160px] truncate">
                          {inquiry.address}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={inquiry.status}
                          onChange={(e) =>
                            updateStatus(inquiry.id, e.target.value)
                          }
                          disabled={updatingStatus === inquiry.id}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-bold border cursor-pointer focus:outline-none appearance-none",
                            status.color
                          )}
                        >
                          {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                            <option key={key} value={key}>
                              {val.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-zinc-400">
                          {format(new Date(inquiry.createdAt), "MMM dd, yyyy")}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-xl hover:bg-secondary/10 hover:text-secondary"
                            onClick={() => setSelectedInquiry(inquiry)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-xl hover:bg-red-50 hover:text-red-500"
                            onClick={() => deleteInquiry(inquiry.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {filteredInquiries.length > 0 && (
          <div className="px-8 py-4 border-t bg-zinc-50/50 text-xs text-zinc-400 italic">
            Showing {filteredInquiries.length} of {inquiries.length} inquiries
          </div>
        )}
      </Card>

      {/* Detail Modal */}
      {selectedInquiry && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedInquiry(null)}
        >
          <div
            className="bg-white rounded-[2.5rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-8 border-b">
              <div>
                <h2 className="text-2xl font-serif font-bold italic text-secondary">
                  Inquiry Details
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Submitted{" "}
                  {format(new Date(selectedInquiry.createdAt), "PPpp")}
                </p>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="h-10 w-10 rounded-2xl bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition-all"
              >
                <X className="h-5 w-5 text-zinc-500" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* Status Banner */}
              {(() => {
                const s = STATUS_CONFIG[selectedInquiry.status];
                const SIcon = s.icon;
                return (
                  <div
                    className={cn(
                      "flex items-center gap-3 px-5 py-4 rounded-2xl border",
                      s.color
                    )}
                  >
                    <SIcon className="h-5 w-5" />
                    <div>
                      <p className="font-bold text-sm">
                        Status: {s.label}
                      </p>
                    </div>
                    <div className="ml-auto">
                      <select
                        value={selectedInquiry.status}
                        onChange={(e) =>
                          updateStatus(selectedInquiry.id, e.target.value)
                        }
                        disabled={updatingStatus === selectedInquiry.id}
                        className="text-xs font-bold rounded-xl px-3 py-1.5 border border-current/20 bg-white/60 backdrop-blur focus:outline-none cursor-pointer"
                      >
                        {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                          <option key={key} value={key}>
                            {val.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })()}

              {/* Customer Info */}
              <div className="bg-zinc-50 rounded-2xl p-6 space-y-4">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Users className="h-4 w-4 text-secondary" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400 uppercase tracking-wider">
                        Full Name
                      </p>
                      <p className="font-bold text-secondary mt-0.5">
                        {selectedInquiry.fullName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Phone className="h-4 w-4 text-secondary" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400 uppercase tracking-wider">
                        Contact
                      </p>
                      <p className="font-bold text-secondary mt-0.5">
                        {selectedInquiry.contact}
                      </p>
                    </div>
                  </div>
                  {selectedInquiry.email && (
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Mail className="h-4 w-4 text-secondary" />
                      </div>
                      <div>
                        <p className="text-xs text-zinc-400 uppercase tracking-wider">
                          Email
                        </p>
                        <a
                          href={`mailto:${selectedInquiry.email}`}
                          className="font-bold text-secondary mt-0.5 hover:text-accent transition-colors block"
                        >
                          {selectedInquiry.email}
                        </a>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="h-4 w-4 text-secondary" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400 uppercase tracking-wider">
                        Address
                      </p>
                      <p className="font-bold text-secondary mt-0.5">
                        {selectedInquiry.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  <Package className="h-3.5 w-3.5" />
                  Products Requested ({selectedInquiry.products.length})
                </h3>
                <div className="space-y-2">
                  {selectedInquiry.products.map((p, i) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between bg-zinc-50 rounded-2xl px-5 py-3.5"
                    >
                      <div className="flex items-center gap-3">
                        <span className="h-7 w-7 rounded-xl bg-secondary/10 text-secondary text-xs font-bold flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span className="font-semibold text-secondary text-sm">
                          {productNames[p.productId] || (
                            <span className="text-zinc-400 italic text-xs">
                              ID: {p.productId.slice(0, 8)}...
                            </span>
                          )}
                        </span>
                      </div>
                      <Badge className="bg-secondary/10 text-secondary border-none font-bold rounded-full">
                        Qty: {p.quantity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              {selectedInquiry.description && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5" />
                    Additional Notes
                  </h3>
                  <p className="bg-zinc-50 rounded-2xl px-5 py-4 text-sm text-zinc-600 leading-relaxed italic">
                    "{selectedInquiry.description}"
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                {selectedInquiry.email && (
                  <Button
                    asChild
                    className="flex-1 h-12 rounded-2xl bg-secondary hover:bg-accent text-white hover:text-secondary font-bold transition-all gap-2"
                  >
                    <a href={`mailto:${selectedInquiry.email}`}>
                      <Mail className="h-4 w-4" />
                      Send Email
                    </a>
                  </Button>
                )}
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 h-12 rounded-2xl gap-2"
                >
                  <a href={`tel:${selectedInquiry.contact}`}>
                    <Phone className="h-4 w-4" />
                    Call
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteInquiry(selectedInquiry.id)}
                  className="h-12 w-12 rounded-2xl text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
