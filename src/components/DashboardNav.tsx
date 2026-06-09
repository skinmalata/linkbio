"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import {
  Link as LinkIcon,
  User,
  Store,
  Palette,
  BarChart3,
  Globe,
  CreditCard,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Links", icon: LinkIcon },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/shop", label: "Shop", icon: Store, pro: true },
  { href: "/dashboard/appearance", label: "Appearance", icon: Palette },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/domains", label: "Domains", icon: Globe, pro: true },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
];

export default function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const isPro = (session?.user as any)?.isPro;

  const handleNav = (href: string, locked?: boolean) => {
    setOpen(false);
    router.push(locked ? "/dashboard/billing" : href);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 p-2 bg-white border rounded-lg shadow-sm md:hidden"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <nav className={`${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 fixed md:sticky top-0 left-0 w-56 h-screen bg-white border-r z-40 transition-transform duration-200 shrink-0`}>
        <div className="text-lg font-bold text-gray-900 mb-6 px-4 pt-5">LinkBio</div>
        <div className="space-y-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            const locked = item.pro && !isPro;
            return (
              <button
                key={item.href}
                onClick={() => handleNav(item.href, locked)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left cursor-pointer ${
                  active
                    ? "bg-purple-100 text-purple-700"
                    : locked
                      ? "text-gray-400"
                      : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
                {locked && <span className="ml-auto text-[10px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded shrink-0">PRO</span>}
              </button>
            );
          })}
        </div>
      </nav>

      {open && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
