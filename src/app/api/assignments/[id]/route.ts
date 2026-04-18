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
        classSubject: {
          include: {
            class: { select: { name: true, grade: true, section: true } },
            subject: { select: { name: true, code: true } },
            teacher: { select: { username: true, email: true } },
          }
        },
        materials: true,
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

    // Verify classSubject if provided
    if (body.classSubjectId) {
      const classSubject = await prisma.classSubject.findUnique({
        where: { id: body.classSubjectId }
      });
      if (!classSubject) {
        return NextResponse.json({ error: "Invalid class-subject assignment" }, { status: 400 });
      }
    }

    // Delete existing materials and create new ones
    await prisma.assignmentMaterial.deleteMany({ where: { assignmentId: id } });

    const assignment = await prisma.assignment.update({
      where: { id },
      data: {
        title:           body.title?.trim(),
        description:     body.description?.trim(),
        dueDate:         body.dueDate ? new Date(body.dueDate) : undefined,
        totalMarks:      body.totalMarks ? parseFloat(body.totalMarks) : undefined,
        classSubjectId:  body.classSubjectId,
        materials: body.materials?.length ? {
          create: body.materials.map((m: any) => ({
            title: m.title,
            type: m.type,
            url: m.url,
          }))
        } : undefined,
      },
      include: {
        classSubject: {
          include: {
            class: { select: { name: true, grade: true, section: true } },
            subject: { select: { name: true, code: true } },
            teacher: { select: { username: true, email: true } },
          }
        },
        materials: true,
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
    if (body.title !== undefined)           data.title           = body.title.trim();
    if (body.description !== undefined)     data.description     = body.description.trim();
    if (body.dueDate !== undefined)         data.dueDate         = new Date(body.dueDate);
    if (body.totalMarks !== undefined)      data.totalMarks      = parseFloat(body.totalMarks);
    if (body.classSubjectId !== undefined)  data.classSubjectId  = body.classSubjectId;

    // Verify classSubject if being updated
    if (body.classSubjectId) {
      const classSubject = await prisma.classSubject.findUnique({
        where: { id: body.classSubjectId }
      });
      if (!classSubject) {
        return NextResponse.json({ error: "Invalid class-subject assignment" }, { status: 400 });
      }
    }

    const assignment = await prisma.assignment.update({
      where: { id },
      data,
      include: {
        classSubject: {
          include: {
            class: { select: { name: true, grade: true, section: true } },
            subject: { select: { name: true, code: true } },
            teacher: { select: { username: true, email: true } },
          }
        },
        materials: true,
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
