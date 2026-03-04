import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionRole, isStaff } from "@/lib/authz";
import { menuItemCreateSchema } from "@/lib/validation/admin/menu-item";
import { slugify } from "@/lib/slugify";

export async function GET(req: Request) {
  const { role } = await getSessionRole();
  if (!isStaff(role)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").trim();
  const page = Math.max(1, Number(url.searchParams.get("page") ?? "1") || 1);
  const pageSize = Math.min(50, Math.max(5, Number(url.searchParams.get("pageSize") ?? "10") || 10));
  const archived = url.searchParams.get("archived") === "true";
  const skip = (page - 1) * pageSize;

  const where = {
    archived,
    ...(q
      ? {
          OR: [
            { name: { contains: q } },
            { slug: { contains: q } },
            { description: { contains: q } },
            { category: { name: { contains: q } } },
          ],
        }
      : {}),
  };

  const [total, items] = await Promise.all([
    prisma.menuItem.count({ where }),
    prisma.menuItem.findMany({
      where,
      orderBy: [{ updatedAt: "desc" }],
      skip,
      take: pageSize,
      include: { category: true },
    }),
  ]);

  return NextResponse.json({ ok: true, items, total, page, pageSize });
}

export async function POST(req: Request) {
  const { role } = await getSessionRole();
  if (!isStaff(role)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const json = await req.json().catch(() => null);
  const parsed = menuItemCreateSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const slug = slugify(parsed.data.slug?.trim() || parsed.data.name);
  const created = await prisma.menuItem.create({
    data: {
      name: parsed.data.name,
      slug,
      description: parsed.data.description,
      price: parsed.data.price as any,
      categoryId: parsed.data.categoryId,
      images: parsed.data.images as any,
      tags: parsed.data.tags as any,
      dietaryFlags: parsed.data.dietaryFlags as any,
      allergens: parsed.data.allergens as any,
      availability: parsed.data.availability,
      featured: parsed.data.featured,
      archived: false,
    },
    include: { category: true },
  });

  return NextResponse.json({ ok: true, item: created }, { status: 201 });
}


