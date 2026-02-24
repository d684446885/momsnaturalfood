import { db } from "@/lib/db";
import { ProductsClient } from "./products-client";
import { unstable_cache } from "next/cache";

export const dynamic = "force-dynamic";

async function getProducts() {
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
}

async function getCategories() {
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
}

import { formatMediaUrl } from "@/lib/media";

export default async function ProductsPage() {
  const [products, categories, settings] = await Promise.all([
    getProducts(),
    getCategories(),
    db.settings.findUnique({ where: { id: "global" } })
  ]);

  // Convert to plain objects and handle Decimal/Date types for serialization
  const serializedProducts = products.map((product: any) => ({
    ...product,
    price: Number(product.price),
    salePrice: product.salePrice ? Number(product.salePrice) : null,
    images: product.images.map((img: string) => formatMediaUrl(img, settings?.r2PublicUrl, settings?.r2BucketName as string, settings?.r2AccountId as string)),
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
