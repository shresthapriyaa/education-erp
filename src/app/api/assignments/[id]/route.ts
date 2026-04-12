// import { NextResponse } from "next/server";
// import prisma from "@/core/lib/prisma";

// export async function GET(
//   req: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params;
//     const assignment = await prisma.assignment.findUnique({ where: { id } });
//     if (!assignment) return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
//     return NextResponse.json(assignment);
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

//     const existing = await prisma.assignment.findUnique({ where: { id } });
//     if (!existing) return NextResponse.json({ error: "Assignment not found" }, { status: 404 });

//     const assignment = await prisma.assignment.update({
//       where: { id },
//       data: {
//         title: body.title?.trim(),
//         description: body.description?.trim(),
//         dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
//       },
//     });

//     return NextResponse.json(assignment);
//   } catch (error: any) {
//     console.error("[ASSIGNMENT_PUT]", error.message);
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

//     const existing = await prisma.assignment.findUnique({ where: { id } });
//     if (!existing) return NextResponse.json({ error: "Assignment not found" }, { status: 404 });

//     const data: any = {};
//     if (body.title !== undefined) data.title = body.title.trim();
//     if (body.description !== undefined) data.description = body.description.trim();
//     if (body.dueDate !== undefined) data.dueDate = new Date(body.dueDate);

//     const assignment = await prisma.assignment.update({ where: { id }, data });
//     return NextResponse.json(assignment);
//   } catch (error: any) {
//     console.error("[ASSIGNMENT_PATCH]", error.message);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

// export async function DELETE(
//   req: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params;
//     const existing = await prisma.assignment.findUnique({ where: { id } });
//     if (!existing) return NextResponse.json({ error: "Assignment not found" }, { status: 404 });

//     await prisma.assignment.delete({ where: { id } });
//     return NextResponse.json({ message: "Assignment deleted successfully" });
//   } catch (error: any) {
//     console.error("[ASSIGNMENT_DELETE]", error.message);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }



import { NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: {
        class:   { select: { name: true } },
        subject: { select: { name: true } },
        teacher: { select: { username: true } },
      },
    });
    if (!assignment) return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    return NextResponse.json(assignment);
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

    const existing = await prisma.assignment.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Assignment not found" }, { status: 404 });

    const assignment = await prisma.assignment.update({
      where: { id },
      data: {
        title:       body.title?.trim(),
        description: body.description?.trim(),
        dueDate:     body.dueDate ? new Date(body.dueDate) : undefined,
        totalMarks:  body.totalMarks ? parseFloat(body.totalMarks) : undefined,
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

    return NextResponse.json(assignment);
  } catch (error: any) {
    console.error("[ASSIGNMENT_PUT]", error.message);
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

    const existing = await prisma.assignment.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Assignment not found" }, { status: 404 });

    const data: any = {};
    if (body.title !== undefined)       data.title       = body.title.trim();
    if (body.description !== undefined) data.description = body.description.trim();
    if (body.dueDate !== undefined)     data.dueDate     = new Date(body.dueDate);
    if (body.totalMarks !== undefined)  data.totalMarks  = parseFloat(body.totalMarks);
    if (body.classId !== undefined)     data.classId     = body.classId;
    if (body.subjectId !== undefined)   data.subjectId   = body.subjectId;
    if (body.teacherId !== undefined)   data.teacherId   = body.teacherId;

    const assignment = await prisma.assignment.update({
      where: { id },
      data,
      include: {
        class:   { select: { name: true } },
        subject: { select: { name: true } },
        teacher: { select: { username: true } },
      },
    });
    return NextResponse.json(assignment);
  } catch (error: any) {
    console.error("[ASSIGNMENT_PATCH]", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await prisma.assignment.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Assignment not found" }, { status: 404 });

    await prisma.assignment.delete({ where: { id } });
    return NextResponse.json({ message: "Assignment deleted successfully" });
  } catch (error: any) {
    console.error("[ASSIGNMENT_DELETE]", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}