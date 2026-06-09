import { NextResponse } from "next/server";
import { getItem } from "@/lib/dynamodb";

export async function GET(req: Request) {
  const host = req.headers.get("host") || "";

  const domainItem = await getItem(`DOMAIN#${host}`, "PROFILE");
  if (!domainItem) return NextResponse.json({ error: "Domain not found" }, { status: 404 });

  const userId = domainItem.userId as string;
  const profile = await getItem(`USER#${userId}`, "PROFILE");

  return NextResponse.json({ profile, userId });
}
