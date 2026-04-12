import { NextRequest, NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

const routineInclude = {
  class:   { select: { id: true, name: true } },
  subject: { select: { id: true, name: true } },
  teacher: { select: { id: true, username: true } },
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const routine = await prisma.routine.findUnique({ where: { id }, include: routineInclude });
    if (!routine) return NextResponse.json({ error: "Routine not found" }, { status: 404 });
    return NextResponse.json(routine);
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.routine.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Routine not found" }, { status: 404 });

    const routine = await prisma.routine.update({
      where: { id },
      data: {
        classId:   body.classId   ?? existing.classId,
        subjectId: body.subjectId ?? existing.subjectId,
        teacherId: body.teacherId ?? existing.teacherId,
        day:       body.day       ?? existing.day,
        startTime: body.startTime ?? existing.startTime,
        endTime:   body.endTime   ?? existing.endTime,
        room:      body.room !== undefined ? body.room || null : existing.room,
      },
      include: routineInclude,
    });

    return NextResponse.json(routine);
  } catch (error: any) {
    console.error("[ROUTINE_PUT]", error.message);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A routine already exists for this class, day and time" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await prisma.routine.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Routine not found" }, { status: 404 });
    await prisma.routine.delete({ where: { id } });
    return NextResponse.json({ message: "Routine deleted successfully" });
  } catch (error: any) {
    console.error("[ROUTINE_DELETE]", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}