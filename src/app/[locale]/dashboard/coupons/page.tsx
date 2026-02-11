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

  return (
    <CouponsClient 
      initialData={coupons} 
      categories={categories}
      products={products}
      deals={deals}
    />
  );
}
