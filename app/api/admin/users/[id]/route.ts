import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionRole, isAdmin } from "@/lib/authz";
import { userRoleUpdateSchema } from "@/lib/validation/admin/user";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, role } = await getSessionRole();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin(role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const json = await req.json().catch(() => null);
  const parsed = userRoleUpdateSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const updated = await prisma.user.update({
    where: { id },
    data: { role: parsed.data.role },
    select: { id: true, email: true, name: true, role: true },
  });

  return NextResponse.json({ ok: true, item: updated });
}


