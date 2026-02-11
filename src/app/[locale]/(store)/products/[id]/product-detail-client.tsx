"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/store/use-cart";
import { 
  ShoppingCart, 
  ArrowLeft, 
  Star, 
  ShieldCheck, 
  Truck, 
  RefreshCcw,
  Minus,
  Plus,
  Heart,
  CheckCircle2,
  Leaf,
  Info,
  Scale,
  FlaskConical,
  Activity
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

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
    slug: string;
  };
}

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const t = useTranslations("ProductDetail");
  const commonT = useTranslations("Common");
  const cart = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
        const productForCart = {
            ...product,
            price: product.salePrice ? parseFloat(product.salePrice.toString()) : parseFloat(product.price.toString())
        };
        cart.addItem(productForCart as any);
    }
    toast.success(t('addedToCart'));
  };

  const images = product.images.length > 0 ? product.images : [null];
  const displayPrice = product.salePrice || product.price;
  const hasSale = !!product.salePrice;

  return (
    <div className="min-h-screen bg-transparent">
      
      <main className="container px-4 py-8 md:py-12">
        {/* Navigation */}
        <Link 
          href="/products" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          {t('backToProducts')}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Image Gallery */}
          <div className="lg:col-span-5 space-y-4 md:sticky md:top-24">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square relative rounded-none overflow-hidden bg-muted border border-primary/5 shadow-xl flex items-center justify-center p-6 max-w-sm mx-auto lg:max-w-none"
            >
              {images[activeImage] ? (
                <img 
                  src={images[activeImage]!} 
                  alt={product.name} 
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <span className="text-9xl opacity-10 font-serif font-bold uppercase">
                  {product.name[0]}
                </span>
              )}
              
              <div className="absolute top-8 left-8 flex flex-col gap-2">
                <Badge 
                    variant="secondary" 
                    className="px-4 py-1.5 text-sm backdrop-blur-md bg-[#f2e8da] border-none shadow-sm text-amber-900 font-bold"
                >
                    {product.category.name}
                </Badge>
                {hasSale && (
                    <Badge className="bg-rose-500 text-white border-none px-3 py-1 text-xs font-bold shadow-lg">
                        SALE
                    </Badge>
                )}
              </div>
              
              <button className="absolute top-8 right-8 p-3 rounded-full bg-white/90 shadow-lg hover:bg-white transition-all hover:scale-110">
                <Heart className="h-5 w-5 text-gray-600" />
              </button>

              {product.weight && (
                 <div className="absolute bottom-8 right-8 flex items-center gap-2 bg-white/80 backdrop-blur px-3 py-1.5 rounded-2xl border border-white/50 text-xs font-bold text-secondary shadow-sm">
                    <Scale className="h-3.5 w-3.5" />
                    {product.weight}
                 </div>
              )}
            </motion.div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4 px-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`aspect-square rounded-none overflow-hidden border-2 transition-all p-1 bg-white ${
                      activeImage === idx ? "border-primary shadow-lg scale-95" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    {img ? (
                      <img src={img} alt="" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center rounded-xl">
                        <span className="text-xl opacity-20 font-serif font-bold">{product.name[0]}</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 flex flex-col h-full space-y-5"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                    {t('reviews')}
                </span>
              </div>
              
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-secondary tracking-tight leading-tight">
                {product.name}
              </h1>

              <div className="flex items-end gap-3">
                <p className="font-serif text-3xl font-bold text-primary">
                  €{parseFloat(displayPrice || 0).toFixed(2)}
                </p>
                {hasSale && (
                   <span className="text-lg text-muted-foreground line-through decoration-rose-500/50 mb-1">
                      €{parseFloat(product.price || 0).toFixed(2)}
                   </span>
                )}
              </div>
            </div>

            {/* Action Section - Moved here after price */}
            <Card className="border-none shadow-lg shadow-primary/5 bg-zinc-50/50 p-5 rounded-[24px] overflow-hidden relative">
               <div className="flex flex-col sm:flex-row gap-6 items-end sm:items-center relative z-10">
                  <div className="flex flex-col gap-3">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                       Select Quantity
                    </span>
                    <div className="flex items-center border-2 border-primary/10 rounded-2xl overflow-hidden bg-white shadow-sm">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-4 hover:bg-primary/5 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-8 font-bold text-xl min-w-[70px] text-center">
                        {quantity}
                      </span>
                      <button 
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-4 hover:bg-primary/5 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button 
                        size="lg" 
                        className="h-14 px-10 text-base font-bold shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all rounded-xl gap-3"
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                    >
                        <ShoppingCart className="h-5 w-5" />
                        {commonT('addToBasket')}
                    </Button>
                  </div>
               </div>
            </Card>

            <div className="flex flex-wrap items-center gap-3">
                {product.stock > 0 ? (
                  <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
                    <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                    {t('inStock')}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-rose-600 bg-rose-50 px-4 py-1.5 rounded-full text-sm font-bold">
                    <span className="h-2 w-2 rounded-full bg-rose-600" />
                    {t('outOfStock')}
                  </div>
                )}
                {product.orderCount && product.orderCount > 0 && (
                   <div className="text-sm font-medium text-muted-foreground bg-zinc-100 px-4 py-1.5 rounded-full">
                      <span className="text-secondary font-bold">{product.orderCount}+</span> bestellingen
                   </div>
                )}
                <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold opacity-60">SKU: MONF-{product.id.slice(-6).toUpperCase()}</span>
            </div>

            {/* Interactive Details Buttons */}
            <div className="flex flex-wrap gap-4 py-2">
                {Array.isArray(product.ingredients) && product.ingredients.length > 0 && (
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="rounded-xl h-12 px-6 border-emerald-100 hover:bg-emerald-50 text-emerald-700 font-bold gap-3 shadow-sm transition-all">
                                <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                                    <Leaf className="h-4 w-4" />
                                </div>
                                Ingredients
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px] rounded-[32px] border-none shadow-2xl p-0 overflow-hidden bg-white">
                            <DialogHeader className="p-8 bg-emerald-600 text-white">
                                <DialogTitle className="text-3xl font-serif italic flex items-center gap-3">
                                    <Leaf className="h-8 w-8" />
                                    Pure Ingredients
                                </DialogTitle>
                            </DialogHeader>
                            <ScrollArea className="max-h-[60vh] p-8">
                                <ul className="space-y-4">
                                    {product.ingredients.map((ing, i) => (
                                        <motion.li 
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="flex gap-4 items-start group"
                                        >
                                            <div className="h-2 w-2 rounded-full bg-emerald-500 mt-2.5 shrink-0 group-hover:scale-125 transition-transform" />
                                            <span className="text-lg text-secondary/80 font-medium leading-tight">{ing}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </ScrollArea>
                        </DialogContent>
                    </Dialog>
                )}

                {Array.isArray(product.nutritionFacts) && product.nutritionFacts.length > 0 && (
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="rounded-xl h-12 px-6 border-amber-100 hover:bg-amber-50 text-amber-700 font-bold gap-3 shadow-sm transition-all">
                                <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center">
                                    <Activity className="h-4 w-4" />
                                </div>
                                Nutrition Facts
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[700px] rounded-[32px] border-none shadow-2xl p-0 overflow-hidden bg-white">
                            <DialogHeader className="p-8 bg-amber-500 text-white">
                                <DialogTitle className="text-3xl font-serif italic flex items-center gap-3">
                                    <Activity className="h-8 w-8" />
                                    Nutrition Facts
                                </DialogTitle>
                            </DialogHeader>
                            <div className="p-8 overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-amber-50/50 hover:bg-amber-50/50 border-amber-100">
                                            <TableHead className="font-bold text-amber-900 uppercase tracking-widest text-[10px]">Nutrient</TableHead>
                                            <TableHead className="font-bold text-amber-900 uppercase tracking-widest text-[10px]">Per 100g</TableHead>
                                            <TableHead className="font-bold text-amber-900 uppercase tracking-widest text-[10px]">Portion</TableHead>
                                            <TableHead className="font-bold text-amber-900 uppercase tracking-widest text-[10px]">RI% (100g)</TableHead>
                                            <TableHead className="font-bold text-amber-900 uppercase tracking-widest text-[10px]">RI% (Portion)</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {product.nutritionFacts.map((nf, i) => (
                                            <TableRow key={i} className="hover:bg-zinc-50 border-zinc-100">
                                                <TableCell className="font-bold text-secondary py-4">{nf.nutrient}</TableCell>
                                                <TableCell className="text-secondary/70">{nf.per100g}</TableCell>
                                                <TableCell className="text-secondary/70">{nf.portion}</TableCell>
                                                <TableCell className="text-primary font-bold">{nf.ri100g}</TableCell>
                                                <TableCell className="text-primary font-bold">{nf.riPortion}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            {/* Highlights Grid (Product Features) */}
            {Array.isArray(product.highlights) && product.highlights.length > 0 && (
                <div className="space-y-4">
                    <h3 className="font-bold text-secondary uppercase tracking-widest text-xs flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                        Product Features
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2">
                        {product.highlights.map((highlight, idx) => (
                            <motion.div 
                                key={idx} 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-center gap-3 p-3 rounded-xl bg-white border border-zinc-100 shadow-sm hover:shadow-md transition-all group"
                            >
                                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <CheckCircle2 className="h-4 w-4" />
                                </div>
                                <span className="text-sm font-bold text-secondary/80 leading-tight">
                                    {highlight}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            <div className="space-y-4">
              <h3 className="font-bold text-secondary uppercase tracking-widest text-xs flex items-center gap-2">
                <Info className="h-3.5 w-3.5 text-primary" />
                {t('description')}
              </h3>
              <p className="text-muted-foreground leading-relaxed italic text-base border-l-4 border-primary/20 pl-6 py-1">
                "{product.description}"
              </p>
            </div>


            {/* Perfect With Tags */}
            {Array.isArray(product.perfectWith) && product.perfectWith.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-zinc-100">
                    <h3 className="font-bold text-secondary uppercase tracking-widest text-xs flex items-center gap-2">
                        <Star className="h-3.5 w-3.5 text-primary" />
                        Perfect With
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {product.perfectWith.map((tag, i) => (
                            <Badge key={i} variant="outline" className="px-5 py-2 rounded-2xl border-primary/20 text-primary font-bold bg-primary/5 hover:bg-primary/10 transition-all hover:scale-105 active:scale-95 cursor-default">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/20 border border-primary/5">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-secondary">{t('freeShipping')}</h4>
                    <p className="text-xs text-muted-foreground">{t('freeShippingDesc')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/20 border border-primary/5">
                  <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-secondary">{t('pure')}</h4>
                    <p className="text-xs text-muted-foreground">{t('pureDesc')}</p>
                  </div>
                </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-24 border-t pt-24">
            <div className="flex items-center justify-between mb-12">
              <h2 className="font-serif text-4xl font-bold text-secondary">
                You might also enjoy
              </h2>
              <Link href="/products" className="text-primary font-bold hover:underline flex items-center gap-2">
                {t('viewCatalog')}
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p, idx) => (
                <ProductCard key={p.id} product={p as any} index={idx} />
              ))}
            </div>
          </section>
        )}
      </main>

    </div>
  );
}

