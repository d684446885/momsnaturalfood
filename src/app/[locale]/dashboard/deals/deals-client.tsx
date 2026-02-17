"use client";
import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Trash, 
  Edit, 
  Loader2, 
  Tag, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Search, 
  Filter,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUpload } from "@/components/image-upload";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter, usePathname } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";

interface DealsClientProps {
  initialData: any[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

export function DealsClient({ 
  initialData, 
  totalCount, 
  currentPage, 
  pageSize 
}: DealsClientProps) {
  const t = useTranslations("AdminDeals");
  const tp = useTranslations("AdminProducts"); // For some shared keys if needed
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [deals, setDeals] = useState(initialData);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<any>(null);

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discount: "",
    regularPrice: "",
    salePrice: "",
    endDate: "",
    isActive: true,
    images: [] as string[],
    productIds: [] as string[]
  });

  // Sync state when initialData changes (from router.refresh())
  useEffect(() => {
    setDeals(initialData);
  }, [initialData]);

  const fetchProducts = async () => {
    try {
      setIsDataLoading(true);
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
    setStatusFilter(value);
    const query = createQueryString({ status: value, page: 1 });
    router.push(`${pathname}?${query}`);
  };

  const handlePageChange = (page: number) => {
    const query = createQueryString({ page });
    router.push(`${pathname}?${query}`);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setEditingDeal(null);
      setFormData({
        title: "",
        description: "",
        discount: "",
        regularPrice: "",
        salePrice: "",
        endDate: "",
        isActive: true,
        images: [],
        productIds: []
      });
    }
  };

  const onEdit = (deal: any) => {
    setEditingDeal(deal);
    setFormData({
      title: deal.title,
      description: deal.description,
      discount: deal.discount?.toString() || "",
      regularPrice: deal.regularPrice?.toString() || "",
      salePrice: deal.salePrice?.toString() || "",
      endDate: deal.endDate ? format(new Date(deal.endDate), "yyyy-MM-dd") : "",
      isActive: deal.isActive,
      images: deal.images || [],
      productIds: deal.productIds || []
    });
    setIsOpen(true);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const url = editingDeal ? `/api/deals/${editingDeal.id}` : "/api/deals";
      const method = editingDeal ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          discount: formData.discount ? parseInt(formData.discount) : null,
          regularPrice: formData.regularPrice ? parseFloat(formData.regularPrice) : null,
          salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err || "Failed to save deal");
      }

      toast.success(editingDeal ? "Deal updated successfully" : "Deal created successfully");
      router.refresh();
      handleOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      setIsLoading(true);
      const response = await fetch(`/api/deals/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete deal");
      
      toast.success("Deal deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete deal");
    } finally {
      setIsLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {t('addDeal')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <form onSubmit={onSubmit}>
              <DialogHeader>
                <DialogTitle>{editingDeal ? t('editDeal') : t('dialog.title')}</DialogTitle>
                <DialogDescription>{t('dialog.description')}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="space-y-4">
                  <label className="text-sm font-bold text-zinc-700">Deal Images</label>
                  <ImageUpload 
                    value={formData.images}
                    onChange={(urls) => setFormData({ ...formData, images: urls })}
                    onRemove={(url) => setFormData({ ...formData, images: formData.images.filter(i => i !== url) })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('form.title')}</label>
                    <Input 
                      required
                      placeholder="e.g. Summer Flash Sale"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('form.endDate')}</label>
                    <Input 
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('form.description')}</label>
                  <Textarea 
                    required
                    placeholder="Describe the deal details..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Regular Price (€)</label>
                    <Input 
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.regularPrice}
                      onChange={(e) => setFormData({ ...formData, regularPrice: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sale Price (€)</label>
                    <Input 
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.salePrice}
                      onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Discount (%)</label>
                    <Input 
                      type="number"
                      placeholder="e.g. 20"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-700">Select Products</label>
                  <div className="border rounded-xl p-4 bg-muted/20">
                    <ScrollArea className="h-[200px] w-full pr-4">
                      {isDataLoading ? (
                        <div className="flex items-center justify-center h-full">
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-2">
                          {products.map((product) => (
                            <div key={product.id} className="flex items-center space-x-3 p-2 hover:bg-white/50 rounded-lg transition-colors border border-transparent hover:border-primary/10">
                              <Checkbox 
                                id={`product-${product.id}`}
                                checked={formData.productIds.includes(product.id)}
                                onCheckedChange={(checked) => {
                                  const newIds = checked 
                                    ? [...formData.productIds, product.id]
                                    : formData.productIds.filter(id => id !== product.id);
                                  setFormData({ ...formData, productIds: newIds });
                                }}
                              />
                              <label 
                                htmlFor={`product-${product.id}`}
                                className="text-sm font-medium leading-none cursor-pointer flex-1"
                              >
                                {product.name}
                                <span className="ml-2 text-xs text-muted-foreground">€{product.price}</span>
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="isActive" 
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: !!checked })}
                  />
                  <label htmlFor="isActive" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {t('form.isActive')}
                  </label>
                </div>
              </div>
              <DialogFooter className="sticky bottom-0 bg-white pt-4 border-t">
                <Button variant="outline" type="button" onClick={() => handleOpenChange(false)}>Cancel</Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingDeal ? "Save Changes" : "Create Deal"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 bg-white border-none focus-visible:ring-1 shadow-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px] border-none bg-white shadow-sm">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder={t('allStatus')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allStatus')}</SelectItem>
              <SelectItem value="active">{t('active')}</SelectItem>
              <SelectItem value="inactive">{t('inactive')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-lg bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-bold">{t('table.title')}</TableHead>
              <TableHead className="font-bold">{t('table.discount')}</TableHead>
              <TableHead className="font-bold">{t('table.status')}</TableHead>
              <TableHead className="font-bold">{t('table.endDate')}</TableHead>
              <TableHead className="text-right font-bold">{t('table.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  {t('noDeals')}
                </TableCell>
              </TableRow>
            ) : (
              deals.map((deal) => (
                <TableRow key={deal.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Tag className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-zinc-900">{deal.title}</span>
                        <span className="text-zinc-500 text-xs line-clamp-1">{deal.description}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-primary/10 text-primary font-bold">
                      {deal.discount ? `${deal.discount}% OFF` : deal.salePrice ? `€${deal.salePrice}` : "DEAL"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {deal.isActive ? (
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none flex w-fit gap-1 items-center">
                        <CheckCircle className="h-3 w-3" /> Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="flex w-fit gap-1 items-center">
                        <XCircle className="h-3 w-3" /> Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-zinc-500 text-sm">
                    {deal.endDate ? (
                       <div className="flex items-center gap-2">
                         <Calendar className="h-4 w-4" />
                         {format(new Date(deal.endDate), "MMM dd, yyyy")}
                       </div>
                    ) : "No expiry"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(deal)} className="hover:bg-primary/10 hover:text-primary">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDelete(deal.id)} className="hover:bg-destructive/10 hover:text-destructive">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          {tp('showing', { 
            count: deals.length, 
            total: totalCount 
          })}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum = i + 1;
              if (totalPages > 5) {
                if (currentPage > 3) {
                  pageNum = currentPage - 3 + i + 1;
                }
                if (pageNum > totalPages) {
                  pageNum = totalPages - (5 - i - 1);
                }
              }
              if (pageNum <= 0) return null;
              if (pageNum > totalPages) return null;

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  className="w-9"
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="gap-1"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
