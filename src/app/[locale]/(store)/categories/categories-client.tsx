"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: {
    products: number;
  };
  products: {
    id: string;
    name: string;
    price: number | string | { toString: () => string };
    images: string[];
  }[];
}

interface CategoriesClientProps {
  categories: Category[];
}

const categoryIcons: Record<string, string> = {
  electronics: "⚡",
  clothing: "👔",
  accessories: "👜",
  "home-decor": "🏠",
};

const categoryColors: Record<string, string> = {
  electronics: "from-blue-500/20 to-cyan-500/20",
  clothing: "from-pink-500/20 to-rose-500/20",
  accessories: "from-amber-500/20 to-yellow-500/20",
  "home-decor": "from-green-500/20 to-emerald-500/20",
};

export function CategoriesClient({ categories }: CategoriesClientProps) {
  const t = useTranslations("Categories");

  return (
    <div className="min-h-screen bg-background">
      <main className="container px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            {t('title')}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('exploreRange')}
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden">
                <div
                  className={`bg-gradient-to-r ${
                    categoryColors[category.slug] || "from-primary/20 to-primary/10"
                  }`}
                >
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-4">
                      <motion.span
                        className="text-5xl"
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        transition={{ type: "spring" }}
                      >
                        {categoryIcons[category.slug] || "📦"}
                      </motion.span>
                      <div>
                        <CardTitle className="text-2xl">{category.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <Package className="h-4 w-4" />
                          {category._count.products} {t('products')}
                        </CardDescription>
                      </div>
                    </div>
                    <Link href={`/products?category=${category.id}`}>
                      <Button variant="outline" className="gap-2">
                        {t('viewAll')}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardHeader>
                </div>
                <CardContent className="p-6">
                  {category.products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {category.products.map((product, productIndex) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: productIndex * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                          className="p-4 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
                        >
                          <Link href={`/products/${product.id}`}>
                            <div className="aspect-square rounded-md bg-muted mb-3 flex items-center justify-center overflow-hidden relative">
                              {product.images?.[0] ? (
                                <Image 
                                  src={product.images[0]} 
                                  alt={product.name} 
                                  fill 
                                  className="object-cover" 
                                />
                              ) : (
                                <span className="text-3xl opacity-30">
                                  {product.name.charAt(0)}
                                </span>
                              )}
                            </div>
                            <h4 className="font-medium text-sm line-clamp-1">
                              {product.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              €{typeof product.price === 'object' 
                                ? parseFloat(product.price.toString()).toFixed(2) 
                                : typeof product.price === 'string' 
                                  ? parseFloat(product.price).toFixed(2) 
                                  : product.price.toFixed(2)}
                            </p>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>{t('noProducts')}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {categories.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              📂
            </motion.div>
            <h3 className="text-xl font-semibold mb-2">{t('noCategories')}</h3>
            <p className="text-muted-foreground">
              {t('noCategoriesDesc')}
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}

