"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash, 
  Trash2,
  Image as ImageIcon,
  Filter,
  Download,
  CheckCircle2,
  Loader2,
  X,
  PlusCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { R2ImageUpload } from "@/components/r2-image-upload";
import { toast } from "sonner";
import { useRouter, usePathname } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface NutritionFact {
  nutrient: string;
  per100g: string;
  portion: string;
  ri100g: string;
  riPortion: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: any;
  salePrice?: any;
  weight?: string;
  stock: number;
  images: string[];
  highlights?: string[];
  ingredients?: string[];
  nutritionFacts?: NutritionFact[];
  perfectWith?: string[];
  orderCount?: number;
  category: {
    id: string;
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
}

interface AdminProductsClientProps {
  products: Product[];
  categories: Category[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

export function AdminProductsClient({ 
  products, 
  categories, 
  totalCount, 
  currentPage, 
  pageSize 
}: AdminProductsClientProps) {
  const t = useTranslations("AdminProducts");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get("category") || "all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    salePrice: "",
    weight: "",
    stock: "",
    categoryId: "",
    images: [] as string[],
    highlights: [""] as string[],
    ingredients: [""] as string[],
    nutritionFacts: [{ nutrient: "", per100g: "", portion: "", ri100g: "", riPortion: "" }] as NutritionFact[],
    perfectWith: [""] as string[],
    orderCount: "0"
  });

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

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    const query = createQueryString({ category: value, page: 1 });
    router.push(`${pathname}?${query}`);
  };

  const handlePageChange = (page: number) => {
    const query = createQueryString({ page });
    router.push(`${pathname}?${query}`);
  };

  const onSubmit = async () => {
    try {
      if (!formData.name || !formData.categoryId || !formData.price) {
        return toast.error(t('required'));
      }

      setIsLoading(true);
      // Clean up empty arrays
      const cleanedData = {
        ...formData,
        highlights: formData.highlights.filter(h => h.trim() !== ""),
        ingredients: formData.ingredients.filter(i => i.trim() !== ""),
        nutritionFacts: formData.nutritionFacts.filter(nf => nf.nutrient.trim() !== ""),
        perfectWith: formData.perfectWith.filter(pw => pw.trim() !== ""),
      };

      const url = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products";
      const method = editingProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save product");
      }

      toast.success(editingProduct ? t('successUpdate') : t('successCreate'));
      setIsAddDialogOpen(false);
      resetForm();
      router.refresh();
    } catch (error: any) {
      console.error("Product submission error:", error);
      toast.error(error.message || t('errorGeneric'));
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async (id: string) => {
      if (!confirm(t('deleteConfirm'))) return;
      
      try {
          setIsLoading(true);
          const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to delete product");
          }
          toast.success(t('successDelete'));
          router.refresh();
      } catch (error: any) {
          console.error("Delete product error:", error);
          toast.error(error.message || t('errorGeneric'));
      } finally {
          setIsLoading(false);
      }
  };

  const onEdit = (product: Product) => {
      setEditingProduct(product);
      setFormData({
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          salePrice: product.salePrice ? product.salePrice.toString() : "",
          weight: product.weight || "",
          stock: product.stock.toString(),
          categoryId: product.category.id,
          images: product.images,
          highlights: product.highlights?.length ? product.highlights : [""],
          ingredients: product.ingredients?.length ? product.ingredients : [""],
          nutritionFacts: product.nutritionFacts?.length ? product.nutritionFacts : [{ nutrient: "", per100g: "", portion: "", ri100g: "", riPortion: "" }],
          perfectWith: product.perfectWith?.length ? product.perfectWith : [""],
          orderCount: product.orderCount?.toString() || "0"
      });
      setIsAddDialogOpen(true);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({ 
      name: "", 
      description: "", 
      price: "", 
      salePrice: "",
      weight: "",
      stock: "", 
      categoryId: "", 
      images: [],
      highlights: [""],
      ingredients: [""],
      nutritionFacts: [{ nutrient: "", per100g: "", portion: "", ri100g: "", riPortion: "" }],
      perfectWith: [""],
      orderCount: "0"
    });
  };

  const formatPrice = (price: any) => {
    const val = typeof price === 'object' ? parseFloat(price.toString()) : parseFloat(String(price));
    return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(val);
  };

  // Dynamic Array Handlers
  const addField = (field: 'highlights' | 'ingredients' | 'perfectWith') => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  const removeField = (field: 'highlights' | 'ingredients' | 'perfectWith', index: number) => {
    const updated = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: updated.length ? updated : [""] });
  };

  const updateField = (field: 'highlights' | 'ingredients' | 'perfectWith', index: number, value: string) => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData({ ...formData, [field]: updated });
  };

  // Nutrition Fact Handlers
  const addNutritionFact = () => {
    setFormData({ 
      ...formData, 
      nutritionFacts: [...formData.nutritionFacts, { nutrient: "", per100g: "", portion: "", ri100g: "", riPortion: "" }] 
    });
  };

  const removeNutritionFact = (index: number) => {
    const updated = formData.nutritionFacts.filter((_, i) => i !== index);
    setFormData({ ...formData, nutritionFacts: updated.length ? updated : [{ nutrient: "", per100g: "", portion: "", ri100g: "", riPortion: "" }] });
  };

  const updateNutritionFact = (index: number, key: keyof NutritionFact, value: string) => {
    const updated = [...formData.nutritionFacts];
    updated[index] = { ...updated[index], [key]: value };
    setFormData({ ...formData, nutritionFacts: updated });
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                {t('export')}
            </Button>
            <Button size="sm" className="gap-2" onClick={() => { resetForm(); setIsAddDialogOpen(true); }}>
                <Plus className="h-4 w-4" />
                {t('addProduct')}
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
                setIsAddDialogOpen(open);
                if (!open) resetForm();
            }}>
                <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-hidden flex flex-col p-0">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle>{editingProduct ? t('editProduct') : t('dialog.title')}</DialogTitle>
                        <DialogDescription>
                            {editingProduct ? t('editDescription') : t('dialog.description')}
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                        {/* Image Section */}
                        <div className="space-y-4">
                           <h3 className="text-sm font-bold uppercase tracking-widest text-secondary">{t('dialog.images')}</h3>
                           <R2ImageUpload 
                              images={formData.images}
                              onChange={(urls) => setFormData({ ...formData, images: urls })}
                              maxImages={5}
                              folder="products"
                           />
                        </div>

                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('form.name')}</label>
                                <Input 
                                    placeholder={t('form.namePlaceholder')} 
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('form.category')}</label>
                                <Select value={formData.categoryId} onValueChange={(val) => setFormData({ ...formData, categoryId: val })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('form.selectCategory')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t('form.description')}</label>
                            <Input 
                                placeholder={t('form.descriptionPlaceholder')} 
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        {/* Pricing & Logistics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('form.price')} (€)</label>
                                <Input 
                                    type="number" 
                                    placeholder="0.00" 
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Sale Price (€)</label>
                                <Input 
                                    type="number" 
                                    placeholder="0.00" 
                                    value={formData.salePrice}
                                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Weight</label>
                                <Input 
                                    placeholder="e.g. 500g" 
                                    value={formData.weight}
                                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('form.stock')}</label>
                                <Input 
                                    type="number" 
                                    placeholder="0" 
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Orders Count (Manual Input)</label>
                                <Input 
                                    type="number" 
                                    placeholder="0" 
                                    value={formData.orderCount}
                                    onChange={(e) => setFormData({ ...formData, orderCount: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Product Highlights */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-secondary">Product Highlights</h3>
                                <Button type="button" variant="outline" size="sm" onClick={() => addField('highlights')}>
                                    <PlusCircle className="h-4 w-4 mr-2" /> Add
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                {formData.highlights.map((h, i) => (
                                    <div key={i} className="flex gap-2">
                                        <Input 
                                            placeholder="e.g. High in Fiber" 
                                            value={h} 
                                            onChange={(e) => updateField('highlights', i, e.target.value)} 
                                        />
                                        <Button variant="ghost" size="icon" onClick={() => removeField('highlights', i)}>
                                            <X className="h-4 w-4 text-rose-500" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Ingredients */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-secondary">Ingredients</h3>
                                <Button type="button" variant="outline" size="sm" onClick={() => addField('ingredients')}>
                                    <PlusCircle className="h-4 w-4 mr-2" /> Add
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                {formData.ingredients.map((ing, i) => (
                                    <div key={i} className="flex gap-2">
                                        <Input 
                                            placeholder="e.g. Quinoa flour (32%)" 
                                            value={ing} 
                                            onChange={(e) => updateField('ingredients', i, e.target.value)} 
                                        />
                                        <Button variant="ghost" size="icon" onClick={() => removeField('ingredients', i)}>
                                            <X className="h-4 w-4 text-rose-500" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Nutrition Facts */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-secondary">Nutrition Facts</h3>
                                <Button type="button" variant="outline" size="sm" onClick={addNutritionFact}>
                                    <PlusCircle className="h-4 w-4 mr-2" /> Add Nutrient
                                </Button>
                            </div>
                            <div className="space-y-4 border rounded-xl p-4 bg-muted/20">
                                <div className="grid grid-cols-6 gap-4 text-xs font-bold text-muted-foreground px-2">
                                    <div className="col-span-2 text-primary">Nutrient</div>
                                    <div>100g</div>
                                    <div>Portion</div>
                                    <div>RI% 100g</div>
                                    <div>RI% Port.</div>
                                </div>
                                {formData.nutritionFacts.map((nf, i) => (
                                    <div key={i} className="grid grid-cols-6 gap-2 group relative">
                                        <div className="col-span-2">
                                            <Input 
                                                placeholder="Nutrient" 
                                                value={nf.nutrient} 
                                                onChange={(e) => updateNutritionFact(i, 'nutrient', e.target.value)} 
                                                className="h-8 text-sm"
                                            />
                                        </div>
                                        <Input 
                                            placeholder="val" 
                                            value={nf.per100g} 
                                            onChange={(e) => updateNutritionFact(i, 'per100g', e.target.value)} 
                                            className="h-8 text-sm px-1 text-center font-medium"
                                        />
                                        <Input 
                                            placeholder="val" 
                                            value={nf.portion} 
                                            onChange={(e) => updateNutritionFact(i, 'portion', e.target.value)} 
                                            className="h-8 text-sm px-1 text-center font-medium"
                                        />
                                        <Input 
                                            placeholder="%" 
                                            value={nf.ri100g} 
                                            onChange={(e) => updateNutritionFact(i, 'ri100g', e.target.value)} 
                                            className="h-8 text-sm px-1 text-center text-primary"
                                        />
                                        <div className="flex items-center gap-1">
                                            <Input 
                                                placeholder="%" 
                                                value={nf.riPortion} 
                                                onChange={(e) => updateNutritionFact(i, 'riPortion', e.target.value)} 
                                                className="h-8 text-sm px-1 text-center text-primary"
                                            />
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500" onClick={() => removeNutritionFact(i)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Perfect With */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-secondary">Perfect With</h3>
                                <Button type="button" variant="outline" size="sm" onClick={() => addField('perfectWith')}>
                                    <PlusCircle className="h-4 w-4 mr-2" /> Add Tag
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.perfectWith.map((pw, i) => (
                                    <div key={i} className="flex gap-1 items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
                                        <Input 
                                            placeholder="Tag" 
                                            value={pw} 
                                            onChange={(e) => updateField('perfectWith', i, e.target.value)} 
                                            className="h-8 w-32 bg-transparent border-none focus-visible:ring-0"
                                        />
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeField('perfectWith', i)}>
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="p-6 pt-0 border-t bg-gray-50/50">
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isLoading}>{t('dialog.cancel')}</Button>
                        <Button onClick={onSubmit} disabled={isLoading} className="gap-2 shadow-lg shadow-primary/20">
                           {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                           {editingProduct ? t('saveChanges') : t('dialog.create')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
      </div>

      <Card className="shadow-sm border-none bg-white">
        <CardHeader className="pb-3 px-6 pt-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9 bg-gray-50/50 border-none focus-visible:ring-1"
              />
            </div>
            <div className="flex items-center gap-2">
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="w-[180px] border-none bg-gray-50/50">
                        <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                        <SelectValue placeholder={t('allCategories')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{t('allCategories')}</SelectItem>
                        {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                            {category.name}
                        </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-md border-t">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead className="w-[80px] pl-6 font-semibold">{t('table.image')}</TableHead>
                  <TableHead className="font-semibold">{t('table.name')}</TableHead>
                  <TableHead className="font-semibold">{t('table.category')}</TableHead>
                  <TableHead className="font-semibold text-right">{t('table.price')}</TableHead>
                  <TableHead className="font-semibold text-center">{t('table.stock')}</TableHead>
                  <TableHead className="font-semibold text-center">{t('table.status')}</TableHead>
                  <TableHead className="w-[100px] text-right pr-6">{t('table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {products.map((product) => (
                    <TableRow key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                      <TableCell className="pl-6">
                        <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden border">
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                          ) : (
                            <ImageIcon className="h-6 w-6 text-muted-foreground/40" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <div className="flex flex-col">
                          <span className="font-medium line-clamp-1" title={product.name}>{product.name}</span>
                          <span className="text-xs text-muted-foreground line-clamp-1" title={product.description}>{product.description}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-normal border-none">
                          {product.category.name}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {product.salePrice ? (
                            <div className="flex flex-col">
                                <span className="text-primary">{formatPrice(product.salePrice)}</span>
                                <span className="text-[10px] line-through text-muted-foreground leading-none">{formatPrice(product.price)}</span>
                            </div>
                        ) : formatPrice(product.price)}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={cn(
                          "text-sm font-medium",
                          product.stock < 10 ? "text-red-500" : "text-muted-foreground"
                        )}>
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        {product.stock > 0 ? (
                          <div className="flex items-center justify-center gap-1.5 text-emerald-600">
                             <CheckCircle2 className="h-4 w-4" />
                             <span className="text-xs font-semibold">{t('table.inStock')}</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1.5 text-rose-500">
                             <span className="text-xs font-semibold">{t('table.outOfStock')}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-zinc-100">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuLabel>{t('table.actions')}</DropdownMenuLabel>
                            <DropdownMenuItem className="gap-2 focus:bg-primary/5 cursor-pointer" onClick={() => onEdit(product)}>
                              <Edit className="h-4 w-4 text-blue-500" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 text-rose-600 focus:bg-rose-50 cursor-pointer" onClick={() => onDelete(product.id)}>
                              <Trash className="h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
            {products.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Search className="h-10 w-10 text-muted-foreground/30" />
                </div>
                <h3 className="text-xl font-semibold">{t('noProducts')}</h3>
                <p className="text-muted-foreground max-w-sm mt-2">
                  {t('noProductsDesc')}
                </p>
                <Button variant="outline" className="mt-6" onClick={() => { handleSearchChange(""); handleCategoryChange("all"); }}>
                  {t('clearFilters')}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          {t('showing', { 
            count: products.length, 
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
              // Simple pagination logic to show current +/- 2 pages
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


