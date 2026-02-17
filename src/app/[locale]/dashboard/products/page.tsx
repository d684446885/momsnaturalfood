import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { db } from "@/lib/db";
import { AdminProductsClient } from "./products-client";

async function getProducts(params: { 
  page: number; 
  pageSize: number; 
  search?: string; 
  categoryId?: string; 
}) {
  const { page, pageSize, search, categoryId } = params;
  const skip = (page - 1) * pageSize;

  try {
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categoryId && categoryId !== 'all') {
      where.categoryId = categoryId;
    }

    const [products, totalCount] = await Promise.all([
      db.product.findMany({
        where,
        include: {
          category: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: pageSize,
      }),
      db.product.count({ where })
    ]);

    return { products, totalCount };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [], totalCount: 0 };
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

interface PageProps {
  searchParams: Promise<{ 
    page?: string; 
    pageSize?: string; 
    search?: string; 
    category?: string; 
  }>;
}

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const pageSize = Number(params.pageSize) || 10;
  const search = params.search;
  const categoryId = params.category;

  const [{ products, totalCount }, categories] = await Promise.all([
    getProducts({ page, pageSize, search, categoryId }),
    getCategories(),
  ]);

  // Convert to plain objects and handle Decimal/Date types for serialization
  const serializedProducts = products.map((product: any) => ({
    ...product,
    price: Number(product.price),
    salePrice: product.salePrice ? Number(product.salePrice) : null,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    category: {
      ...product.category,
      createdAt: product.category.createdAt.toISOString(),
      updatedAt: product.category.updatedAt.toISOString(),
    },
  }));

  return (
    <Suspense fallback={<div className="flex items-center justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <AdminProductsClient 
        products={serializedProducts as any} 
        categories={categories as any} 
        totalCount={totalCount}
        currentPage={page}
        pageSize={pageSize}
      />
    </Suspense>
  );
}
