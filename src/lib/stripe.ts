let stripeInstance: any = null;

export function getStripe() {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) return null;
    const Stripe = require("stripe").default || require("stripe");
    stripeInstance = new Stripe(key, { apiVersion: "2025-02-24.acacia" });
  }
  return stripeInstance;
}

export const PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID || "price_pro";
export const ENTERPRISE_PRICE_ID = process.env.STRIPE_ENTERPRISE_PRICE_ID || "price_enterprise";
