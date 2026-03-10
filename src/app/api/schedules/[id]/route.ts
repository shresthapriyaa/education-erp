import { NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const existing = await prisma.schedule.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Schedule not found" }, { status: 404 });
    const today = new Date().toISOString().split("T")[0];
    const schedule = await prisma.schedule.update({
      where: { id },
      data: {
        classId: body.classId,
        subjectId: body.subjectId,
        day: body.day,
        startTime: new Date(`${today}T${body.startTime}:00`),
        endTime: new Date(`${today}T${body.endTime}:00`),
      },
      include: {
        class: { select: { id: true, name: true } },
        subject: { select: { id: true, name: true } },
      },
    });
    return NextResponse.json(schedule);
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const existing = await prisma.schedule.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Schedule not found" }, { status: 404 });
    const today = new Date().toISOString().split("T")[0];
    const data: any = {};
    if (body.classId !== undefined) data.classId = body.classId;
    if (body.subjectId !== undefined) data.subjectId = body.subjectId;
    if (body.day !== undefined) data.day = body.day;
    if (body.startTime !== undefined) data.startTime = new Date(`${today}T${body.startTime}:00`);
    if (body.endTime !== undefined) data.endTime = new Date(`${today}T${body.endTime}:00`);
    const schedule = await prisma.schedule.update({
      where: { id }, data,
      include: {
        class: { select: { id: true, name: true } },
        subject: { select: { id: true, name: true } },
      },
    });
    return NextResponse.json(schedule);
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const existing = await prisma.schedule.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Schedule not found" }, { status: 404 });
    await prisma.schedule.delete({ where: { id } });
    return NextResponse.json({ message: "Schedule deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}