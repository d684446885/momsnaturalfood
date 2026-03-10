import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") as string;

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  try {
    // 1. Fetch Stripe Webhook Secret
    const gateway = await db.paymentGateway.findUnique({
      where: { provider: "stripe" },
      select: { credentials: true, mode: true },
    });

    if (!gateway) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 400 });
    }

    const credentials = typeof gateway.credentials === "string" 
      ? JSON.parse(gateway.credentials) 
      : (gateway.credentials as any);

    const webhookSecret = credentials.webhookSecret;
    const secretKey = gateway.mode === "live" 
      ? credentials.liveSecretKey 
      : credentials.testSecretKey;

    if (!webhookSecret || !secretKey) {
      return NextResponse.json({ error: "Webhook secret or API key missing" }, { status: 400 });
    }

    const stripe = new Stripe(secretKey, {
      apiVersion: "2025-02-24.acacia" as any,
    });

    // 2. Verify signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed.`, err.message);
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // 3. Handle event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId || session.client_reference_id;

      if (orderId) {
        console.log(`Payment confirmed for order: ${orderId}`);
        
        // Update order status in DB
        await db.order.update({
          where: { id: orderId },
          data: {
            status: "PROCESSING", // Or a dedicated "PAID" status if you have one
          },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Stripe Webhook Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Config for larger bodies if needed
export const dynamic = 'force-dynamic';
