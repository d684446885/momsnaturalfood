import { db } from "@/lib/db";
import { CustomersClient } from "./customers-client";

async function getCustomers(params: {
  page: number;
  pageSize: number;
  search?: string;
}) {
  const { page, pageSize, search } = params;
  const skip = (page - 1) * pageSize;

  try {
    const where: any = {
      role: "CUSTOMER",
    };
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [customers, totalCount, stats] = await Promise.all([
      db.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          createdAt: true,
          orders: {
              select: {
                  id: true,
                  total: true,
                  status: true,
                  createdAt: true,
              },
              orderBy: {
                  createdAt: "desc"
              }
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: pageSize,
      }),
      db.user.count({ where }),
      db.order.aggregate({
        _sum: {
          total: true
        },
        _count: {
          userId: true
        }
      })
    ]);

    // Active this month count
    const activeThisMonth = await db.order.groupBy({
      by: ['userId'],
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      },
      _count: {
        userId: true
      }
    });

    const formattedCustomers = customers.map((customer: any) => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      image: customer.image,
      createdAt: customer.createdAt.toISOString(),
      orderCount: customer.orders.length,
      totalSpend: customer.orders.reduce((acc: number, order: any) => acc + Number(order.total), 0),
      lastOrderDate: customer.orders[0]?.createdAt.toISOString() || null,
    }));

    return { 
      customers: formattedCustomers, 
      totalCount,
      stats: {
        totalSpend: Number(stats._sum.total || 0),
        activeThisMonth: activeThisMonth.length
      }
    };
  } catch (error) {
    console.error("Error fetching customers:", error);
    return { customers: [], totalCount: 0, stats: { totalSpend: 0, activeThisMonth: 0 } };
  }
}

interface PageProps {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    search?: string;
  }>;
}

export default async function CustomersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const pageSize = Number(params.pageSize) || 10;
  const search = params.search;

  const { customers, totalCount, stats } = await getCustomers({ page, pageSize, search });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <CustomersClient 
        initialData={customers} 
        totalCount={totalCount}
        currentPage={page}
        pageSize={pageSize}
        stats={stats}
      />
    </div>
  );
}
