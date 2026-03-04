import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionRole, isStaff } from "@/lib/authz";
import { categoryCreateSchema } from "@/lib/validation/admin/category";
import { slugify } from "@/lib/slugify";

export async function GET(req: Request) {
  const { role } = await getSessionRole();
  if (!isStaff(role)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").trim();
  const page = Math.max(1, Number(url.searchParams.get("page") ?? "1") || 1);
  const pageSize = Math.min(50, Math.max(5, Number(url.searchParams.get("pageSize") ?? "10") || 10));
  const skip = (page - 1) * pageSize;

  const where = q
    ? {
        OR: [
          { name: { contains: q } },
          { slug: { contains: q } },
        ],
      }
    : {};

  const [total, items] = await Promise.all([
    prisma.category.count({ where }),
    prisma.category.findMany({
      where,
      orderBy: { name: "asc" },
      skip,
      take: pageSize,
    }),
  ]);

  return NextResponse.json({ ok: true, items, total, page, pageSize });
}

export async function POST(req: Request) {
  const { role } = await getSessionRole();
  if (!isStaff(role)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const json = await req.json().catch(() => null);
  const parsed = categoryCreateSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const slug = slugify(parsed.data.slug?.trim() || parsed.data.name);
  const created = await prisma.category.create({
    data: {
      name: parsed.data.name,
      slug,
      description: parsed.data.description?.trim() || null,
    },
  });

  return NextResponse.json({ ok: true, item: created }, { status: 201 });
}


