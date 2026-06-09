"use client";

import { useState, useEffect } from "react";
import { BarChart3, MousePointerClick, Link as LinkIcon, Calendar } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

interface LinkStat {
  linkId: string;
  title: string;
  clicks: number;
  url: string;
}

interface ClickEvent {
  date: string;
  count: number;
}

interface ReferrerStat {
  name: string;
  value: number;
}

const COLORS = ["#7c3aed", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#8b5cf6", "#14b8a6"];

export default function AnalyticsPage() {
  const [links, setLinks] = useState<LinkStat[]>([]);
  const [clickTrend, setClickTrend] = useState<ClickEvent[]>([]);
  const [referrers, setReferrers] = useState<ReferrerStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("7");

  useEffect(() => {
    Promise.all([
      fetch("/api/links").then((r) => r.json()),
      fetch("/api/analytics?days=" + dateRange).then((r) => r.json()).catch(() => ({ trend: [], referrers: [] })),
    ])
      .then(([linksData, analyticsData]) => {
        setLinks(linksData);
        setClickTrend(analyticsData.trend || []);
        setReferrers(analyticsData.referrers || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [dateRange]);

  const totalClicks = links.reduce((sum, l) => sum + l.clicks, 0);
  const totalLinks = links.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Track your link performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Click trend</h2>
          {clickTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={clickTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#7c3aed"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#7c3aed" }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-sm text-gray-400">
              No click data yet
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Traffic sources</h2>
          {referrers.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={referrers}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {referrers.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-sm text-gray-400">
              No traffic data yet
            </div>
          )}
          {referrers.length > 0 && (
            <div className="mt-3 space-y-1.5">
              {referrers.map((r, i) => (
                <div key={r.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-gray-600">{r.name}</span>
                  </div>
                  <span className="font-medium text-gray-900">{r.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-medium text-gray-700 mb-3">Per-link performance</h2>
        <div className="space-y-2">
          {links.map((link) => (
            <div key={link.linkId} className="bg-white p-4 rounded-xl border flex items-center justify-between hover:shadow-sm transition-shadow">
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
            <p className="text-center py-8 text-gray-400 text-sm">No links yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
