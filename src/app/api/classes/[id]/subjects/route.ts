import { NextRequest, NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

type Params = { params: Promise<{ id: string }> };

// GET /api/classes/[id]/subjects - Get all subjects for a class
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const classSubjects = await prisma.classSubject.findMany({
      where: { classId: id },
      include: {
        subject: { select: { id: true, name: true, code: true } },
        teacher: { select: { id: true, username: true, email: true } },
      },
      orderBy: { subject: { name: "asc" } },
    });

    return NextResponse.json(classSubjects);
  } catch (error: any) {
    console.error("[CLASS_SUBJECTS_GET]", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/classes/[id]/subjects - Add subject to class
export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const body = await req.json();

    if (!body.subjectId) {
      return NextResponse.json({ error: "Missing: subjectId" }, { status: 400 });
    }

    // Check if already exists
    const existing = await prisma.classSubject.findUnique({
      where: {
        classId_subjectId: {
          classId: id,
          subjectId: body.subjectId,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ error: "Subject already added to this class" }, { status: 409 });
    }

    const classSubject = await prisma.classSubject.create({
      data: {
        classId: id,
        subjectId: body.subjectId,
        teacherId: body.teacherId || null,
      },
      include: {
        subject: { select: { id: true, name: true, code: true } },
        teacher: { select: { id: true, username: true, email: true } },
      },
    });

    return NextResponse.json(classSubject, { status: 201 });
  } catch (error: any) {
    console.error("[CLASS_SUBJECTS_POST]", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
