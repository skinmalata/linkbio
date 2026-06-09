import { NextResponse } from "next/server";
import { getItem, putItem, updateItem } from "@/lib/dynamodb";

export async function GET(req: Request, { params }: { params: Promise<{ linkId: string }> }) {
  const { linkId } = await params;
  const referrer = req.headers.get("referer") || "direct";
  const userAgent = req.headers.get("user-agent") || "unknown";

  const meta = await getItem(`LINKID#${linkId}`, "META");
  if (!meta) return NextResponse.json({ error: "Link not found" }, { status: 404 });

  const userId = meta.userId as string;

  const linkItem = await getItem(`USER#${userId}`, `LINK#${linkId}`);
  if (!linkItem?.url) return NextResponse.json({ error: "Link URL not found" }, { status: 404 });

  const targetUrl = linkItem.url as string;

  await putItem(`CLICK#${linkId}`, `TS#${Date.now()}`, {
    linkId,
    userId,
    referrer,
    userAgent,
    timestamp: new Date().toISOString(),
  });

  await putItem(`USER#${userId}`, `CLICK#${Date.now()}`, {
    linkId,
    referrer,
    userAgent,
    timestamp: new Date().toISOString(),
  });

  const currentClicks = (linkItem?.clicks as number) || 0;
  await updateItem(`USER#${userId}`, `LINK#${linkId}`, { clicks: currentClicks + 1 });

  return NextResponse.redirect(targetUrl);
}
