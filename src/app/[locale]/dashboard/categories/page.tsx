import { db } from "@/lib/db";
import { AdminCategoriesClient } from "./categories-client";

async function getCategories() {
  try {
    const categories = await db.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
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
export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  // Convert to plain objects and handle Date types for serialization
  const serializedCategories = categories.map((category) => ({
    ...category,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  }));

  return <AdminCategoriesClient categories={serializedCategories as any} />;
}
