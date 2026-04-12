// import { NextResponse } from "next/server";
// import prisma from "@/core/lib/prisma";

// export async function GET(
//   req: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params;
//     const result = await prisma.result.findUnique({
//       where: { id },
//       include: {
//         student: { select: { id: true, username: true, email: true } },
//         subject: { select: { id: true, name: true } },
//       },
//     });
//     if (!result) return NextResponse.json({ error: "Result not found" }, { status: 404 });
//     return NextResponse.json(result);
//   } catch (error: any) {
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

// export async function PUT(
//   req: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params;
//     const body = await req.json();

//     const existing = await prisma.result.findUnique({ where: { id } });
//     if (!existing) return NextResponse.json({ error: "Result not found" }, { status: 404 });

//     const result = await prisma.result.update({
//       where: { id },
//       data: {
//         studentId: body.studentId,
//         subjectId: body.subjectId,
//         grade: body.grade,
//       },
//       include: {
//         student: { select: { id: true, username: true, email: true } },
//         subject: { select: { id: true, name: true } },
//       },
//     });

//     return NextResponse.json(result);
//   } catch (error: any) {
//     console.error("[RESULT_PUT]", error.message);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

// export async function PATCH(
//   req: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params;
//     const body = await req.json();

//     const existing = await prisma.result.findUnique({ where: { id } });
//     if (!existing) return NextResponse.json({ error: "Result not found" }, { status: 404 });

//     const data: any = {};
//     if (body.studentId !== undefined) data.studentId = body.studentId;
//     if (body.subjectId !== undefined) data.subjectId = body.subjectId;
//     if (body.grade !== undefined) data.grade = body.grade;

//     const result = await prisma.result.update({
//       where: { id },
//       data,
//       include: {
//         student: { select: { id: true, username: true, email: true } },
//         subject: { select: { id: true, name: true } },
//       },
//     });

//     return NextResponse.json(result);
//   } catch (error: any) {
//     console.error("[RESULT_PATCH]", error.message);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

// export async function DELETE(
//   req: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params;
//     const existing = await prisma.result.findUnique({ where: { id } });
//     if (!existing) return NextResponse.json({ error: "Result not found" }, { status: 404 });

//     await prisma.result.delete({ where: { id } });
//     return NextResponse.json({ message: "Result deleted successfully" });
//   } catch (error: any) {
//     console.error("[RESULT_DELETE]", error.message);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }





import { NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

const resultInclude = {
  student: { select: { id: true, username: true, email: true } },
  subject: { select: { id: true, name: true } },
  class:   { select: { id: true, name: true } },
};

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await prisma.result.findUnique({
      where: { id },
      include: resultInclude,
    });
    if (!result) return NextResponse.json({ error: "Result not found" }, { status: 404 });
    return NextResponse.json(result);
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

    const existing = await prisma.result.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Result not found" }, { status: 404 });

    const totalMarks    = body.totalMarks    !== undefined ? parseFloat(body.totalMarks)    : existing.totalMarks;
    const obtainedMarks = body.obtainedMarks !== undefined ? parseFloat(body.obtainedMarks) : existing.obtainedMarks;
    const percentage    = Math.round((obtainedMarks / totalMarks) * 10000) / 100;
    const isPassed      = body.isPassed !== undefined ? body.isPassed : percentage >= 40;

    const result = await prisma.result.update({
      where: { id },
      data: {
        studentId:     body.studentId     ?? existing.studentId,
        subjectId:     body.subjectId     ?? existing.subjectId,
        classId:       body.classId       ?? existing.classId,
        academicYear:  body.academicYear  ?? existing.academicYear,
        term:          body.term          ?? existing.term,
        grade:         body.grade         ?? existing.grade,
        totalMarks,
        obtainedMarks,
        percentage,
        isPassed,
      },
      include: resultInclude,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[RESULT_PUT]", error.message);
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

    const existing = await prisma.result.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Result not found" }, { status: 404 });

    const data: any = {};
    if (body.studentId    !== undefined) data.studentId    = body.studentId;
    if (body.subjectId    !== undefined) data.subjectId    = body.subjectId;
    if (body.classId      !== undefined) data.classId      = body.classId;
    if (body.academicYear !== undefined) data.academicYear = body.academicYear;
    if (body.term         !== undefined) data.term         = body.term;
    if (body.grade        !== undefined) data.grade        = body.grade;
    if (body.isPassed     !== undefined) data.isPassed     = body.isPassed;

    if (body.totalMarks !== undefined || body.obtainedMarks !== undefined) {
      const totalMarks    = parseFloat(body.totalMarks    ?? existing.totalMarks);
      const obtainedMarks = parseFloat(body.obtainedMarks ?? existing.obtainedMarks);
      data.totalMarks    = totalMarks;
      data.obtainedMarks = obtainedMarks;
      data.percentage    = Math.round((obtainedMarks / totalMarks) * 10000) / 100;
    }

    const result = await prisma.result.update({
      where: { id },
      data,
      include: resultInclude,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[RESULT_PATCH]", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await prisma.result.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Result not found" }, { status: 404 });

    await prisma.result.delete({ where: { id } });
    return NextResponse.json({ message: "Result deleted successfully" });
  } catch (error: any) {
    console.error("[RESULT_DELETE]", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}