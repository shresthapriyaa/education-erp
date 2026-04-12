import { NextRequest, NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const classId  = searchParams.get("classId")  || undefined;
    const day      = searchParams.get("day")       || undefined;
    const search   = searchParams.get("search")    || "";

    const routines = await prisma.routine.findMany({
      where: {
        ...(classId && { classId }),
        ...(day     && { day: day as any }),
        ...(search  && {
          OR: [
            { subject: { name: { contains: search, mode: "insensitive" } } },
            { class:   { name: { contains: search, mode: "insensitive" } } },
            { room:    { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      include: {
        class:   { select: { id: true, name: true } },
        subject: { select: { id: true, name: true } },
        teacher: { select: { id: true, username: true } },
      },
      orderBy: [{ day: "asc" }, { startTime: "asc" }],
    });
    return NextResponse.json(routines);
  } catch (error: any) {
    console.error("[ROUTINES_GET]", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.classId || !body.subjectId || !body.day || !body.startTime || !body.endTime) {
      return NextResponse.json(
        { error: "Missing: classId, subjectId, day, startTime, endTime" },
        { status: 400 }
      );
    }

    const routine = await prisma.routine.create({
      data: {
        classId:   body.classId,
        subjectId: body.subjectId,
        teacherId: body.teacherId || null,
        day:       body.day,
        startTime: body.startTime,
        endTime:   body.endTime,
        room:      body.room || null,
      },
      include: {
        class:   { select: { id: true, name: true } },
        subject: { select: { id: true, name: true } },
        teacher: { select: { id: true, username: true } },
      },
    });

    return NextResponse.json(routine, { status: 201 });
  } catch (error: any) {
    console.error("[ROUTINES_POST]", error.message);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A routine already exists for this class, day and time" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}