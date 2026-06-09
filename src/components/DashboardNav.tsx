"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Links", icon: "🔗" },
  { href: "/dashboard/profile", label: "Profile", icon: "👤" },
  { href: "/dashboard/shop", label: "Shop", icon: "🛍️" },
  { href: "/dashboard/appearance", label: "Appearance", icon: "🎨" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "📊" },
];

export default function DashboardNav({ username }: { username: string }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen flex-col border-r bg-white">
      <div className="p-4 border-b">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          LinkBio
        </Link>
        <a
          href={`/${username}`}
          target="_blank"
          className="text-sm text-gray-500 hover:text-purple-600 block mt-1"
        >
          /{username} ↗
        </a>
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
              pathname === item.href
                ? "bg-purple-50 text-purple-700 font-medium"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t">
        <button
          onClick={() => signOut()}
          className="text-sm text-gray-500 hover:text-red-600 w-full text-left"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
