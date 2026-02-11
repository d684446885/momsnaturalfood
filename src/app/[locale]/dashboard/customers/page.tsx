import { db } from "@/lib/db";
import { CustomersClient } from "./customers-client";

async function getCustomers() {
  try {
    const customers = await db.user.findMany({
      where: {
        role: "CUSTOMER",
      },
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
    });

    return customers.map(customer => ({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        image: customer.image,
        createdAt: customer.createdAt.toISOString(),
        orderCount: customer.orders.length,
        totalSpend: customer.orders.reduce((acc, order) => acc + Number(order.total), 0),
        lastOrderDate: customer.orders[0]?.createdAt.toISOString() || null,
    }));
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
}

export default async function CustomersPage() {
  const customers = await getCustomers();
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <CustomersClient initialData={customers} />
    </div>
  );
}
