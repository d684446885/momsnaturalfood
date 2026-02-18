import { db } from "@/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import slugify from "slugify";

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
    const { name, order } = body;

    if (!name && order === undefined) {
      return new NextResponse("Nothing to update", { status: 400 });
    }

    const updateData: any = {};
    if (name) {
      updateData.name = name;
      updateData.slug = slugify(name, { lower: true });
    }
    if (order !== undefined) {
      updateData.order = order;
    }

    const category = await db.faqCategory.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[FAQ_CATEGORY_PATCH]", error);
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

    const category = await db.faqCategory.delete({
      where: { id }
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[FAQ_CATEGORY_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
