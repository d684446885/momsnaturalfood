import { db } from "@/lib/db";
import { CategoriesClient } from "./categories-client";
import { unstable_cache } from "next/cache";

const getCategories = unstable_cache(
  async () => {
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
  },
  ["categories-list"],
  { revalidate: 3600, tags: ["categories-list"] }
);

export default async function CategoriesPage() {
  const categories = await getCategories();
  return <CategoriesClient categories={categories as any} />;
}
