import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "./product-detail-client";

async function getProduct(id: string) {
  try {
    const product = await db.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
    return product;
  } catch (error) {
    return null;
  }
}

async function getRelatedProducts(categoryId: string, currentProductId: string) {
  try {
    const products = await db.product.findMany({
      where: {
        categoryId,
        id: { not: currentProductId },
      },
      take: 4,
      include: {
        category: true,
      },
    });
    return products;
  } catch (error) {
    return [];
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.categoryId, product.id);

  // Convert to a plain object and handle Decimal/Date types
  const serializedProduct = {
    ...product,
    price: Number(product.price),
    salePrice: product.salePrice ? Number(product.salePrice) : null,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    category: {
        ...product.category,
        createdAt: product.category.createdAt.toISOString(),
        updatedAt: product.category.updatedAt.toISOString(),
    }
  };

  const serializedRelated = relatedProducts.map((p) => ({
    ...p,
    price: Number(p.price),
    salePrice: p.salePrice ? Number(p.salePrice) : null,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    category: {
        ...p.category,
        createdAt: p.category.createdAt.toISOString(),
        updatedAt: p.category.updatedAt.toISOString(),
    }
  }));

  return (
    <ProductDetailClient 
      product={serializedProduct as any} 
      relatedProducts={serializedRelated as any} 
    />
  );
}
