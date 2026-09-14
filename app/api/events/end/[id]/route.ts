import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const event = await prisma.event.update({
    where: { id },
    data: {
      status: "ended",
      currentCheckinToken: null,
      tokenExpiresAt: null,
    },
  });

  return NextResponse.json(event);
}
