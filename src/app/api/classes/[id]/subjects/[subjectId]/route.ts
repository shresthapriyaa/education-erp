import { NextRequest, NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

type Params = { params: Promise<{ id: string; subjectId: string }> };

// PATCH /api/classes/[id]/subjects/[subjectId] - Update teacher for a subject
export async function PATCH(req: NextRequest, { params }: Params) {
  const { id, subjectId } = await params;
  try {
    const body = await req.json();

    const classSubject = await prisma.classSubject.update({
      where: {
        classId_subjectId: {
          classId: id,
          subjectId: subjectId,
        },
      },
      data: {
        teacherId: body.teacherId || null,
      },
      include: {
        subject: { select: { id: true, name: true, code: true } },
        teacher: { select: { id: true, username: true, email: true } },
      },
    });

    return NextResponse.json(classSubject);
  } catch (error: any) {
    console.error("[CLASS_SUBJECT_PATCH]", error.message);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Subject not found in this class" }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/classes/[id]/subjects/[subjectId] - Remove subject from class
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id, subjectId } = await params;
  try {
    await prisma.classSubject.delete({
      where: {
        classId_subjectId: {
          classId: id,
          subjectId: subjectId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[CLASS_SUBJECT_DELETE]", error.message);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Subject not found in this class" }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
