import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { qrCode } = await request.json();

    if (!qrCode) {
      return NextResponse.json({ error: "Missing qrCode" }, { status: 400 });
    }

    const attendee = await prisma.attendee.findUnique({ where: { qrCode } });

    if (!attendee) {
      return NextResponse.json({ error: "Attendee not found" }, { status: 404 });
    }

    if (attendee.checkedIn) {
      return NextResponse.json({ message: "Already checked in", attendee });
    }

    const updated = await prisma.attendee.update({
      where: { qrCode },
      data: { checkedIn: true, checkedInAt: new Date() },
    });

    return NextResponse.json({ message: "Checked in!", attendee: updated });
  } catch (error) {
    console.error("Error checking in attendee:", error);
    return NextResponse.json({ error: "Failed to check in" }, { status: 500 });
  }
}