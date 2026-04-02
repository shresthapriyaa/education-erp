import { NextRequest, NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const grade = await prisma.grade.findUnique({
      where: { id },
      include: {
        student:    { select: { id: true, username: true, email: true } },
        assignment: { select: { id: true, title: true, dueDate: true } },
      },
    });
    if (!grade) return NextResponse.json({ error: "Grade not found" }, { status: 404 });
    return NextResponse.json(grade);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.grade.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Grade not found" }, { status: 404 });

    const grade = await prisma.grade.update({
      where: { id },
      data: {
        studentId:    body.studentId,
        assignmentId: body.assignmentId,
        score:        body.score !== undefined ? parseFloat(body.score) : undefined,
      },
      include: {
        student:    { select: { id: true, username: true, email: true } },
        assignment: { select: { id: true, title: true, dueDate: true } },
      },
    });
    return NextResponse.json(grade);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await prisma.grade.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Grade not found" }, { status: 404 });

    await prisma.grade.delete({ where: { id } });
    return NextResponse.json({ message: "Grade deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}