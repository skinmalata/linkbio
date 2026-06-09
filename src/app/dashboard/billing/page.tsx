"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Check, Crown, ArrowRight } from "lucide-react";

export default function BillingPage() {
  const { data: session, update: updateSession } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleUpgrade = async (tier: string) => {
    setCheckoutLoading(true);
    const priceId = tier === "pro" ? "price_pro" : "price_enterprise";

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        priceId,
        returnUrl: window.location.origin,
      }),
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
    setCheckoutLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>
    );
  }

  const isPro = profile?.isPro;
  const tier = isPro ? "Pro" : "Free";

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your subscription</p>
      </div>

      <div className="bg-white p-6 rounded-xl border mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Crown className={`w-5 h-5 ${isPro ? "text-yellow-500" : "text-gray-300"}`} />
              <h2 className="font-semibold text-gray-900">Current plan: {tier}</h2>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {isPro
                ? "You have access to all Pro features including custom domains and advanced analytics."
                : "Upgrade to unlock custom domains, advanced analytics, unlimited links, and more."}
            </p>
          </div>
          {!isPro && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
              Active
            </span>
          )}
        </div>
      </div>

      {!isPro && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-xl border-2 border-purple-500 relative">
            <div className="absolute -top-3 right-4 px-3 py-0.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold rounded-full">
              Recommended
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Pro</h3>
            <p className="text-3xl font-bold text-gray-900 mb-4">$9<span className="text-sm font-normal text-gray-500">/month</span></p>
            <ul className="space-y-2 mb-6 text-sm text-gray-600">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Unlimited links</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Custom domain</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Advanced analytics</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Shop with 10 products</li>
            </ul>
            <button
              onClick={() => handleUpgrade("pro")}
              disabled={checkoutLoading}
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {checkoutLoading ? "Redirecting..." : "Upgrade to Pro"}
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl border">
            <h3 className="font-semibold text-gray-900 mb-1">Enterprise</h3>
            <p className="text-3xl font-bold text-gray-900 mb-4">$49<span className="text-sm font-normal text-gray-500">/month</span></p>
            <ul className="space-y-2 mb-6 text-sm text-gray-600">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Everything in Pro</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Team members (up to 5)</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Custom branding removal</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Dedicated support</li>
            </ul>
            <button
              onClick={() => handleUpgrade("enterprise")}
              disabled={checkoutLoading}
              className="w-full py-2.5 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-all disabled:opacity-50"
            >
              {checkoutLoading ? "Redirecting..." : "Contact sales"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
