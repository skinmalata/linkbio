"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Globe, Save, Check, AlertCircle, ExternalLink, Lock } from "lucide-react";

export default function DomainsPage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [domain, setDomain] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error" | "forbidden">("idle");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        setProfile(data);
        setDomain(data.customDomain || "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setStatus("idle");

    const res = await fetch("/api/domains", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain }),
    });

    if (res.status === 403) {
      setStatus("forbidden");
    } else if (res.ok) {
      setStatus("saved");
    } else {
      setStatus("error");
    }

    setSaving(false);
  };

  const isPro = profile?.isPro;

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>;
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Custom Domain</h1>
        <p className="text-sm text-gray-500 mt-1">
          Use your own domain for your LinkBio page
        </p>
      </div>

      {!isPro ? (
        <div className="bg-white p-8 rounded-xl border text-center">
          <Lock className="w-8 h-8 text-gray-300 mx-auto mb-3" />
          <h2 className="font-semibold text-gray-900 mb-1">Pro feature</h2>
          <p className="text-sm text-gray-500 mb-4">
            Custom domains are available on the Pro plan and above.
          </p>
          <a
            href="/dashboard/billing"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
          >
            Upgrade to Pro
          </a>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl border space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Your domain
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">https://</span>
              <input
                type="text"
                placeholder="link.yourdomain.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Enter a custom domain or subdomain (e.g., link.yourname.com)
            </p>
          </div>

          {domain && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                DNS Setup Instructions
              </h3>
              <p className="text-sm text-gray-600">Add a CNAME record pointing to:</p>
              <div className="bg-white border rounded px-3 py-2 text-sm font-mono text-gray-800">
                linkbio.vercel.app
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save domain"}
            </button>

            {status === "saved" && (
              <span className="flex items-center gap-1 text-sm text-green-600">
                <Check className="w-4 h-4" /> Saved
              </span>
            )}
            {status === "error" && (
              <span className="flex items-center gap-1 text-sm text-red-500">
                <AlertCircle className="w-3 h-3" /> Invalid domain
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
