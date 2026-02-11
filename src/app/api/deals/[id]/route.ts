import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deal = await db.deal.findUnique({
      where: { id }
    });
    return NextResponse.json(deal);
  } catch (error) {
    console.error("[DEAL_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { 
      // ... (rest of the destructuring remains the same)
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

    const deal = await db.deal.update({
      where: { id },
      data: {
        title,
        description,
        discount: discount ? parseInt(discount) : undefined,
        regularPrice: regularPrice ? parseFloat(regularPrice) : undefined,
        salePrice: salePrice ? parseFloat(salePrice) : undefined,
        productIds: productIds || undefined,
        images: images || undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        isActive
      }
    });

    return NextResponse.json(deal);
  } catch (error) {
    console.error("[DEAL_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deal = await db.deal.delete({
      where: { id }
    });
    return NextResponse.json(deal);
  } catch (error) {
    console.error("[DEAL_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
