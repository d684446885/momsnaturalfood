import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const filter = searchParams.get("filter") || "all"; // all, unread, read

    const where: any = {};
    if (filter === "unread") where.isRead = false;
    if (filter === "read") where.isRead = true;

    const [messages, total, unreadCount] = await Promise.all([
      db.contactMessage.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.contactMessage.count({ where }),
      db.contactMessage.count({ where: { isRead: false } }),
    ]);

    return NextResponse.json({
      messages,
      total,
      unreadCount,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
