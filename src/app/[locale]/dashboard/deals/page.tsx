import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { db } from "@/lib/db";
import { DealsClient } from "./deals-client";

async function getDeals(params: {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
}) {
  const { page, pageSize, search, status } = params;
  const skip = (page - 1) * pageSize;

  try {
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status === 'active') {
      where.isActive = true;
    } else if (status === 'inactive') {
      where.isActive = false;
    }

    const [deals, totalCount] = await Promise.all([
      db.deal.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      db.deal.count({ where })
    ]);

    return { deals, totalCount };
  } catch (error) {
    console.error("Error fetching deals:", error);
    return { deals: [], totalCount: 0 };
  }
}

interface PageProps {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    search?: string;
    status?: string;
  }>;
}

export default async function DealsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const pageSize = Number(params.pageSize) || 10;
  const search = params.search;
  const status = params.status;

  const { deals, totalCount } = await getDeals({ page, pageSize, search, status });

  // Convert to plain objects and handle Decimal/Date types for serialization
  const serializedDeals = deals.map((deal: any) => ({
    ...deal,
    discount: Number(deal.discount),
    endDate: deal.endDate ? deal.endDate.toISOString() : null,
    createdAt: deal.createdAt.toISOString(),
    updatedAt: deal.updatedAt.toISOString(),
  }));

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Suspense fallback={<div className="flex items-center justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
        <DealsClient 
          initialData={serializedDeals as any} 
          totalCount={totalCount}
          currentPage={page}
          pageSize={pageSize}
        />
      </Suspense>
    </div>
  );
}
