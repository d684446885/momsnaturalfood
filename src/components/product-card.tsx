"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/store/use-cart";
import { useWishlist } from "@/store/use-wishlist";
import { ShoppingCart, Heart } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  description: string;
  price: any;
  salePrice?: any;
  stock: number;
  images: string[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const cart = useCart();
  const wishlist = useWishlist();
  const t = useTranslations("Common");
  
  const displayPrice = product.salePrice || product.price;
  const hasSale = !!product.salePrice;
  const inWishlist = wishlist.isInWishlist(product.id);

  const handleAddToCart = () => {
    const productForCart = {
      ...product,
      price: hasSale ? parseFloat(product.salePrice.toString()) : parseFloat(product.price.toString())
    };
    cart.addItem(productForCart as any);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    wishlist.toggleItem(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <Card className="group overflow-hidden h-full flex flex-col border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white">
        <Link href={`/products/${product.id}`} className="flex-1 flex flex-col">
          <div className="aspect-square relative bg-zinc-50 flex items-center justify-center overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            />
            {product.images?.[0] ? (
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            ) : (
              <span className="opacity-20 font-bold text-6xl">
                {product.name.charAt(0)}
              </span>
            )}
            
            <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
              {hasSale && (
                 <Badge className="bg-rose-500 text-white border-none shadow-lg font-bold">SALE</Badge>
              )}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full bg-white/90 shadow-md hover:bg-white transition-colors"
                onClick={handleToggleWishlist}
              >
                <Heart className={cn("h-4 w-4 transition-colors", inWishlist ? "text-red-500 fill-red-500" : "text-gray-600 hover:text-red-500")} />
              </motion.button>
            </div>
            <Badge 
              variant="secondary" 
              className="absolute top-3 left-3 z-20 bg-[#f2e8da] border-none shadow-sm text-amber-900 font-bold backdrop-blur-sm"
            >
              {product.category.name}
            </Badge>
          </div>
          <CardHeader className="p-4 flex-1">
            <CardTitle className="font-serif text-lg line-clamp-1 text-secondary group-hover:text-primary transition-colors">
              {product.name}
            </CardTitle>
            <CardDescription className="line-clamp-2 italic text-muted-foreground/80">
              {product.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <p className="font-bold text-xl text-primary font-serif leading-none">
                  €{parseFloat(displayPrice.toString()).toFixed(2)}
                </p>
                {hasSale && (
                   <span className="text-[10px] line-through text-muted-foreground font-medium decoration-rose-500/30">
                      €{parseFloat(product.price.toString()).toFixed(2)}
                   </span>
                )}
              </div>
              {product.stock > 0 ? (
                <Badge variant="outline" className="text-secondary border-secondary bg-secondary/5 font-semibold text-[10px] py-0">
                  {t('freshlyBoxed')}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-destructive border-destructive font-semibold text-[10px] py-0">
                  {t('soldOut')}
                </Badge>
              )}
            </div>
          </CardContent>
        </Link>
        <CardFooter className="p-4 pt-0 mt-auto">
          <motion.div className="w-full" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              className="w-full gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30" 
              disabled={product.stock === 0}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
              {t('addToBasket')}
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

