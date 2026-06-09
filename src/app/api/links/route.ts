import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getItem, putItem, queryItems, deleteItem, updateItem } from "@/lib/dynamodb";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const links = await queryItems(`USER#${session.user.id}`, "LINK#");
  const sorted = links
    .map((l: any) => ({
      linkId: l.SK.replace("LINK#", ""),
      userId: l.userId,
      title: l.title,
      url: l.url,
      position: l.position,
      isActive: l.isActive,
      clicks: l.clicks || 0,
      createdAt: l.createdAt,
    }))
    .sort((a: any, b: any) => a.position - b.position);

  return NextResponse.json(sorted);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, url } = await req.json();
  if (!title || !url) return NextResponse.json({ error: "Title and URL required" }, { status: 400 });

  const linkId = uuidv4();
  const existingLinks = await queryItems(`USER#${session.user.id}`, "LINK#");

  await putItem({
    PK: `USER#${session.user.id}`,
    SK: `LINK#${linkId}`,
    linkId,
    userId: session.user.id,
    title,
    url,
    position: existingLinks.length,
    isActive: true,
    clicks: 0,
    createdAt: new Date().toISOString(),
  });

  await putItem({
    PK: `LINKID#${linkId}`,
    SK: "META",
    userId: session.user.id,
  });

  return NextResponse.json({ linkId, title, url, position: existingLinks.length, isActive: true });
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { linkId, title, url, position, isActive } = await req.json();
  if (!linkId) return NextResponse.json({ error: "linkId required" }, { status: 400 });

  const updates: Record<string, unknown> = {};
  if (title !== undefined) updates.title = title;
  if (url !== undefined) updates.url = url;
  if (position !== undefined) updates.position = position;
  if (isActive !== undefined) updates.isActive = isActive;

  if (Object.keys(updates).length > 0) {
    await updateItem(`USER#${session.user.id}`, `LINK#${linkId}`, updates);
  }

  return NextResponse.json({ success: true });
}
