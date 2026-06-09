"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) router.push("/dashboard");
  }, [session, router]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          LinkBio
        </span>
        <button
          onClick={() => signIn("google")}
          className="px-5 py-2 bg-gray-900 text-white text-sm rounded-full hover:bg-gray-800 transition-colors"
        >
          Sign in
        </button>
      </header>

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
        <button
          onClick={() => signIn("google")}
          className="mt-8 px-8 py-3 bg-purple-600 text-white rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
        >
          Get started free
        </button>

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
