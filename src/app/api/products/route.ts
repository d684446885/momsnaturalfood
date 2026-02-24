import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { formatMediaUrl } from "@/lib/media";

export async function GET() {
  try {
    const [products, settings] = await Promise.all([
      db.product.findMany({
        include: {
          category: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      db.settings.findUnique({ where: { id: "global" } })
    ]);

    const formattedProducts = products.map((product) => ({
      ...product,
      images: product.images.map((img: string) => formatMediaUrl(img, settings?.r2PublicUrl, settings?.r2BucketName as string, settings?.r2AccountId as string))
    }));

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { 
      name, 
      description, 
      price, 
      salePrice,
      weight,
      stock, 
      images, 
      categoryId,
      highlights,
      ingredients,
      nutritionFacts,
      perfectWith,
      orderCount
    } = body;

    if (!name || !categoryId || price === undefined) {
      return NextResponse.json({ error: "Name, Category, and Price are required" }, { status: 400 });
    }

    const product = await db.product.create({
      data: {
        name,
        description: description || "",
        price: parseFloat(price) || 0,
        salePrice: salePrice ? parseFloat(salePrice) : null,
        weight: weight || "",
        stock: parseInt(stock) || 0,
        images: images || [],
        categoryId,
        highlights: highlights || [],
        ingredients: ingredients || [],
        nutritionFacts: nutritionFacts || null,
        perfectWith: perfectWith || [],
        orderCount: parseInt(orderCount) || 0,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
