import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getStripe, PRO_PRICE_ID, ENTERPRISE_PRICE_ID } from "@/lib/stripe";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { priceId, returnUrl } = await req.json();

  if (!priceId || (priceId !== PRO_PRICE_ID && priceId !== ENTERPRISE_PRICE_ID)) {
    return NextResponse.json({ error: "Invalid price ID" }, { status: 400 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({
      url: `/dashboard/billing?success=mock&tier=${priceId === PRO_PRICE_ID ? "pro" : "enterprise"}`,
    });
  }

  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: session.user.email || undefined,
    metadata: { userId: session.user.id },
    success_url: `${returnUrl || process.env.NEXTAUTH_URL}/dashboard/billing?success=true`,
    cancel_url: `${returnUrl || process.env.NEXTAUTH_URL}/dashboard/billing?canceled=true`,
  });

  return NextResponse.json({ url: checkout.url });
}
