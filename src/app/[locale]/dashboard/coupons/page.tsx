import { db } from "@/lib/db";
import { CouponsClient } from "./coupons-client";

export const dynamic = "force-dynamic";

export default async function CouponsPage() {
  const coupons = await db.coupon.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  // Fetch categories, products, and deals for scoping
  const [categories, products, deals] = await Promise.all([
    db.category.findMany({ select: { id: true, name: true } }),
    db.product.findMany({ select: { id: true, name: true, price: true } }),
    db.deal.findMany({ select: { id: true, title: true } }),
  ]);

  // Serialize coupons for client component
  const serializedCoupons = coupons.map((coupon: any) => ({
    ...coupon,
    value: Number(coupon.value),
    minPurchase: coupon.minPurchase ? Number(coupon.minPurchase) : 0,
    createdAt: coupon.createdAt.toISOString(),
    updatedAt: coupon.updatedAt.toISOString(),
    expiryDate: coupon.expiryDate ? coupon.expiryDate.toISOString() : null,
  }));

  // Serialize products (price is Decimal)
  const serializedProducts = products.map((product: any) => ({
    ...product,
    price: Number(product.price),
  }));

  return (
    <CouponsClient 
      initialData={serializedCoupons as any} 
      categories={categories as any}
      products={serializedProducts as any}
      deals={deals as any}
    />
  );
}
