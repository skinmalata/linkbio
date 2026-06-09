import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { putItem, queryItems, updateItem, getItem } from "@/lib/dynamodb";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const products = await queryItems(`USER#${session.user.id}`, "PRODUCT#");
  const sorted = products
    .map((p: any) => ({
      productId: p.SK.replace("PRODUCT#", ""),
      title: p.title,
      description: p.description || "",
      imageUrl: p.imageUrl || "",
      price: p.price || "",
      currency: p.currency || "USD",
      isFeatured: p.isFeatured || false,
      position: p.position || 0,
      createdAt: p.createdAt,
    }))
    .sort((a: any, b: any) => a.position - b.position);

  return NextResponse.json(sorted);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await getItem(`USER#${session.user.id}`, "PROFILE") as any;
  if (!profile?.isPro) return NextResponse.json({ error: "Pro subscription required" }, { status: 403 });

  const { title, description, imageUrl, price, currency } = await req.json();
  if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });

  const existing = await queryItems(`USER#${session.user.id}`, "PRODUCT#");
  if (existing.length >= 10) {
    return NextResponse.json({ error: "Maximum 10 products allowed" }, { status: 400 });
  }

  const productId = uuidv4();

  await putItem(`USER#${session.user.id}`, `PRODUCT#${productId}`, {
    productId,
    userId: session.user.id,
    title,
    description: description || "",
    imageUrl: imageUrl || "",
    price: price || "",
    currency: currency || "USD",
    isFeatured: false,
    position: existing.length,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({
    productId,
    title,
    description: description || "",
    imageUrl: imageUrl || "",
    price: price || "",
    currency: currency || "USD",
    isFeatured: false,
    position: existing.length,
  });
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await getItem(`USER#${session.user.id}`, "PROFILE") as any;
  if (!profile?.isPro) return NextResponse.json({ error: "Pro subscription required" }, { status: 403 });

  const { productId, title, description, imageUrl, price, currency, isFeatured, position } = await req.json();
  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });

  if (isFeatured === true) {
    const allProducts = await queryItems(`USER#${session.user.id}`, "PRODUCT#");
    const featuredCount = allProducts.filter((p: any) => p.isFeatured && p.SK !== `PRODUCT#${productId}`).length;
    if (featuredCount >= 3) {
      return NextResponse.json({ error: "Maximum 3 featured products" }, { status: 400 });
    }
  }

  const updates: Record<string, unknown> = {};
  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;
  if (imageUrl !== undefined) updates.imageUrl = imageUrl;
  if (price !== undefined) updates.price = price;
  if (currency !== undefined) updates.currency = currency;
  if (isFeatured !== undefined) updates.isFeatured = isFeatured;
  if (position !== undefined) updates.position = position;

  if (Object.keys(updates).length > 0) {
    await updateItem(`USER#${session.user.id}`, `PRODUCT#${productId}`, updates);
  }

  return NextResponse.json({ success: true });
}
