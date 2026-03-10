import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  try {
    const { orderId, locale = "en" } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    // 1. Fetch order details
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 2. Fetch Stripe settings
    const gateway = await db.paymentGateway.findUnique({
      where: { provider: "stripe" },
    });

    if (!gateway || !gateway.enabled) {
      return NextResponse.json({ error: "Stripe is not enabled" }, { status: 400 });
    }

    const credentials = typeof gateway.credentials === "string" 
      ? JSON.parse(gateway.credentials) 
      : gateway.credentials;

    const secretKey = gateway.mode === "live" 
      ? credentials.liveSecretKey 
      : credentials.testSecretKey;

    if (!secretKey) {
      return NextResponse.json({ error: "Stripe API key is missing" }, { status: 400 });
    }

    const stripe = new Stripe(secretKey, {
      apiVersion: "2025-02-24.acacia" as any,
    });

    const origin = request.headers.get("origin") || "http://localhost:3000";

    // 3. Create line items
    const lineItems = order.items.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.product.name,
          images: item.product.images?.[0] ? [item.product.images[0]] : [],
        },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: item.quantity,
    }));

    // Add shipping fee if applicable
    if (Number(order.shippingFee) > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: "Shipping Fee",
          },
          unit_amount: Math.round(Number(order.shippingFee) * 100),
        },
        quantity: 1,
      });
    }

    // 4. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "ideal"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/${locale}/checkout?success=true&orderId=${order.id}`,
      cancel_url: `${origin}/${locale}/checkout?canceled=true`,
      customer_email: order.customerEmail || undefined,
      client_reference_id: order.id,
      metadata: {
        orderId: order.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
