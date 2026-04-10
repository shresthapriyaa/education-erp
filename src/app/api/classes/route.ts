import { NextRequest, NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/core/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search      = searchParams.get("search")      || "";
    const teacherOnly = searchParams.get("teacherOnly") === "true";
    const schoolId    = searchParams.get("schoolId")    || "";

    let teacherId: string | undefined;

    if (teacherOnly) {
      const session = await getServerSession(authOptions);
      if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      const teacher = await prisma.teacher.findUnique({
        where:  { userId: session.user.id },
        select: { id: true },
      });
      if (!teacher) return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
      teacherId = teacher.id;
    }

    const classes = await prisma.class.findMany({
      where: {
        ...(teacherId  ? { classTeacherId: teacherId } : {}),
        ...(schoolId   ? { schoolId }                  : {}),
        ...(search ? {
          OR: [
            { name:    { contains: search, mode: "insensitive" } },
            { grade:   { contains: search, mode: "insensitive" } },
            { section: { contains: search, mode: "insensitive" } },
            { classTeacher: { username: { contains: search, mode: "insensitive" } } },
          ],
        } : {}),
      },
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
      orderBy: [{ grade: "asc" }, { section: "asc" }],
    });

    return NextResponse.json(classes, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error: any) {
    console.error("[CLASSES_GET]", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.grade || !body.section || !body.academicYear) {
      return NextResponse.json({ error: "Missing: grade, section, or academicYear" }, { status: 400 });
    }

    // Validate classTeacherId if provided
    if (body.classTeacherId) {
      const teacherExists = await prisma.teacher.findUnique({
        where: { id: body.classTeacherId },
      });
      if (!teacherExists) {
        return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
      }
    }

    // Validate schoolId if provided
    if (body.schoolId) {
      const schoolExists = await prisma.school.findUnique({
        where: { id: body.schoolId },
      });
      if (!schoolExists) {
        return NextResponse.json({ error: "School not found" }, { status: 404 });
      }
    }

    // Generate display name
    const name = `${body.grade} - ${body.section}`;

    // Create class
    const newClass = await prisma.class.create({
      data: {
        name,
        grade:          body.grade.trim(),
        section:        body.section.trim(),
        academicYear:   body.academicYear.trim(),
        classTeacherId: body.classTeacherId || null,
        schoolId:       body.schoolId  || null,
      },
    });

    // Create subjects if provided
    if (body.subjects && Array.isArray(body.subjects) && body.subjects.length > 0) {
      const subjectPromises = body.subjects.map((s: any) => 
        prisma.classSubject.create({
          data: {
            classId: newClass.id,
            subjectId: s.subjectId,
            teacherId: s.teacherId || null,
          },
        })
      );
      await Promise.all(subjectPromises);
    }

    // Fetch complete class with all relations
    const completeClass = await prisma.class.findUnique({
      where: { id: newClass.id },
      include: {
        classTeacher: { select: { id: true, username: true, email: true } },
        school: { select: { id: true, name: true } },
        subjects: {
          include: {
            subject: { select: { id: true, name: true, code: true } },
            teacher: { select: { id: true, username: true, email: true } },
          },
        },
        _count: { select: { students: true } },
      },
    });

    return NextResponse.json(completeClass, { status: 201 });
  } catch (error: any) {
    console.error("[CLASSES_POST]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
