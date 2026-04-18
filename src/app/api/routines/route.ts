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
        ...(classId && { 
          classSubject: { classId } 
        }),
        ...(day && { day: day as any }),
        ...(search && {
          OR: [
            { classSubject: { subject: { name: { contains: search, mode: "insensitive" } } } },
            { classSubject: { class: { name: { contains: search, mode: "insensitive" } } } },
            { room: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      include: {
        classSubject: {
          include: {
            class: { select: { id: true, name: true, grade: true, section: true } },
            subject: { select: { id: true, name: true, code: true } },
            teacher: { select: { id: true, username: true, email: true } },
          }
        },
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

    if (!body.classSubjectId || !body.day || !body.startTime || !body.endTime) {
      return NextResponse.json(
        { error: "Missing: classSubjectId, day, startTime, endTime" },
        { status: 400 }
      );
    }

    // Verify that the classSubject exists
    const classSubject = await prisma.classSubject.findUnique({
      where: { id: body.classSubjectId }
    });

    if (!classSubject) {
      return NextResponse.json(
        { error: "Invalid class-subject assignment" },
        { status: 400 }
      );
    }

    const routine = await prisma.routine.create({
      data: {
        classSubjectId: body.classSubjectId,
        day:            body.day,
        startTime:      body.startTime,
        endTime:        body.endTime,
        room:           body.room || null,
      },
      include: {
        classSubject: {
          include: {
            class: { select: { id: true, name: true, grade: true, section: true } },
            subject: { select: { id: true, name: true, code: true } },
            teacher: { select: { id: true, username: true, email: true } },
          }
        },
      },
    });

    return NextResponse.json(routine, { status: 201 });
  } catch (error: any) {
    console.error("[ROUTINES_POST]", error.message);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A routine already exists for this class-subject, day and time" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}