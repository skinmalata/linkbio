import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { updateItem, getItem } from "@/lib/dynamodb";

export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig || "",
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const subscription = event.data.object as any;

  switch (event.type) {
    case "checkout.session.completed": {
      const userId = subscription.metadata?.userId;
      if (userId) {
        await updateItem(`USER#${userId}`, "PROFILE", {
          isPro: true,
          subscriptionId: subscription.subscription,
          subscriptionTier: "pro",
        });
      }
      break;
    }
    case "customer.subscription.deleted": {
      const subsId = subscription.id;
      const profile = await getItem(`SUBSCRIPTION#${subsId}`, "PROFILE");
      if (profile?.userId) {
        const userId = (profile as any).userId;
        await updateItem(`USER#${userId}`, "PROFILE", {
          isPro: false,
          subscriptionId: "",
          subscriptionTier: "free",
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
