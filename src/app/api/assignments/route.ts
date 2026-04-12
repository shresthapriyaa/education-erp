// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/core/lib/prisma";

// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const search = searchParams.get("search") || "";

//     const assignments = await prisma.assignment.findMany({
//       where: search ? {
//         OR: [
//           { title: { contains: search, mode: "insensitive" } },
//           { description: { contains: search, mode: "insensitive" } },
//         ],
//       } : undefined,
//       orderBy: { dueDate: "asc" },
//     });
//     return NextResponse.json(assignments);
//   } catch (error: any) {
//     console.error("[ASSIGNMENTS_GET]", error.message);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();

//     if (!body.title || !body.description || !body.dueDate) {
//       return NextResponse.json({ error: "Missing: title, description, dueDate" }, { status: 400 });
//     }

//     const assignment = await prisma.assignment.create({
//       data: {
//         title: body.title.trim(),
//         description: body.description.trim(),
//         dueDate: new Date(body.dueDate),
//       },
//     });

//     return NextResponse.json(assignment, { status: 201 });
//   } catch (error: any) {
//     console.error("[ASSIGNMENTS_POST]", error.message);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }






import { NextRequest, NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const assignments = await prisma.assignment.findMany({
      where: search ? {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      } : undefined,
      include: {
        class:   { select: { name: true } },
        subject: { select: { name: true } },
        teacher: { select: { username: true } },
      },
      orderBy: { dueDate: "asc" },
    });
    return NextResponse.json(assignments);
  } catch (error: any) {
    console.error("[ASSIGNMENTS_GET]", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.title || !body.description || !body.dueDate || !body.classId || !body.subjectId || !body.teacherId) {
      return NextResponse.json(
        { error: "Missing: title, description, dueDate, classId, subjectId, teacherId" },
        { status: 400 }
      );
    }

    const assignment = await prisma.assignment.create({
      data: {
        title:       body.title.trim(),
        description: body.description.trim(),
        dueDate:     new Date(body.dueDate),
        totalMarks:  body.totalMarks ? parseFloat(body.totalMarks) : 100,
        classId:     body.classId,
        subjectId:   body.subjectId,
        teacherId:   body.teacherId,
      },
      include: {
        class:   { select: { name: true } },
        subject: { select: { name: true } },
        teacher: { select: { username: true } },
      },
    });

    return NextResponse.json(assignment, { status: 201 });
  } catch (error: any) {
    console.error("[ASSIGNMENTS_POST]", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}