import { db } from "@/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { question, answer, categoryId, order } = body;

    const faq = await db.faq.update({
      where: { id },
      data: {
        question,
        answer,
        categoryId,
        order
      }
    });

    return NextResponse.json(faq);
  } catch (error) {
    console.error("[FAQ_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = params;

    const faq = await db.faq.delete({
      where: { id }
    });

    return NextResponse.json(faq);
  } catch (error) {
    console.error("[FAQ_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
