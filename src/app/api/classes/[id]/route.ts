import { NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const c = await prisma.class.findUnique({
      where: { id },
      select: {
        id: true, name: true, grade: true, section: true, academicYear: true, classTeacherId: true,
        schoolId: true,
        createdAt: true, updatedAt: true,
        classTeacher: { select: { id: true, username: true, email: true } },
        school:       { select: { id: true, name: true } },
        students:     { select: { id: true } },
        subjects: {
          select: {
            id: true,
            subject: { select: { id: true, name: true, code: true } },
            teacher: { select: { id: true, username: true, email: true } },
          },
        },
        _count: { select: { students: true } },
      },
    });
    if (!c) return NextResponse.json({ error: "Class not found" }, { status: 404 });
    return NextResponse.json(c, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.class.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Class not found" }, { status: 404 });

    if (body.classTeacherId) {
      const teacherExists = await prisma.teacher.findUnique({ where: { id: body.classTeacherId } });
      if (!teacherExists) return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    // Generate new display name if grade or section changed
    const name = `${body.grade || existing.grade} - ${body.section || existing.section}`;

    const updated = await prisma.class.update({
      where: { id },
      data: {
        name,
        grade:          body.grade?.trim() || existing.grade,
        section:        body.section?.trim() || existing.section,
        academicYear:   body.academicYear?.trim() || existing.academicYear,
        classTeacherId: body.classTeacherId || null,
      },
      include: { 
        classTeacher: { select: { id: true, username: true, email: true } },
        school: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("[CLASS_PUT]", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.class.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Class not found" }, { status: 404 });

    const data: any = {};
    if (body.grade !== undefined) data.grade = body.grade.trim();
    if (body.section !== undefined) data.section = body.section.trim();
    if (body.academicYear !== undefined) data.academicYear = body.academicYear.trim();
    if (body.classTeacherId !== undefined) data.classTeacherId = body.classTeacherId || null;

    // Update display name if grade or section changed
    if (body.grade || body.section) {
      data.name = `${body.grade || existing.grade} - ${body.section || existing.section}`;
    }

    const updated = await prisma.class.update({
      where: { id },
      data,
      include: { 
        classTeacher: { select: { id: true, username: true, email: true } },
        school: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("[CLASS_PATCH]", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await prisma.class.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Class not found" }, { status: 404 });

    await prisma.class.delete({ where: { id } });
    return NextResponse.json({ message: "Class deleted successfully" });
  } catch (error: any) {
    console.error("[CLASS_DELETE]", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
