import { db } from "@/lib/db";
import { AdminOrdersClient } from "./orders-client";

async function getOrders(params: {
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
        { id: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    const [orders, totalCount, statusCounts] = await Promise.all([
      db.order.findMany({
        where,
        include: {
          user: {
            select: {
              name: true,
              email: true,
            }
          },
          items: {
            include: {
              product: true
            }
          }
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: pageSize,
      }),
      db.order.count({ where }),
      db.order.groupBy({
        by: ['status'],
        _count: {
          id: true
        }
      })
    ]);

    const formattedStatusCounts = statusCounts.reduce((acc: any, curr) => {
      acc[curr.status] = curr._count.id;
      return acc;
    }, {});

    return { orders, totalCount, statusCounts: formattedStatusCounts };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return { orders: [], totalCount: 0, statusCounts: {} };
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

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const pageSize = Number(params.pageSize) || 10;
  const search = params.search;
  const status = params.status;

  const { orders, totalCount, statusCounts } = await getOrders({ page, pageSize, search, status });

  // Convert to plain objects and handle Decimal/Date types for serialization
  const serializedOrders = orders.map((order: any) => ({
    ...order,
    total: Number(order.total),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    items: order.items.map((item: any) => ({
      ...item,
      price: Number(item.price),
      product: item.product ? {
        ...item.product,
        price: Number(item.product.price),
        salePrice: item.product.salePrice ? Number(item.product.salePrice) : null,
        createdAt: item.product.createdAt.toISOString(),
        updatedAt: item.product.updatedAt.toISOString(),
      } : null,
    })),
  }));

  return (
    <AdminOrdersClient 
      orders={serializedOrders as any} 
      totalCount={totalCount}
      currentPage={page}
      pageSize={pageSize}
      statusCounts={statusCounts}
    />
  );
}
