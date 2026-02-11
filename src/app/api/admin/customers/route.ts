import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
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
            }
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate total spend and order count for each customer
    const customersWithStats = customers.map((allSpecialCustomers: any) => {
        const totalSpend = allSpecialCustomers.orders.reduce((acc: number, order: any) => acc + Number(order.total), 0);
        return {
            ...allSpecialCustomers,
            orderCount: allSpecialCustomers.orders.length,
            totalSpend,
            lastOrderDate: customer.orders[0]?.createdAt || null,
        };
    });

    return NextResponse.json(customersWithStats);
  } catch (error) {
    console.error("[CUSTOMERS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
