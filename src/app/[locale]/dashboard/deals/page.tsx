import { db } from "@/lib/db";
import { DealsClient } from "./deals-client";

async function getDeals() {
  try {
    const deals = await db.deal.findMany({
      orderBy: { createdAt: "desc" }
    });
    return deals;
  } catch (error) {
    return [];
  }
}
export default async function DealsPage() {
  const deals = await getDeals();

  // Convert to plain objects and handle Decimal/Date types for serialization
  const serializedDeals = deals.map((deal) => ({
    ...deal,
    discount: Number(deal.discount),
    endDate: deal.endDate ? deal.endDate.toISOString() : null,
    createdAt: deal.createdAt.toISOString(),
    updatedAt: deal.updatedAt.toISOString(),
  }));

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <DealsClient initialData={serializedDeals as any} />
    </div>
  );
}
