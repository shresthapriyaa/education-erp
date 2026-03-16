import { NextRequest, NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const grades = await prisma.grade.findMany({
      where: search ? {
        OR: [
          { student:    { username: { contains: search, mode: "insensitive" } } },
          { assignment: { title:    { contains: search, mode: "insensitive" } } },
        ],
      } : undefined,
      include: {
        student:    { select: { id: true, username: true, email: true } },
        assignment: { select: { id: true, title: true, dueDate: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(grades);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentId, assignmentId, score } = body;

    if (!studentId || !assignmentId || score === undefined) {
      return NextResponse.json(
        { error: "studentId, assignmentId and score are required" },
        { status: 400 }
      );
    }

    const studentExists = await prisma.student.findUnique({ where: { id: studentId } });
    if (!studentExists) return NextResponse.json({ error: "Student not found" }, { status: 404 });

    const assignmentExists = await prisma.assignment.findUnique({ where: { id: assignmentId } });
    if (!assignmentExists) return NextResponse.json({ error: "Assignment not found" }, { status: 404 });

    const grade = await prisma.grade.create({
      data: { studentId, assignmentId, score: parseFloat(score) },
      include: {
        student:    { select: { id: true, username: true, email: true } },
        assignment: { select: { id: true, title: true, dueDate: true } },
      },
    });
    return NextResponse.json(grade, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}