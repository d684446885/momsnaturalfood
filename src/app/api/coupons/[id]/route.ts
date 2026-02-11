import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const coupon = await db.coupon.findUnique({
      where: { id }
    });
    return NextResponse.json(coupon);
  } catch (error) {
    console.error("[COUPON_GET]", error);
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
      code, 
      type, 
      value, 
      minPurchase, 
      expiryDate, 
      usageLimit, 
      scope,
      productIds,
      categoryIds,
      dealIds,
      isActive 
    } = body;

    const coupon = await db.coupon.update({
      where: { id },
      data: {
        code,
        type,
        value: value ? parseFloat(value) : undefined,
        minPurchase: minPurchase !== undefined ? parseFloat(minPurchase) : undefined,
        expiryDate: expiryDate ? new Date(expiryDate) : undefined,
        usageLimit: usageLimit !== undefined ? parseInt(usageLimit) : undefined,
        scope,
        productIds,
        categoryIds,
        dealIds,
        isActive
      }
    });

    return NextResponse.json(coupon);
  } catch (error: any) {
    console.error("[COUPON_PATCH]", error);
    return new NextResponse(error.message || "Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const coupon = await db.coupon.delete({
      where: { id }
    });
    return NextResponse.json(coupon);
  } catch (error) {
    console.error("[COUPON_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
