import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { reservationSchema } from "@/lib/validation/reservation";

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = reservationSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const dt = new Date(parsed.data.dateTime);
  if (Number.isNaN(dt.getTime())) {
    return NextResponse.json({ error: "Invalid date/time" }, { status: 400 });
  }

  const reservation = await prisma.reservation.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      partySize: parsed.data.partySize,
      dateTime: dt,
      notes: parsed.data.notes || null,
      status: "PENDING",
    },
    select: { id: true, status: true, createdAt: true },
  });

  return NextResponse.json({ ok: true, reservation }, { status: 201 });
}


