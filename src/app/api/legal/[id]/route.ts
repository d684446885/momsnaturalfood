import { db } from "@/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const page = await db.legalPage.findUnique({
      where: {
        id
      }
    });

    if (!page) {
      // Fallback: try finding by slug
      const pageBySlug = await db.legalPage.findUnique({
        where: {
          slug: id
        }
      });
      if (!pageBySlug) return new NextResponse("Not Found", { status: 404 });
      return NextResponse.json(pageBySlug);
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error("[LEGAL_PAGE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { title, content } = body;

    const updateData: any = {};
    if (title) {
      updateData.title = title;
      updateData.slug = slugify(title, { lower: true, strict: true });
    }
    if (content !== undefined) {
      updateData.content = content;
    }

    const page = await db.legalPage.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(page);
  } catch (error) {
    console.error("[LEGAL_PAGE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    await db.legalPage.delete({
      where: { id }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[LEGAL_PAGE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
