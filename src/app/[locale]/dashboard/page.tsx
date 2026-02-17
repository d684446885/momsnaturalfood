import { db } from "@/lib/db";
import { DashboardClient } from "./dashboard-client";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

async function getDashboardData() {
  const [revenueArr, customerCount, saleCount, recentOrders] = await Promise.all([
    db.order.findMany({
      select: { total: true },
      where: { status: { not: "CANCELLED" } }
    }),
    db.user.count(),
    db.order.count(),
    db.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    })
  ]);

  const totalRevenue = revenueArr.reduce((acc, curr) => acc + Number(curr.total), 0);

  return {
    stats: {
      revenue: totalRevenue,
      customers: customerCount,
      sales: saleCount,
      activeNow: Math.floor(Math.random() * 50) + 10 
    },
    recentOrders: recentOrders.map(order => ({
      ...order,
      total: order.total.toString(),
      createdAt: order.createdAt.toISOString()
    }))
  };
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const data = await getDashboardData();
  return <DashboardClient stats={data.stats} recentOrders={data.recentOrders} />;
}
