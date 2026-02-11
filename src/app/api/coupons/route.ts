import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const coupons = await db.coupon.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(coupons);
  } catch (error) {
    console.error("[COUPONS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
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

    if (!code || !type || value === undefined) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const coupon = await db.coupon.create({
      data: {
        code,
        type,
        value: parseFloat(value),
        minPurchase: minPurchase ? parseFloat(minPurchase) : 0,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        scope: scope || "GLOBAL",
        productIds: productIds || [],
        categoryIds: categoryIds || [],
        dealIds: dealIds || [],
        isActive: isActive !== undefined ? isActive : true
      }
    });

    return NextResponse.json(coupon);
  } catch (error: any) {
    console.error("[COUPONS_POST]", error);
    return new NextResponse(error.message || "Internal error", { status: 500 });
  }
}
