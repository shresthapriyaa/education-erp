// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/core/lib/prisma";

// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const search = searchParams.get("search") || "";

//     const exams = await prisma.exam.findMany({
//       where: search ? {
//         OR: [
//           { title: { contains: search, mode: "insensitive" } },
//           { subject: { name: { contains: search, mode: "insensitive" } } },
//         ],
//       } : undefined,
//       select: {
//         id: true,
//         title: true,
//         subjectId: true,
//         date: true,
//         createdAt: true,
//         updatedAt: true,
//         subject: { select: { id: true, name: true } },
//       },
//       orderBy: { date: "asc" },
//     });
//     return NextResponse.json(exams);
//   } catch (error: any) {
//     console.error("[EXAMS_GET]", error.message);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();

//     if (!body.title || !body.subjectId || !body.date) {
//       return NextResponse.json({ error: "Missing: title, subjectId, date" }, { status: 400 });
//     }

//     const subjectExists = await prisma.subject.findUnique({ where: { id: body.subjectId } });
//     if (!subjectExists) {
//       return NextResponse.json({ error: "Subject not found" }, { status: 404 });
//     }

//     const exam = await prisma.exam.create({
//       data: {
//         title: body.title.trim(),
//         subjectId: body.subjectId,
//         date: new Date(body.date),
//       },
//       select: {
//         id: true,
//         title: true,
//         subjectId: true,
//         date: true,
//         createdAt: true,
//         updatedAt: true,
//         subject: { select: { id: true, name: true } },
//       },
//     });

//     return NextResponse.json(exam, { status: 201 });
//   } catch (error: any) {
//     console.error("[EXAMS_POST]", error.message);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }






import { NextRequest, NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const exams = await prisma.exam.findMany({
      where: search ? {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { subject: { name: { contains: search, mode: "insensitive" } } },
        ],
      } : undefined,
      select: {
        id:         true,
        title:      true,
        type:       true,
        totalMarks: true,
        passMarks:  true,
        subjectId:  true,
        classId:    true,
        date:       true,
        createdAt:  true,
        updatedAt:  true,
        subject: { select: { id: true, name: true } },
        class:   { select: { id: true, name: true } },
      },
      orderBy: { date: "asc" },
    });
    return NextResponse.json(exams);
  } catch (error: any) {
    console.error("[EXAMS_GET]", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.title || !body.subjectId || !body.classId || !body.date || !body.type) {
      return NextResponse.json(
        { error: "Missing: title, subjectId, classId, date, type" },
        { status: 400 }
      );
    }

    const subjectExists = await prisma.subject.findUnique({ where: { id: body.subjectId } });
    if (!subjectExists) return NextResponse.json({ error: "Subject not found" }, { status: 404 });

    const classExists = await prisma.class.findUnique({ where: { id: body.classId } });
    if (!classExists) return NextResponse.json({ error: "Class not found" }, { status: 404 });

    const exam = await prisma.exam.create({
      data: {
        title:      body.title.trim(),
        type:       body.type,
        totalMarks: body.totalMarks ? parseFloat(body.totalMarks) : 100,
        passMarks:  body.passMarks  ? parseFloat(body.passMarks)  : 40,
        subjectId:  body.subjectId,
        classId:    body.classId,
        date:       new Date(body.date),
      },
      select: {
        id:         true,
        title:      true,
        type:       true,
        totalMarks: true,
        passMarks:  true,
        subjectId:  true,
        classId:    true,
        date:       true,
        createdAt:  true,
        updatedAt:  true,
        subject: { select: { id: true, name: true } },
        class:   { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(exam, { status: 201 });
  } catch (error: any) {
    console.error("[EXAMS_POST]", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}