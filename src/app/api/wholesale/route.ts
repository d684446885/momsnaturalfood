import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const wholesaleSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  contact: z.string().min(5, "Contact is required"),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().min(5, "Address is required"),
  description: z.string().optional(),
  products: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().min(1),
    })
  ).min(1, "At least one product is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = wholesaleSchema.parse(body);

    const inquiry = await db.wholesaleInquiry.create({
      data: {
        fullName: validated.fullName,
        contact: validated.contact,
        email: validated.email || null,
        address: validated.address,
        description: validated.description || null,
        products: {
          create: validated.products.map((p) => ({
            productId: p.productId,
            quantity: p.quantity,
          })),
        },
      },
      include: {
        products: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors },
        { status: 400 }
      );
    }

    console.error("Wholesale inquiry error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit inquiry. Please try again." },
      { status: 500 }
    );
  }
}
