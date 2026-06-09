"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import LinkCard from "@/components/LinkCard";
import LinkForm from "@/components/LinkForm";
import { ExternalLink, Copy, Check, Globe } from "lucide-react";

interface LinkItem {
  linkId: string;
  title: string;
  url: string;
  position: number;
  isActive: boolean;
  clicks: number;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const fetchLinks = useCallback(async () => {
    const res = await fetch("/api/links");
    if (res.ok) {
      const data = await res.json();
      setLinks(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const addLink = async (title: string, url: string) => {
    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, url }),
    });
    if (res.ok) fetchLinks();
  };

  const toggleLink = async (linkId: string, isActive: boolean) => {
    await fetch("/api/links", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ linkId, isActive }),
    });
    fetchLinks();
  };

  const deleteLink = async (linkId: string) => {
    await fetch(`/api/links/${linkId}`, { method: "DELETE" });
    fetchLinks();
  };

  const copyUrl = async () => {
    if (!session?.user?.username) return;
    await navigator.clipboard.writeText(`${window.location.origin}/${session.user.username}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const profileUrl = session?.user?.username
    ? `${window.location.origin}/${session.user.username}`
    : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Links</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage the links on your public profile
          </p>
        </div>
      </div>

      {profileUrl && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex items-center justify-between max-w-2xl">
          <div className="flex items-center gap-3 min-w-0">
            <Globe className="w-5 h-5 text-purple-600 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-gray-400">Your LinkBio page</p>
              <a
                href={profileUrl}
                target="_blank"
                className="text-sm font-medium text-purple-600 hover:text-purple-700 truncate block"
              >
                {profileUrl}
              </a>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={copyUrl}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
            <a
              href={profileUrl}
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Open <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      <div className="space-y-3 max-w-2xl">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : links.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg mb-1">No links yet</p>
            <p className="text-sm">Add your first link to get started</p>
          </div>
        ) : (
          links.map((link) => (
            <LinkCard
              key={link.linkId}
              link={link}
              onToggle={toggleLink}
              onDelete={deleteLink}
            />
          ))
        )}
        <LinkForm onAdd={addLink} />
      </div>
    </div>
  );
}
