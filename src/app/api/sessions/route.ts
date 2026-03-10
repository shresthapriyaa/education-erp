import { NextRequest, NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const classId  = searchParams.get("classId")  || "";
    const schoolId = searchParams.get("schoolId") || "";
    const open     = searchParams.get("open");      // "true" | "false" | null

    const sessions = await prisma.session.findMany({
      where: {
        ...(classId  && { classId }),
        ...(schoolId && { schoolId }),
        ...(open !== null && { isOpen: open === "true" }),
      },
      select: {
        id:        true,
        date:      true,
        startTime: true,
        endTime:   true,
        isOpen:    true,
        class: {
          select: { id: true, name: true },
        },
        school: {
          select: { id: true, name: true },
        },
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(sessions);
  } catch (error: any) {
    console.error("[SESSIONS_GET]", error.message);
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.classId || !body.schoolId || !body.date || !body.startTime) {
      const missing = ["classId", "schoolId", "date", "startTime"].filter(f => !body[f]);
      return NextResponse.json({ error: `Missing: ${missing.join(", ")}` }, { status: 400 });
    }

    const session = await prisma.session.create({
      data: {
        classId:   body.classId,
        schoolId:  body.schoolId,
        date:      new Date(body.date),
        startTime: new Date(body.startTime),
        endTime:   body.endTime ? new Date(body.endTime) : null,
        isOpen:    body.isOpen ?? false,
      },
      select: {
        id:        true,
        date:      true,
        startTime: true,
        endTime:   true,
        isOpen:    true,
        class: {
          select: { id: true, name: true },
        },
        school: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json(session, { status: 201 });
  } catch (error: any) {
    console.error("[SESSIONS_POST]", error.message);
    if (error.code === "P2003") {
      return NextResponse.json({ error: "Invalid classId or schoolId" }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}