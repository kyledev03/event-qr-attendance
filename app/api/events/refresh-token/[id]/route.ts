import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const event = await prisma.event.findUnique({ where: { id } });

  if (!event || event.status !== "active") {
    return NextResponse.json({ error: "Event is not active" }, { status: 400 });
  }

  const token = randomUUID();
  const expiresAt = new Date(Date.now() + 10_000);

  const updated = await prisma.event.update({
    where: { id },
    data: { currentCheckinToken: token, tokenExpiresAt: expiresAt },
  });

  return NextResponse.json(updated);
}
