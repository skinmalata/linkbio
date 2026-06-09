import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getItem, putItem, updateItem, deleteItem } from "@/lib/dynamodb";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await getItem(`USER#${session.user.id}`, "PROFILE");
  if (!profile) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    userId: session.user.id,
    email: profile.email,
    name: profile.name,
    image: profile.image,
    username: profile.username,
    bio: profile.bio || "",
    theme: profile.theme || "minimal",
    isPro: profile.isPro || false,
    createdAt: profile.createdAt,
  });
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, image, bio, username, theme } = await req.json();
  const updates: Record<string, unknown> = {};
  if (name !== undefined) updates.name = name;
  if (image !== undefined) updates.image = image;
  if (bio !== undefined) updates.bio = bio;
  if (theme !== undefined) updates.theme = theme;

  if (username !== undefined) {
    const current = await getItem(`USER#${session.user.id}`, "PROFILE");
    const oldUsername = current?.username as string;

    if (username !== oldUsername) {
      const taken = await getItem(`USERNAME#${username}`, "PROFILE");
      if (taken) return NextResponse.json({ error: "Username already taken" }, { status: 409 });

      await deleteItem(`USERNAME#${oldUsername}`, "PROFILE");
      await putItem(`USERNAME#${username}`, "PROFILE", { userId: session.user.id });
      updates.username = username;
    }
  }

  if (Object.keys(updates).length > 0) {
    await updateItem(`USER#${session.user.id}`, "PROFILE", updates);
  }

  return NextResponse.json({ success: true });
}
