import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getItem, updateItem } from "@/lib/dynamodb";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await getItem(`USER#${session.user.id}`, "PROFILE");
  return NextResponse.json({
    customDomain: (profile as any)?.customDomain || "",
  });
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await getItem(`USER#${session.user.id}`, "PROFILE");
  if (!(profile as any)?.isPro) {
    return NextResponse.json({ error: "Pro subscription required" }, { status: 403 });
  }

  const { domain } = await req.json();

  const clean = domain
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "")
    .trim();

  if (clean && !/^([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/.test(clean)) {
    return NextResponse.json({ error: "Invalid domain format" }, { status: 400 });
  }

  await updateItem(`USER#${session.user.id}`, "PROFILE", { customDomain: clean });

  return NextResponse.json({ customDomain: clean });
}
