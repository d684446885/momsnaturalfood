import { db } from "@/lib/db";
import { NextResponse } from "next/server";
// Trigger re-typecheck after prisma generate
import { auth } from "@/auth";

export async function GET(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {

    const orders = await db.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  try {
    const body = await request.json();
    const { items, shippingInfo, paymentMethod } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in order" }, { status: 400 });
    }

    // Calculate subtotal and prepare order items with verified prices
    let subtotal = 0;
    const verifiedOrderItems: { productId: string; quantity: number; price: number }[] = [];

    for (const item of items) {
      const product = await db.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 400 }
        );
      }

      const price = Number(product.price);
      subtotal += price * item.quantity;
      
      verifiedOrderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: price, // Use the price from the database, not the client
      });
    }

    // Fetch shipping settings for verification
    const settings = await db.settings.findUnique({
      where: { id: "global" }
    });

    const freeShippingThreshold = settings?.freeShippingThreshold ? Number(settings.freeShippingThreshold) : 0;
    const shippingFee = settings?.shippingFee ? Number(settings.shippingFee) : 0;

    const serverShippingFee = (freeShippingThreshold > 0 && subtotal >= freeShippingThreshold) 
      ? 0 
      : shippingFee;

    const total = subtotal + serverShippingFee;

    const order = await db.order.create({
      data: {
        userId: userId || undefined,
        customerName: shippingInfo?.fullName || undefined,
        customerEmail: shippingInfo?.email || undefined,
        customerPhone: shippingInfo?.contactNumber || undefined,
        address: shippingInfo?.address || undefined,
        city: shippingInfo?.city || undefined,
        postalCode: shippingInfo?.postalCode || undefined,
        shippingFee: serverShippingFee,
        total,
        paymentMethod: (paymentMethod as string) || "CARD",
        items: {
          create: verifiedOrderItems,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Clear the user's cart after placing order (only for logged in users)
    if (userId) {
      const cart = await db.cart.findUnique({
        where: { userId },
      });

      if (cart) {
        await db.cartItem.deleteMany({
          where: { cartId: cart.id },
        });
      }
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
