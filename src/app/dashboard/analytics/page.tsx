"use client";

import { useState, useEffect } from "react";
import { BarChart3, MousePointerClick, Link as LinkIcon } from "lucide-react";

interface LinkStat {
  linkId: string;
  title: string;
  clicks: number;
  url: string;
}

export default function AnalyticsPage() {
  const [links, setLinks] = useState<LinkStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/links")
      .then((r) => r.json())
      .then((data) => {
        setLinks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalClicks = links.reduce((sum, l) => sum + l.clicks, 0);
  const totalLinks = links.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Loading...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">
          Track your link performance
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 max-w-2xl">
        <div className="bg-white p-4 rounded-xl border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <LinkIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalLinks}</p>
              <p className="text-xs text-gray-500">Total links</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <MousePointerClick className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalClicks}</p>
              <p className="text-xs text-gray-500">Total clicks</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {totalLinks > 0 ? Math.round(totalClicks / totalLinks) : 0}
              </p>
              <p className="text-xs text-gray-500">Avg clicks/link</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl">
        <h2 className="text-sm font-medium text-gray-700 mb-3">Per-link performance</h2>
        <div className="space-y-2">
          {links.map((link) => (
            <div key={link.linkId} className="bg-white p-4 rounded-xl border flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 truncate">{link.title}</p>
                <p className="text-sm text-gray-400 truncate">{link.url}</p>
              </div>
              <div className="text-right ml-4">
                <p className="text-lg font-bold text-gray-900">{link.clicks}</p>
                <p className="text-xs text-gray-400">clicks</p>
              </div>
            </div>
          ))}
          {links.length === 0 && (
            <p className="text-center py-8 text-gray-400 text-sm">No links to track yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
