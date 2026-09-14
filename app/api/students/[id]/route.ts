import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const student = await prisma.student.findUnique({ where: { id } });

  if (!student) {
    return NextResponse.json({ error: "Not a student" }, { status: 404 });
  }

  return NextResponse.json(student);
}