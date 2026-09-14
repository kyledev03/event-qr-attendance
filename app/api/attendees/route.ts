import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { name, email, eventId } = await request.json();

    if (!name || !email || !eventId) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, eventId" },
        { status: 400 }
      );
    }

    const attendee = await prisma.attendee.create({
      data: { name, email, eventId },
    });

    return NextResponse.json(attendee);
  } catch (error) {
    console.error("Error creating attendee:", error);
    return NextResponse.json(
      { error: "Failed to create attendee" },
      { status: 500 }
    );
  }
}