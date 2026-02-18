import { db } from "@/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function GET() {
  try {
    const pages = await db.legalPage.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(pages);
  } catch (error) {
    console.error("[LEGAL_PAGES_GET]", error);
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
    const { title, content } = body;

    if (!title || !content) {
      return new NextResponse("Title and content are required", { status: 400 });
    }

    const slug = slugify(title, { lower: true, strict: true });

    const page = await db.legalPage.create({
      data: {
        title,
        slug,
        content
      }
    });

    return NextResponse.json(page);
  } catch (error) {
    console.error("[LEGAL_PAGES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
