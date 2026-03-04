import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionRole, isStaff } from "@/lib/authz";
import { contactStatusSchema } from "@/lib/validation/admin/contact";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { role } = await getSessionRole();
  if (!isStaff(role)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const json = await req.json().catch(() => null);
  const parsed = contactStatusSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const updated = await prisma.contactMessage.update({
    where: { id },
    data: { status: parsed.data.status },
  });

  return NextResponse.json({ ok: true, item: updated });
}


