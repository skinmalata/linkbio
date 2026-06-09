"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) router.push("/dashboard");
  }, [session, router]);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 max-w-2xl leading-tight">
          All your links,<br />
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            one beautiful page
          </span>
        </h1>
        <p className="mt-4 text-lg text-gray-500 max-w-md">
          Create your free link-in-bio page. Share all your important links in one place.
        </p>
        <div className="flex items-center gap-3 mt-8">
          <button
            onClick={() => signIn("google")}
            className="px-8 py-3 bg-purple-600 text-white rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
          >
            Get started free
          </button>
          <Link
            href="/pricing"
            className="px-8 py-3 border border-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            See pricing
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl w-full text-left">
          <div className="p-4 rounded-xl border bg-white">
            <h3 className="font-semibold text-gray-900 mb-1">Simple setup</h3>
            <p className="text-sm text-gray-500">Add your links, customize the look, share your page.</p>
          </div>
          <div className="p-4 rounded-xl border bg-white">
            <h3 className="font-semibold text-gray-900 mb-1">Track clicks</h3>
            <p className="text-sm text-gray-500">See how many clicks each link gets.</p>
          </div>
          <div className="p-4 rounded-xl border bg-white">
            <h3 className="font-semibold text-gray-900 mb-1">Custom themes</h3>
            <p className="text-sm text-gray-500">Make your page match your brand or style.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
