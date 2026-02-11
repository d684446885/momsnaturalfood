"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { 
  Search, 
  SlidersHorizontal, 
  Grid3X3, 
  LayoutGrid, 
  X, 
  Tag, 
  Package, 
  FilterX,
  ChevronRight
} from "lucide-react";
import { useTranslations } from "next-intl";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice: number | null;
  stock: number;
  images: string[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductsClientProps {
  initialProducts: Product[];
  categories: Category[];
}

export function ProductsClient({ initialProducts, categories }: ProductsClientProps) {
  const t = useTranslations("Products");
  const [products] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid");
  
  // New Filters
  const [maxPrice, setMaxPrice] = useState<number>(500);
  const [dealsOnly, setDealsOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Dynamic absolute max price
  const absoluteMaxPrice = useMemo(() => {
    if (products.length === 0) return 100;
    return Math.ceil(Math.max(...products.map(p => p.salePrice || p.price)));
  }, [products]);

  // Sync maxPrice with absolute limit if it hasn't been touched or is too high
  useMemo(() => {
    if (maxPrice > absoluteMaxPrice && maxPrice === 500) {
        setMaxPrice(absoluteMaxPrice);
    }
  }, [absoluteMaxPrice]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const productPrice = product.salePrice || product.price;
        
        const matchesSearch = 
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase());
          
        const matchesCategory = 
          selectedCategories.length === 0 || selectedCategories.includes(product.category.id);
          
        const matchesMaxPrice = productPrice <= maxPrice;
        const matchesDeals = !dealsOnly || product.salePrice !== null;
        const matchesStock = !inStockOnly || product.stock > 0;

        return matchesSearch && matchesCategory && matchesMaxPrice && matchesDeals && matchesStock;
      })
      .sort((a, b) => {
        const priceA = a.salePrice || a.price;
        const priceB = b.salePrice || b.price;
        
        switch (sortBy) {
          case "price-asc":
            return priceA - priceB;
          case "price-desc":
            return priceB - priceA;
          case "name":
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
  }, [products, searchQuery, selectedCategories, sortBy, maxPrice, dealsOnly, inStockOnly]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId) 
        : [...prev, categoryId]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setMaxPrice(absoluteMaxPrice);
    setDealsOnly(false);
    setInStockOnly(false);
  };

  const filtersPanel = (
    <div className="space-y-8">
      {/* Search */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-widest text-secondary/50 flex items-center gap-2">
           <Search className="h-3.5 w-3.5" />
           {t('searchPlaceholder').split('...')[0]}
        </h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl bg-white border-zinc-100 shadow-sm focus-visible:ring-accent"
          />
        </div>
      </div>

      <Separator className="bg-zinc-100" />

      {/* Categories */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-secondary/50 flex items-center gap-2">
           <LayoutGrid className="h-3.5 w-3.5" />
           {t('allCategories')}
        </h3>
        <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-3 group">
              <Checkbox 
                id={category.id} 
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => toggleCategory(category.id)}
                className="rounded-md border-zinc-300 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
              />
              <Label 
                htmlFor={category.id}
                className="text-sm font-medium text-zinc-600 group-hover:text-secondary cursor-pointer transition-colors"
              >
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-zinc-100" />

      {/* Price Bar Slider */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-widest text-secondary/50 flex items-center gap-2">
               <Tag className="h-3.5 w-3.5" />
               {t('priceRange')}
            </h3>
            <Badge variant="outline" className="rounded-full border-zinc-100 text-secondary font-black bg-zinc-50">
               €{maxPrice}
            </Badge>
        </div>
        
        <div className="px-2">
            <input 
                type="range"
                min="0"
                max={absoluteMaxPrice}
                step="1"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-accent"
                style={{
                    background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${(maxPrice / absoluteMaxPrice) * 100}%, #f4f4f5 ${(maxPrice / absoluteMaxPrice) * 100}%, #f4f4f5 100%)`
                } as any}
            />
            <div className="flex justify-between mt-3 text-[10px] uppercase font-black text-zinc-300 tracking-tighter">
                <span>€0</span>
                <span>€{absoluteMaxPrice}</span>
            </div>
        </div>
      </div>

      <Separator className="bg-zinc-100" />

      {/* Special Filters */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-secondary/50 flex items-center gap-2">
           <SlidersHorizontal className="h-3.5 w-3.5" />
           {t('showOnly')}
        </h3>
        <div className="space-y-3">
            <div className="flex items-center justify-between group cursor-pointer" onClick={() => setDealsOnly(!dealsOnly)}>
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center">
                        <Tag className="h-4 w-4" />
                    </div>
                    <Label className="font-bold text-zinc-600 group-hover:text-secondary cursor-pointer transition-colors leading-none">
                        {t('dealsOnly')}
                    </Label>
                </div>
                <Checkbox 
                  checked={dealsOnly} 
                  onCheckedChange={() => setDealsOnly(!dealsOnly)} 
                  className="rounded-full shadow-sm"
                />
            </div>
            
            <div className="flex items-center justify-between group cursor-pointer" onClick={() => setInStockOnly(!inStockOnly)}>
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center">
                        <Package className="h-4 w-4" />
                    </div>
                    <Label className="font-bold text-zinc-600 group-hover:text-secondary cursor-pointer transition-colors leading-none">
                        {t('inStockOnly')}
                    </Label>
                </div>
                <Checkbox 
                  checked={inStockOnly} 
                  onCheckedChange={() => setInStockOnly(!inStockOnly)} 
                  className="rounded-full shadow-sm"
                />
            </div>
        </div>
      </div>

      <Button 
        variant="outline" 
        onClick={clearAllFilters}
        className="w-full rounded-2xl h-12 border-zinc-100 hover:bg-zinc-50 font-bold gap-2 text-zinc-500"
      >
        <FilterX className="h-4 w-4" />
        {t('reset')}
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-transparent">

      <main className="container mx-auto px-4 md:px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-32 bg-white rounded-[2.5rem] p-8 shadow-xl shadow-secondary/5 border border-zinc-100">
               <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-serif font-bold italic text-secondary">{t('filters')}</h2>
                  <Badge variant="secondary" className="bg-secondary/5 text-secondary border-none animate-pulse">
                     {filteredProducts.length} Results
                  </Badge>
               </div>
               {filtersPanel}
            </div>
          </aside>

          <div className="flex-1 space-y-8">
             {/* Header & Mobile Filter Trigger */}
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-100">
                <div className="space-y-1">
                   <Badge className="bg-accent/10 text-accent hover:bg-accent/20 mb-2 border-none font-bold uppercase tracking-wider text-[10px]">
                      Nature's Best
                   </Badge>
                   <h1 className="text-4xl md:text-5xl font-serif font-bold italic tracking-tight text-secondary">
                      {t('title')}
                   </h1>
                   <p className="text-zinc-500 font-light italic max-w-lg">
                      {t('subtitle')}
                   </p>
                </div>

                <div className="flex items-center gap-3">
                   {/* Mobile Filter Sheet */}
                   <Sheet>
                      <SheetTrigger asChild>
                         <Button variant="outline" size="lg" className="lg:hidden rounded-full px-6 h-12 border-zinc-200 bg-white gap-2 font-bold shadow-sm">
                            <SlidersHorizontal className="h-4 w-4" />
                            {t('filters')}
                         </Button>
                      </SheetTrigger>
                      <SheetContent side="left" className="w-full sm:max-w-md bg-white border-none p-0 overflow-y-auto">
                         <SheetHeader className="p-8 bg-secondary text-white rounded-b-[2.5rem]">
                            <SheetTitle className="text-3xl font-serif italic font-bold text-white">Filters</SheetTitle>
                         </SheetHeader>
                         <div className="p-8">
                            {filtersPanel}
                         </div>
                      </SheetContent>
                   </Sheet>

                   <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="h-12 w-[180px] rounded-full px-6 border-zinc-200 bg-white text-sm font-bold shadow-sm">
                         <SelectValue placeholder={t('sortBy')} />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-zinc-100 shadow-2xl p-2">
                         <SelectItem value="newest" className="rounded-xl font-medium">{t('newest')}</SelectItem>
                         <SelectItem value="price-asc" className="rounded-xl font-medium">{t('priceAsc')}</SelectItem>
                         <SelectItem value="price-desc" className="rounded-xl font-medium">{t('priceDesc')}</SelectItem>
                         <SelectItem value="name" className="rounded-xl font-medium">{t('nameAsc')}</SelectItem>
                      </SelectContent>
                   </Select>

                   <div className="flex p-1 bg-white border border-zinc-100 rounded-full shadow-sm">
                      <Button
                         variant="ghost"
                         size="icon"
                         className={cn("h-10 w-10 rounded-full group transition-all", viewMode === "grid" ? "bg-secondary text-white shadow-lg" : "text-zinc-400")}
                         onClick={() => setViewMode("grid")}
                      >
                         <LayoutGrid className="h-5 w-5 group-hover:scale-110" />
                      </Button>
                      <Button
                         variant="ghost"
                         size="icon"
                         className={cn("h-10 w-10 rounded-full group transition-all", viewMode === "compact" ? "bg-secondary text-white shadow-lg" : "text-zinc-400")}
                         onClick={() => setViewMode("compact")}
                      >
                         <Grid3X3 className="h-5 w-5 group-hover:scale-110" />
                      </Button>
                   </div>
                </div>
             </div>

             {/* Active Filter Badges */}
             <div className="flex flex-wrap gap-2">
                {selectedCategories.map(catId => (
                  <Badge key={catId} variant="secondary" className="bg-white border-zinc-100 text-zinc-500 font-bold px-4 py-2 rounded-full shadow-sm gap-2">
                     {categories.find(c => c.id === catId)?.name}
                     <button onClick={() => toggleCategory(catId)} className="hover:text-accent">
                        <X className="h-3 w-3" />
                     </button>
                  </Badge>
                ))}
                {maxPrice < absoluteMaxPrice && (
                   <Badge variant="secondary" className="bg-accent/5 border-accent/10 text-accent font-bold px-4 py-2 rounded-full shadow-sm gap-2">
                      €0 - €{maxPrice}
                   </Badge>
                )}
                {dealsOnly && (
                   <Badge variant="secondary" className="bg-orange-50 border-orange-100 text-orange-500 font-bold px-4 py-2 rounded-full shadow-sm gap-2">
                      <Tag className="h-3 w-3" />
                      {t('dealsOnly')}
                   </Badge>
                )}
             </div>

             {/* Products Grid */}
             <AnimatePresence mode="wait">
               {filteredProducts.length > 0 ? (
                 <motion.div
                   key="products"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   className={`grid gap-x-8 gap-y-12 ${
                     viewMode === "grid"
                       ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                       : "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4"
                   }`}
                 >
                   {filteredProducts.map((product, index) => (
                     <ProductCard
                       key={product.id}
                       product={product}
                       index={index}
                     />
                   ))}
                 </motion.div>
               ) : (
                 <motion.div
                   key="empty"
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[3rem] shadow-xl shadow-secondary/5 border border-zinc-100"
                 >
                   <div className="h-24 w-24 rounded-full bg-zinc-50 flex items-center justify-center mb-6">
                      <FilterX className="h-10 w-10 text-zinc-300" />
                   </div>
                   <h3 className="text-2xl font-serif font-bold italic text-secondary mb-2">{t('noProductsFound')}</h3>
                   <p className="text-zinc-500 font-light italic mb-8 max-w-sm">
                     {t('adjustSearch')}
                   </p>
                   <Button
                     onClick={clearAllFilters}
                     className="rounded-full px-10 h-14 bg-accent hover:bg-white hover:text-secondary font-bold shadow-xl shadow-accent/20 transition-all"
                   >
                     {t('clearFilters')}
                   </Button>
                 </motion.div>
               )}
             </AnimatePresence>

             {/* Results Count Summary */}
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="pt-12 flex items-center justify-center gap-4 text-zinc-400"
             >
                <div className="h-[1px] flex-1 bg-zinc-100" />
                <p className="text-xs font-bold uppercase tracking-widest bg-white px-6 py-2 rounded-full border border-zinc-50">
                   {t('showing')} {filteredProducts.length} {t('of')} {products.length} {t('title')}
                </p>
                <div className="h-[1px] flex-1 bg-zinc-100" />
             </motion.div>
          </div>
        </div>
      </main>

    </div>
  );
}

// Utility function for conditional classNames
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
