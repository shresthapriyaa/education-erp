import { NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const exam = await prisma.exam.findUnique({
      where: { id },
      include: { subject: { select: { id: true, name: true } } },
    });
    if (!exam) return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    return NextResponse.json(exam);
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

    const existing = await prisma.exam.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Exam not found" }, { status: 404 });

    if (body.subjectId) {
      const subjectExists = await prisma.subject.findUnique({ where: { id: body.subjectId } });
      if (!subjectExists) return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    const exam = await prisma.exam.update({
      where: { id },
      data: {
        title: body.title?.trim(),
        subjectId: body.subjectId,
        date: body.date ? new Date(body.date) : undefined,
      },
      include: { subject: { select: { id: true, name: true } } },
    });

    return NextResponse.json(exam);
  } catch (error: any) {
    console.error("[EXAM_PUT]", error.message);
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

    const existing = await prisma.exam.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Exam not found" }, { status: 404 });

    const data: any = {};
    if (body.title !== undefined) data.title = body.title.trim();
    if (body.subjectId !== undefined) data.subjectId = body.subjectId;
    if (body.date !== undefined) data.date = new Date(body.date);

    const exam = await prisma.exam.update({
      where: { id },
      data,
      include: { subject: { select: { id: true, name: true } } },
    });

    return NextResponse.json(exam);
  } catch (error: any) {
    console.error("[EXAM_PATCH]", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await prisma.exam.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Exam not found" }, { status: 404 });

    await prisma.exam.delete({ where: { id } });
    return NextResponse.json({ message: "Exam deleted successfully" });
  } catch (error: any) {
    console.error("[EXAM_DELETE]", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}