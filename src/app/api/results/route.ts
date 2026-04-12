// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/core/lib/prisma";

// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const search = searchParams.get("search") || "";

//     const results = await prisma.result.findMany({
//       where: search ? {
//         OR: [
//           { student: { username: { contains: search, mode: "insensitive" } } },
//           { subject: { name: { contains: search, mode: "insensitive" } } },
//           { grade: { contains: search, mode: "insensitive" } },
//         ],
//       } : undefined,
//       select: {
//         id: true,
//         studentId: true,
//         subjectId: true,
//         grade: true,
//         createdAt: true,
//         updatedAt: true,
//         student: { select: { id: true, username: true, email: true } },
//         subject: { select: { id: true, name: true } },
//       },
//       orderBy: { createdAt: "desc" },
//     });
//     return NextResponse.json(results);
//   } catch (error: any) {
//     console.error("[RESULTS_GET]", error.message);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();

//     if (!body.studentId || !body.subjectId || !body.grade) {
//       return NextResponse.json({ error: "Missing: studentId, subjectId, grade" }, { status: 400 });
//     }

//     const studentExists = await prisma.student.findUnique({ where: { id: body.studentId } });
//     if (!studentExists) return NextResponse.json({ error: "Student not found" }, { status: 404 });

//     const subjectExists = await prisma.subject.findUnique({ where: { id: body.subjectId } });
//     if (!subjectExists) return NextResponse.json({ error: "Subject not found" }, { status: 404 });

//     const result = await prisma.result.create({
//       data: {
//         studentId: body.studentId,
//         subjectId: body.subjectId,
//         grade: body.grade,
//       },
//       select: {
//         id: true,
//         studentId: true,
//         subjectId: true,
//         grade: true,
//         createdAt: true,
//         updatedAt: true,
//         student: { select: { id: true, username: true, email: true } },
//         subject: { select: { id: true, name: true } },
//       },
//     });

//     return NextResponse.json(result, { status: 201 });
//   } catch (error: any) {
//     console.error("[RESULTS_POST]", error.message);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }


import { NextRequest, NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const results = await prisma.result.findMany({
      where: search ? {
        OR: [
          { student: { username: { contains: search, mode: "insensitive" } } },
          { subject: { name:     { contains: search, mode: "insensitive" } } },
          { grade:   { contains: search, mode: "insensitive" } },
          { term:    { contains: search, mode: "insensitive" } },
          { academicYear: { contains: search, mode: "insensitive" } },
        ],
      } : undefined,
      select: {
        id:            true,
        studentId:     true,
        subjectId:     true,
        classId:       true,
        academicYear:  true,
        term:          true,
        totalMarks:    true,
        obtainedMarks: true,
        percentage:    true,
        grade:         true,
        isPassed:      true,
        createdAt:     true,
        updatedAt:     true,
        student: { select: { id: true, username: true, email: true } },
        subject: { select: { id: true, name: true } },
        class:   { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(results);
  } catch (error: any) {
    console.error("[RESULTS_GET]", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (
      !body.studentId || !body.subjectId || !body.classId ||
      !body.academicYear || !body.term || !body.grade ||
      body.totalMarks === undefined || body.obtainedMarks === undefined
    ) {
      return NextResponse.json(
        { error: "Missing: studentId, subjectId, classId, academicYear, term, grade, totalMarks, obtainedMarks" },
        { status: 400 }
      );
    }

    const studentExists = await prisma.student.findUnique({ where: { id: body.studentId } });
    if (!studentExists) return NextResponse.json({ error: "Student not found" }, { status: 404 });

    const subjectExists = await prisma.subject.findUnique({ where: { id: body.subjectId } });
    if (!subjectExists) return NextResponse.json({ error: "Subject not found" }, { status: 404 });

    const classExists = await prisma.class.findUnique({ where: { id: body.classId } });
    if (!classExists) return NextResponse.json({ error: "Class not found" }, { status: 404 });

    const totalMarks    = parseFloat(body.totalMarks);
    const obtainedMarks = parseFloat(body.obtainedMarks);
    const percentage    = (obtainedMarks / totalMarks) * 100;
    const isPassed      = body.isPassed !== undefined ? body.isPassed : percentage >= 40;

    const result = await prisma.result.create({
      data: {
        studentId:     body.studentId,
        subjectId:     body.subjectId,
        classId:       body.classId,
        academicYear:  body.academicYear,
        term:          body.term,
        totalMarks,
        obtainedMarks,
        percentage:    Math.round(percentage * 100) / 100,
        grade:         body.grade,
        isPassed,
      },
      select: {
        id:            true,
        studentId:     true,
        subjectId:     true,
        classId:       true,
        academicYear:  true,
        term:          true,
        totalMarks:    true,
        obtainedMarks: true,
        percentage:    true,
        grade:         true,
        isPassed:      true,
        createdAt:     true,
        updatedAt:     true,
        student: { select: { id: true, username: true, email: true } },
        subject: { select: { id: true, name: true } },
        class:   { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("[RESULTS_POST]", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}