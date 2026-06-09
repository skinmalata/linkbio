"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Check, Crown, Zap } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    icon: Zap,
    features: [
      "Up to 3 links",
      "1 theme",
      "Basic analytics",
      "Free subdomain",
    ],
    cta: "Get started",
    highlight: false,
    tier: "free",
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    icon: Crown,
    features: [
      "Unlimited links",
      "All 6 themes",
      "Advanced analytics with charts",
      "Custom domain support",
      "Up to 10 products in Shop",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    highlight: true,
    tier: "pro",
    priceId: "price_pro",
  },
  {
    name: "Enterprise",
    price: "$49",
    period: "/month",
    icon: Crown,
    features: [
      "Everything in Pro",
      "Team members (up to 5)",
      "Custom branding removal",
      "Custom CSS",
      "Scheduled links",
      "API access",
      "Dedicated support",
    ],
    cta: "Contact sales",
    highlight: false,
    tier: "enterprise",
    priceId: "price_enterprise",
  },
];

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleClick = async (tier: string) => {
    if (tier === "free") {
      router.push(session ? "/dashboard" : "/");
      return;
    }

    if (!session) {
      router.push("/");
      return;
    }

    router.push("/dashboard/billing");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Start free, upgrade when you grow. No hidden fees, no surprises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.name}
                className={`relative bg-white rounded-2xl border-2 p-8 flex flex-col transition-all hover:shadow-xl ${
                  plan.highlight
                    ? "border-purple-500 shadow-lg scale-[1.02]"
                    : "border-gray-200"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold rounded-full">
                    Most popular
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-5 h-5 ${plan.highlight ? "text-purple-600" : "text-gray-400"}`} />
                    <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-sm text-gray-500">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleClick(plan.tier)}
                  className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
                    plan.highlight
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:scale-[1.02]"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
