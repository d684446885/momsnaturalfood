import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

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
            lastOrderDate: allSpecialCustomers.orders[0]?.createdAt || null,
        };
    });

    return NextResponse.json(customersWithStats);
  } catch (error) {
    console.error("[CUSTOMERS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
