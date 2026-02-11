"use client";

import React, { useState } from "react";
import { 
  Plus, 
  Trash, 
  Edit, 
  Loader2, 
  Ticket, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Hash
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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { format } from "date-fns";

interface CouponsClientProps {
  initialData: any[];
  categories: any[];
  products: any[];
  deals: any[];
}

export function CouponsClient({ initialData, categories, products, deals }: CouponsClientProps) {
  const t = useTranslations("AdminCoupons");
  const [coupons, setCoupons] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);

  const [formData, setFormData] = useState({
    code: "",
    type: "PERCENTAGE",
    value: "",
    minPurchase: "0",
    expiryDate: "",
    usageLimit: "",
    scope: "GLOBAL",
    isActive: true,
    productIds: [] as string[],
    categoryIds: [] as string[],
    dealIds: [] as string[]
  });

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
       code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, code });
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setEditingCoupon(null);
      setFormData({
        code: "",
        type: "PERCENTAGE",
        value: "",
        minPurchase: "0",
        expiryDate: "",
        usageLimit: "",
        scope: "GLOBAL",
        isActive: true,
        productIds: [],
        categoryIds: [],
        dealIds: []
      });
    }
  };

  const onEdit = (coupon: any) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value.toString(),
      minPurchase: coupon.minPurchase?.toString() || "0",
      expiryDate: coupon.expiryDate ? format(new Date(coupon.expiryDate), "yyyy-MM-dd") : "",
      usageLimit: coupon.usageLimit?.toString() || "",
      scope: coupon.scope,
      isActive: coupon.isActive,
      productIds: coupon.productIds || [],
      categoryIds: coupon.categoryIds || [],
      dealIds: coupon.dealIds || []
    });
    setIsOpen(true);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const url = editingCoupon ? `/api/coupons/${editingCoupon.id}` : "/api/coupons";
      const method = editingCoupon ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err || "Failed to save coupon");
      }

      const savedCoupon = await response.json();
      
      if (editingCoupon) {
        setCoupons(coupons.map(c => c.id === savedCoupon.id ? savedCoupon : c));
        toast.success("Coupon updated successfully");
      } else {
        setCoupons([savedCoupon, ...coupons]);
        toast.success("Coupon created successfully");
      }
      
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
      const response = await fetch(`/api/coupons/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete coupon");
      
      setCoupons(coupons.filter(c => c.id !== id));
      toast.success("Coupon deleted successfully");
    } catch (error) {
      toast.error("Failed to delete coupon");
    } finally {
      setIsLoading(false);
    }
  };

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
              {t('addCoupon')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <form onSubmit={onSubmit}>
              <DialogHeader>
                <DialogTitle>{editingCoupon ? t('editCoupon') : t('dialog.title')}</DialogTitle>
                <DialogDescription>{t('dialog.description')}</DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700">{t('form.code')}</label>
                    <div className="flex gap-2">
                      <Input 
                        required
                        placeholder="e.g. WELCOME20"
                        className="font-mono uppercase"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      />
                      <Button type="button" variant="outline" size="icon" onClick={generateCode} title={t('autoGenerate')}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700">{t('form.expiryDate')}</label>
                    <Input 
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700">{t('form.type')}</label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(val) => setFormData({ ...formData, type: val })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PERCENTAGE">{t('types.PERCENTAGE')}</SelectItem>
                        <SelectItem value="FIXED">{t('types.FIXED')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700">{t('form.value')}</label>
                    <Input 
                      required
                      type="number"
                      step="0.01"
                      placeholder="e.g. 10"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700">{t('form.minPurchase')}</label>
                    <Input 
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.minPurchase}
                      onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                   <label className="text-sm font-bold text-zinc-700">{t('form.usageLimit')}</label>
                    <Input 
                      type="number"
                      placeholder="Unlimited if empty"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700">{t('form.scope')}</label>
                    <Select 
                      value={formData.scope} 
                      onValueChange={(val) => setFormData({ ...formData, scope: val })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select scope" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GLOBAL">{t('scopes.GLOBAL')}</SelectItem>
                        <SelectItem value="PRODUCT">{t('scopes.PRODUCT')}</SelectItem>
                        <SelectItem value="CATEGORY">{t('scopes.CATEGORY')}</SelectItem>
                        <SelectItem value="DEAL">{t('scopes.DEAL')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Scope Selection Areas */}
                {formData.scope === "PRODUCT" && (
                   <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700">{t('form.selectProducts')}</label>
                    <div className="border rounded-xl p-4 bg-muted/20">
                      <ScrollArea className="h-[200px] w-full pr-4">
                        <div className="grid grid-cols-1 gap-2">
                          {products.map((p) => (
                            <div key={p.id} className="flex items-center space-x-3 p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-primary/10">
                              <Checkbox 
                                id={`p-${p.id}`}
                                checked={formData.productIds.includes(p.id)}
                                onCheckedChange={(checked) => {
                                  const newIds = checked 
                                    ? [...formData.productIds, p.id]
                                    : formData.productIds.filter(id => id !== p.id);
                                  setFormData({ ...formData, productIds: newIds });
                                }}
                              />
                              <label htmlFor={`p-${p.id}`} className="text-sm font-medium leading-none cursor-pointer flex-1">
                                {p.name}
                                <span className="ml-2 text-xs text-muted-foreground">${p.price}</span>
                              </label>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                )}

                {formData.scope === "CATEGORY" && (
                   <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700">{t('form.selectCategories')}</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2 border rounded-xl">
                      {categories.map((c) => (
                        <div key={c.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`c-${c.id}`}
                            checked={formData.categoryIds.includes(c.id)}
                            onCheckedChange={(checked) => {
                              const newIds = checked 
                                ? [...formData.categoryIds, c.id]
                                : formData.categoryIds.filter(id => id !== c.id);
                              setFormData({ ...formData, categoryIds: newIds });
                            }}
                          />
                          <label htmlFor={`c-${c.id}`} className="text-sm font-medium cursor-pointer">{c.name}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {formData.scope === "DEAL" && (
                   <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700">{t('form.selectDeals')}</label>
                    <div className="grid grid-cols-1 gap-2 p-2 border rounded-xl">
                      {deals.map((d) => (
                        <div key={d.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`d-${d.id}`}
                            checked={formData.dealIds.includes(d.id)}
                            onCheckedChange={(checked) => {
                              const newIds = checked 
                                ? [...formData.dealIds, d.id]
                                : formData.dealIds.filter(id => id !== d.id);
                              setFormData({ ...formData, dealIds: newIds });
                            }}
                          />
                          <label htmlFor={`d-${d.id}`} className="text-sm font-medium cursor-pointer">{d.title}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
                  {editingCoupon ? "Save Changes" : "Create Coupon"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-bold">{t('table.code')}</TableHead>
              <TableHead className="font-bold">{t('table.type')}</TableHead>
              <TableHead className="font-bold">{t('table.value')}</TableHead>
              <TableHead className="font-bold">{t('table.expiry')}</TableHead>
              <TableHead className="font-bold">{t('table.usage')}</TableHead>
              <TableHead className="font-bold">{t('table.status')}</TableHead>
              <TableHead className="text-right font-bold">{t('table.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  {t('noCoupons')}
                </TableCell>
              </TableRow>
            ) : (
              coupons.map((coupon) => (
                <TableRow key={coupon.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Ticket className="h-5 w-5" />
                      </div>
                      <span className="font-mono font-bold text-zinc-900">{coupon.code}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs uppercase">
                      {coupon.scope.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold">
                      {coupon.type === "PERCENTAGE" ? `${coupon.value}%` : `$${coupon.value}`}
                    </span>
                  </TableCell>
                  <TableCell className="text-zinc-500 text-sm">
                    {coupon.expiryDate ? (
                       <div className="flex items-center gap-2">
                         <Calendar className="h-4 w-4" />
                         {format(new Date(coupon.expiryDate), "MMM dd, yyyy")}
                       </div>
                    ) : "No expiry"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm text-zinc-600">
                      <Hash className="h-3.5 w-3.5" />
                      {coupon.usageCount} / {coupon.usageLimit || "∞"}
                    </div>
                  </TableCell>
                  <TableCell>
                    {coupon.isActive ? (
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none gap-1 py-0.5 px-2">
                        <CheckCircle className="h-3 w-3" /> Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1 py-0.5 px-2">
                        <XCircle className="h-3 w-3" /> Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(coupon)} className="hover:bg-primary/10 hover:text-primary">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDelete(coupon.id)} className="hover:bg-destructive/10 hover:text-destructive">
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
    </div>
  );
}
