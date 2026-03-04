import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionRole, isStaff } from "@/lib/authz";
import { menuItemUpdateSchema } from "@/lib/validation/admin/menu-item";
import { slugify } from "@/lib/slugify";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { role } = await getSessionRole();
  if (!isStaff(role)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const json = await req.json().catch(() => null);
  const parsed = menuItemUpdateSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const nextSlug =
    parsed.data.slug !== undefined
      ? slugify((parsed.data.slug || "").trim() || (parsed.data.name ?? ""))
      : undefined;

  const updated = await prisma.menuItem.update({
    where: { id },
    data: {
      ...(parsed.data.name !== undefined ? { name: parsed.data.name } : {}),
      ...(parsed.data.description !== undefined ? { description: parsed.data.description } : {}),
      ...(parsed.data.price !== undefined ? { price: parsed.data.price as any } : {}),
      ...(parsed.data.categoryId !== undefined ? { categoryId: parsed.data.categoryId } : {}),
      ...(parsed.data.images !== undefined ? { images: parsed.data.images as any } : {}),
      ...(parsed.data.tags !== undefined ? { tags: parsed.data.tags as any } : {}),
      ...(parsed.data.dietaryFlags !== undefined ? { dietaryFlags: parsed.data.dietaryFlags as any } : {}),
      ...(parsed.data.allergens !== undefined ? { allergens: parsed.data.allergens as any } : {}),
      ...(parsed.data.availability !== undefined ? { availability: parsed.data.availability } : {}),
      ...(parsed.data.featured !== undefined ? { featured: parsed.data.featured } : {}),
      ...(nextSlug ? { slug: nextSlug } : {}),
    },
    include: { category: true },
  });

  return NextResponse.json({ ok: true, item: updated });
}

// Soft delete (archive)
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { role } = await getSessionRole();
  if (!isStaff(role)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const updated = await prisma.menuItem.update({
    where: { id },
    data: { archived: true, featured: false, availability: false },
  });

  return NextResponse.json({ ok: true, item: updated });
}


