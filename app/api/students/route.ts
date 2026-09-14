import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { id, name, studentNumber, yearLevel, email } = await request.json();

    if (!id || !name || !studentNumber || !yearLevel || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const student = await prisma.student.create({
      data: { id, name, studentNumber, yearLevel, email },
    });

    return NextResponse.json(student);
  } catch (error) {
    console.error("Error creating student:", error);
    return NextResponse.json({ error: "Failed to create student profile" }, { status: 500 });
  }
}