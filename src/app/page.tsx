"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Link2, BarChart3, Palette, ShoppingBag, Globe, CreditCard, Check } from "lucide-react";

const features = [
  { icon: Link2, title: "Unlimited links", desc: "Add as many links as you need, drag to reorder" },
  { icon: Palette, title: "6 custom themes", desc: "Match your brand with Minimal, Dark, Sunset and more" },
  { icon: BarChart3, title: "Click analytics", desc: "Track clicks, trends, and traffic sources" },
  { icon: ShoppingBag, title: "Shop", desc: "Showcase products with images and prices" },
  { icon: Globe, title: "Custom domain", desc: "Use your own domain for your LinkBio page" },
  { icon: CreditCard, title: "Monetize", desc: "Stripe billing for premium subscriptions" },
];

const stats = [
  { label: "Links created", value: "10K+" },
  { label: "Active users", value: "1K+" },
  { label: "Clicks tracked", value: "100K+" },
  { label: "Uptime", value: "99.9%" },
];

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) router.push("/dashboard");
  }, [session, router]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <main className="flex-1">
        <section className="px-6 pt-20 pb-16 sm:pt-28 sm:pb-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight">
              All your links,<br />
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                one beautiful page
              </span>
            </h1>
            <p className="mt-5 text-lg text-gray-500 max-w-lg mx-auto leading-relaxed">
              Create your free link-in-bio page in seconds. Share your links, products, and content — all from one shareable URL.
            </p>
            <div className="flex items-center justify-center gap-3 mt-8">
              <button
                onClick={() => signIn("google")}
                className="px-8 py-3.5 bg-gray-900 text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl"
              >
                Get started free
              </button>
              <Link
                href="/pricing"
                className="px-8 py-3.5 border border-gray-200 text-gray-700 rounded-full text-sm font-semibold hover:bg-gray-50 transition-all"
              >
                See pricing
              </Link>
            </div>
          </div>
        </section>

        {/* Mockup */}
        <section className="px-6 pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-b from-gray-50 to-white border rounded-2xl p-6 sm:p-10 shadow-sm">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-64 shrink-0 bg-white rounded-2xl border shadow-lg p-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mx-auto" />
                  <div className="space-y-1 text-center">
                    <div className="h-4 w-28 bg-gray-200 rounded mx-auto" />
                    <div className="h-3 w-36 bg-gray-100 rounded mx-auto" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl" />
                    <div className="h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-80" />
                    <div className="h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-60" />
                  </div>
                </div>
                <div className="flex-1 space-y-4 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-gray-900">Your profile in seconds</h2>
                  <ul className="space-y-3">
                    {[
                      "Sign in with Google",
                      "Add your links",
                      "Pick a theme",
                      "Share your LinkBio URL",
                    ].map((step) => (
                      <li key={step} className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600 shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="px-6 pb-16">
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center p-4">
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-6 pb-20">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-12">
              Everything you need
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-md hover:border-gray-200 transition-all">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 pb-20">
          <div className="max-w-2xl mx-auto text-center bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 rounded-2xl p-10 sm:p-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Start your LinkBio page
            </h2>
            <p className="text-white/80 text-sm sm:text-base mb-6 max-w-sm mx-auto">
              Free to start. Upgrade when you need more.
            </p>
            <button
              onClick={() => signIn("google")}
              className="px-8 py-3.5 bg-white text-gray-900 rounded-full text-sm font-semibold hover:bg-gray-50 transition-all shadow-lg"
            >
              Get started free
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 py-6 border-t border-gray-100">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-gray-400">
          <span>LinkBio</span>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="hover:text-gray-600 transition-colors">Pricing</Link>
            <a href="https://github.com/skinmalata/linkbio" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
