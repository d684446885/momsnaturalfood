import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  try {
    const certifications = await db.certification.findMany({
      orderBy: {
        order: "asc",
      },
    });
    return NextResponse.json(certifications);
  } catch (error) {
    console.error("Error fetching certifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch certifications" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { title, imageUrl, order } = body;

    if (!title || !imageUrl) {
      return NextResponse.json({ error: "Title and Image are required" }, { status: 400 });
    }

    const certification = await db.certification.create({
      data: { 
        title, 
        imageUrl, 
        order: order || 0 
      },
    });
    return NextResponse.json(certification, { status: 201 });
  } catch (error: any) {
    console.error("Error creating certification:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create certification" },
      { status: 500 }
    );
  }
}
