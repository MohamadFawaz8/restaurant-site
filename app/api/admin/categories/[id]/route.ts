import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionRole, isStaff } from "@/lib/authz";
import { categoryUpdateSchema } from "@/lib/validation/admin/category";
import { slugify } from "@/lib/slugify";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { role } = await getSessionRole();
  if (!isStaff(role)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const json = await req.json().catch(() => null);
  const parsed = categoryUpdateSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const nextSlug =
    parsed.data.slug !== undefined
      ? slugify((parsed.data.slug || "").trim() || (parsed.data.name ?? ""))
      : undefined;

  const updated = await prisma.category.update({
    where: { id },
    data: {
      ...(parsed.data.name !== undefined ? { name: parsed.data.name } : {}),
      ...(parsed.data.description !== undefined ? { description: parsed.data.description?.trim() || null } : {}),
      ...(nextSlug ? { slug: nextSlug } : {}),
    },
  });

  return NextResponse.json({ ok: true, item: updated });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { role } = await getSessionRole();
  if (!isStaff(role)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const count = await prisma.menuItem.count({ where: { categoryId: id, archived: false } });
  if (count > 0) {
    return NextResponse.json(
      { error: "Cannot delete a category that has active menu items. Archive or move items first." },
      { status: 400 }
    );
  }

  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}


