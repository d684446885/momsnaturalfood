import { db } from "@/lib/db";
import { ProductsClient } from "./products-client";
import { unstable_cache } from "next/cache";

const getCachedProducts = unstable_cache(
  async () => {
    try {
      const products = await db.product.findMany({
        include: {
          category: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return products;
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  },
  ["products-list"],
  { revalidate: 3600, tags: ["products-list"] }
);

const getCachedCategories = unstable_cache(
  async () => {
    try {
      const categories = await db.category.findMany({
        orderBy: {
          name: "asc",
        },
      });
      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  },
  ["categories-list"],
  { revalidate: 3600, tags: ["categories-list"] }
);

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getCachedProducts(),
    getCachedCategories(),
  ]);

  // Convert to plain objects and handle Decimal/Date types for serialization
  const serializedProducts = products.map((product: any) => ({
    ...product,
    price: Number(product.price),
    salePrice: product.salePrice ? Number(product.salePrice) : null,
    createdAt: (product.createdAt as Date).toISOString(),
    updatedAt: (product.updatedAt as Date).toISOString(),
    category: {
      ...product.category,
      createdAt: (product.category.createdAt as Date).toISOString(),
      updatedAt: (product.category.updatedAt as Date).toISOString(),
    },
  }));

  const serializedCategories = categories.map((category: any) => ({
    ...category,
    createdAt: (category.createdAt as Date).toISOString(),
    updatedAt: (category.updatedAt as Date).toISOString(),
  }));

  return (
    <ProductsClient 
      initialProducts={serializedProducts as any} 
      categories={serializedCategories as any} 
    />
  );
}
