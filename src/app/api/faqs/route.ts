import { db } from "@/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");

    const faqs = await db.faq.findMany({
      where: {
        ...(categoryId ? { categoryId } : {})
      },
      include: {
        category: true
      },
      orderBy: {
        order: "asc"
      }
    });

    return NextResponse.json(faqs);
  } catch (error) {
    console.error("[FAQS_GET]", error);
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
    const { question, answer, categoryId, order } = body;

    if (!question || !answer || !categoryId) {
      return new NextResponse("Question, answer and category are required", { status: 400 });
    }

    const faq = await db.faq.create({
      data: {
        question,
        answer,
        categoryId,
        order: order || 0
      }
    });

    return NextResponse.json(faq);
  } catch (error) {
    console.error("[FAQS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
