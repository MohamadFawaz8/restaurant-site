import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionRole, isStaff } from "@/lib/authz";

export async function GET(req: Request) {
  const { role } = await getSessionRole();
  if (!isStaff(role)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").trim();
  const page = Math.max(1, Number(url.searchParams.get("page") ?? "1") || 1);
  const pageSize = Math.min(50, Math.max(5, Number(url.searchParams.get("pageSize") ?? "10") || 10));
  const skip = (page - 1) * pageSize;

  const where: any = q
    ? {
        OR: [
          { email: { contains: q } },
          { name: { contains: q } },
        ],
      }
    : {};

  const [total, items] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    }),
  ]);

  return NextResponse.json({ ok: true, items, total, page, pageSize });
}


