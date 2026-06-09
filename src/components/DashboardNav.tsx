"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Link as LinkIcon,
  User,
  Store,
  Palette,
  BarChart3,
  Globe,
  CreditCard,
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
  const { data: session } = useSession();
  const isPro = (session?.user as any)?.isPro;

  return (
    <nav className="w-56 shrink-0">
      <div className="text-lg font-bold text-gray-900 mb-6 px-3">LinkBio</div>
      <div className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          const locked = item.pro && !isPro;
          return (
            <Link
              key={item.href}
              href={locked ? "/dashboard/billing" : item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-purple-100 text-purple-700"
                  : locked
                    ? "text-gray-400 hover:text-gray-500"
                    : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
              {locked && <span className="ml-auto text-[10px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded">PRO</span>}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
