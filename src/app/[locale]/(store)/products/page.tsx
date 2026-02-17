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
    createdAt: new Date(product.createdAt).toISOString(),
    updatedAt: new Date(product.updatedAt).toISOString(),
    category: {
      ...product.category,
      createdAt: new Date(product.category.createdAt).toISOString(),
      updatedAt: new Date(product.category.updatedAt).toISOString(),
    },
  }));

  const serializedCategories = categories.map((category: any) => ({
    ...category,
    createdAt: new Date(category.createdAt).toISOString(),
    updatedAt: new Date(category.updatedAt).toISOString(),
  }));

  return (
    <ProductsClient 
      initialProducts={serializedProducts as any} 
      categories={serializedCategories as any} 
    />
  );
}
