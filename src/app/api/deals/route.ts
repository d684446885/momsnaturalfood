import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const deals = await db.deal.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(deals);
  } catch (error) {
    console.error("[DEALS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      title, 
      description, 
      discount, 
      regularPrice,
      salePrice,
      productIds,
      images, 
      endDate, 
      isActive 
    } = body;

    if (!title || !description) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const deal = await db.deal.create({
      data: {
        title,
        description,
        discount: discount ? parseInt(discount) : null,
        regularPrice: regularPrice ? parseFloat(regularPrice) : null,
        salePrice: salePrice ? parseFloat(salePrice) : null,
        productIds: productIds || [],
        images: images || [],
        endDate: endDate ? new Date(endDate) : null,
        isActive: isActive !== undefined ? isActive : true
      }
    });

    return NextResponse.json(deal);
  } catch (error) {
    console.error("[DEALS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
