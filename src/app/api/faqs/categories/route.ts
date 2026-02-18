import { db } from "@/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function GET() {
  try {
    const categories = await db.faqCategory.findMany({
      include: {
        _count: {
          select: { faqs: true }
        }
      },
      orderBy: {
        order: "asc"
      }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("[FAQ_CATEGORIES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, order } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const slug = slugify(name, { lower: true });

    const category = await db.faqCategory.create({
      data: {
        name,
        slug,
        order: order || 0
      }
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[FAQ_CATEGORIES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
