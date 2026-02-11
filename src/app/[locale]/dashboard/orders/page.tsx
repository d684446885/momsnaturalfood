import { db } from "@/lib/db";
import { AdminOrdersClient } from "./orders-client";

async function getOrders() {
  try {
    const orders = await db.order.findMany({
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
    });
    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}
export default async function AdminOrdersPage() {
  const orders = await getOrders();

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

  return <AdminOrdersClient orders={serializedOrders as any} />;
}
