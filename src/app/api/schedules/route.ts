import { NextRequest, NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const schedules = await prisma.schedule.findMany({
      where: search ? {
        OR: [
          { class: { name: { contains: search, mode: "insensitive" } } },
          { subject: { name: { contains: search, mode: "insensitive" } } },
        ],
      } : undefined,
      select: {
        id: true, classId: true, subjectId: true, day: true,
        startTime: true, endTime: true, createdAt: true, updatedAt: true,
        class: { select: { id: true, name: true } },
        subject: { select: { id: true, name: true } },
      },
      orderBy: { day: "asc" },
    });
    return NextResponse.json(schedules);
  } catch (error: any) {
    console.error("[SCHEDULES_GET]", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.classId || !body.subjectId || !body.day || !body.startTime || !body.endTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const today = new Date().toISOString().split("T")[0];
    const schedule = await prisma.schedule.create({
      data: {
        classId: body.classId,
        subjectId: body.subjectId,
        day: body.day,
        startTime: new Date(`${today}T${body.startTime}:00`),
        endTime: new Date(`${today}T${body.endTime}:00`),
      },
      select: {
        id: true, classId: true, subjectId: true, day: true,
        startTime: true, endTime: true, createdAt: true, updatedAt: true,
        class: { select: { id: true, name: true } },
        subject: { select: { id: true, name: true } },
      },
    });
    return NextResponse.json(schedule, { status: 201 });
  } catch (error: any) {
    console.error("[SCHEDULES_POST]", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}