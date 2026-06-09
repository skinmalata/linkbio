import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { deleteItem } from "@/lib/dynamodb";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await deleteItem(`USER#${session.user.id}`, `LINK#${id}`);

  return NextResponse.json({ success: true });
}
