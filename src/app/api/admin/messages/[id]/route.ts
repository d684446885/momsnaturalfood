import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const message = await db.contactMessage.update({
      where: { id },
      data: { 
        isRead: body.isRead ?? true,
        adminReply: body.adminReply ?? undefined,
        repliedAt: body.adminReply ? new Date() : undefined,
      },
    });

    return NextResponse.json(message);
  } catch (error: any) {
    console.error("Error updating message:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update message" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.contactMessage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting message:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete message" },
      { status: 500 }
    );
  }
}
