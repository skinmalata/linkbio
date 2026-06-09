"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function MainHeader() {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (pathname.startsWith("/api") || pathname.startsWith("/_")) return null;

  const isDashboard = pathname.startsWith("/dashboard");
  const isPublicProfile = !isDashboard && pathname !== "/" && pathname !== "/pricing";

  return (
    <header className="px-6 py-3 flex items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <Link href={session ? "/dashboard" : "/"} className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          LinkBio
        </Link>
        {!isDashboard && !isPublicProfile && (
          <nav className="hidden sm:flex items-center gap-6">
            <Link href="/" className={`text-sm transition-colors ${pathname === "/" ? "text-purple-600 font-medium" : "text-gray-500 hover:text-gray-700"}`}>
              Home
            </Link>
            <Link href="/pricing" className={`text-sm transition-colors ${pathname === "/pricing" ? "text-purple-600 font-medium" : "text-gray-500 hover:text-gray-700"}`}>
              Pricing
            </Link>
          </nav>
        )}
      </div>
      <div className="flex items-center gap-3">
        {session ? (
          <>
            {!isDashboard && (
              <Link href="/dashboard" className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors">
                Dashboard
              </Link>
            )}
            {isDashboard && (
              <Link href="/pricing" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                Pricing
              </Link>
            )}
            {isPublicProfile && (
              <Link href="/dashboard" className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors">
                Dashboard
              </Link>
            )}
            <button
              onClick={() => signOut()}
              className="px-4 py-1.5 text-sm text-gray-500 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
            >
              Sign out
            </button>
          </>
        ) : (
          <button
            onClick={() => signIn("google")}
            className="px-5 py-2 bg-gray-900 text-white text-sm rounded-full hover:bg-gray-800 transition-colors"
          >
            Sign in
          </button>
        )}
      </div>
    </header>
  );
}
