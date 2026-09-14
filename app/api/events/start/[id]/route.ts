import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const token = randomUUID();
  const expiresAt = new Date(Date.now() + 10_000); // 10 seconds from now

  const event = await prisma.event.update({
    where: { id },
    data: {
      status: "active",
      currentCheckinToken: token,
      tokenExpiresAt: expiresAt,
    },
  });

  return NextResponse.json(event);
}