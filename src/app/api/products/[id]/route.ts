import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { formatMediaUrl } from "@/lib/media";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [product, settings] = await Promise.all([
      db.product.findUnique({
        where: { id },
        include: {
          category: true,
        },
      }),
      db.settings.findUnique({ where: { id: "global" } })
    ]);

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const formattedProduct = {
      ...product,
      images: product.images.map((img: string) => formatMediaUrl(img, settings?.r2PublicUrl, settings?.r2BucketName as string, settings?.r2AccountId as string))
    };

    return NextResponse.json(formattedProduct);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await params;
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

    const product = await db.product.update({
      where: { id },
      data: {
        name,
        description,
        price: parseFloat(price) || 0,
        salePrice: salePrice ? parseFloat(salePrice) : null,
        weight,
        stock: parseInt(stock) || 0,
        images,
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

    return NextResponse.json(product);
  } catch (error: any) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await params;
    await db.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
