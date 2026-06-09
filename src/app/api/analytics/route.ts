import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { queryItems } from "@/lib/dynamodb";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const days = parseInt(url.searchParams.get("days") || "7");

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - days);

  const clickEvents = await queryItems(`USER#${session.user.id}`, "CLICK#");

  const trendMap: Record<string, number> = {};
  const referrerMap: Record<string, number> = {};

  for (const event of clickEvents as any[]) {
    const date = event.timestamp
      ? new Date(event.timestamp).toISOString().slice(0, 10)
      : null;
    if (date && date >= sevenDaysAgo.toISOString().slice(0, 10)) {
      trendMap[date] = (trendMap[date] || 0) + 1;
    }
    const ref = event.referrer?.host || "direct";
    referrerMap[ref] = (referrerMap[ref] || 0) + 1;
  }

  const trend = Object.entries(trendMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));

  const referrers = Object.entries(referrerMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([name, value]) => ({ name: name === "direct" ? "Direct" : name, value }));

  return NextResponse.json({ trend, referrers });
}
