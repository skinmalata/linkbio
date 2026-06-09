import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getItem, queryItems, putItem, updateItem } from "@/lib/dynamodb";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const links = await queryItems(`USER#${session.user.id}`, "LINK#");
  return NextResponse.json(
    links.map((l: any) => ({
      linkId: l.SK?.replace("LINK#", ""),
      title: l.title,
      url: l.url,
      clicks: l.clicks || 0,
      position: l.position || 0,
    })).sort((a, b) => a.position - b.position)
  );
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, url } = await req.json();
  if (!title || !url) return NextResponse.json({ error: "Title and URL required" }, { status: 400 });

  const linkId = crypto.randomUUID().slice(0, 8);
  const profile = await getItem(`USER#${session.user.id}`, "PROFILE");
  const existing = await queryItems(`USER#${session.user.id}`, "LINK#");
  const position = existing.length;
  const isPro = (profile as any)?.isPro;

  if (existing.length >= 3 && !isPro) {
    return NextResponse.json({ error: "Free plan limit: 3 links. Upgrade to Pro for unlimited." }, { status: 403 });
  }

  await putItem(`LINKID#${linkId}`, "META", { userId: session.user.id });
  await putItem(`USER#${session.user.id}`, `LINK#${linkId}`, {
    linkId,
    title,
    url,
    position,
    clicks: 0,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ linkId, title, url, position, clicks: 0 });
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { linkId, title, url } = await req.json();
  if (!linkId) return NextResponse.json({ error: "linkId required" }, { status: 400 });

  const updates: Record<string, any> = {};
  if (title) updates.title = title;
  if (url) updates.url = url;

  await updateItem(`USER#${session.user.id}`, `LINK#${linkId}`, updates);

  return NextResponse.json({ success: true });
}
