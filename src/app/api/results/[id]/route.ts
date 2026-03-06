import { NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await prisma.result.findUnique({
      where: { id },
      include: {
        student: { select: { id: true, username: true, email: true } },
        subject: { select: { id: true, name: true } },
      },
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

    const result = await prisma.result.update({
      where: { id },
      data: {
        studentId: body.studentId,
        subjectId: body.subjectId,
        grade: body.grade,
      },
      include: {
        student: { select: { id: true, username: true, email: true } },
        subject: { select: { id: true, name: true } },
      },
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
    if (body.studentId !== undefined) data.studentId = body.studentId;
    if (body.subjectId !== undefined) data.subjectId = body.subjectId;
    if (body.grade !== undefined) data.grade = body.grade;

    const result = await prisma.result.update({
      where: { id },
      data,
      include: {
        student: { select: { id: true, username: true, email: true } },
        subject: { select: { id: true, name: true } },
      },
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