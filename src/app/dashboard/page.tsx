"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import LinkCard from "@/components/LinkCard";
import LinkForm from "@/components/LinkForm";
import { ExternalLink } from "lucide-react";

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
    if (res.ok) {
      fetchLinks();
    }
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

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Links</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage the links on your public profile
          </p>
        </div>
        {session?.user?.username && (
          <a
            href={`/${session.user.username}`}
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors"
          >
            View profile
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>

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
