import { db } from "@/lib/db";
import { CategoriesClient } from "./categories-client";
import { formatMediaUrl } from "@/lib/media";

export const dynamic = "force-dynamic";

async function getCategories() {
  try {
    const categories = await db.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
        products: {
          take: 4,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
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

export default async function CategoriesPage() {
  const [categories, settings] = await Promise.all([
    getCategories(),
    db.settings.findUnique({ where: { id: "global" } })
  ]);

  const formattedCategories = categories.map((cat: any) => ({
    ...cat,
    products: cat.products.map((prod: any) => ({
        ...prod,
        images: prod.images.map((img: string) => formatMediaUrl(img, settings?.r2PublicUrl, settings?.r2BucketName as string, settings?.r2AccountId as string))
    }))
  }));

  return <CategoriesClient categories={formattedCategories as any} />;
}
