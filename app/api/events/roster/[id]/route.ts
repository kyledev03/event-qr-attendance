import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RosterRow = {
  studentNumber: string;
  name: string;
  yearLevel: string;
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: eventId } = await params;

  try {
    const { rows }: { rows: RosterRow[] } = await request.json();

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: "No rows provided" }, { status: 400 });
    }

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const result = await prisma.eventRoster.createMany({
      data: rows.map((row) => ({
        eventId,
        studentNumber: row.studentNumber,
        name: row.name,
        yearLevel: row.yearLevel,
      })),
      skipDuplicates: true,
    });

    return NextResponse.json({ count: result.count });
  } catch (error) {
    console.error("Error uploading roster:", error);
    return NextResponse.json({ error: "Failed to upload roster" }, { status: 500 });
  }
}

