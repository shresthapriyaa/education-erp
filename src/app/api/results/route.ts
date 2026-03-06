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
          { subject: { name: { contains: search, mode: "insensitive" } } },
          { grade: { contains: search, mode: "insensitive" } },
        ],
      } : undefined,
      select: {
        id: true,
        studentId: true,
        subjectId: true,
        grade: true,
        createdAt: true,
        updatedAt: true,
        student: { select: { id: true, username: true, email: true } },
        subject: { select: { id: true, name: true } },
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

    if (!body.studentId || !body.subjectId || !body.grade) {
      return NextResponse.json({ error: "Missing: studentId, subjectId, grade" }, { status: 400 });
    }

    const studentExists = await prisma.student.findUnique({ where: { id: body.studentId } });
    if (!studentExists) return NextResponse.json({ error: "Student not found" }, { status: 404 });

    const subjectExists = await prisma.subject.findUnique({ where: { id: body.subjectId } });
    if (!subjectExists) return NextResponse.json({ error: "Subject not found" }, { status: 404 });

    const result = await prisma.result.create({
      data: {
        studentId: body.studentId,
        subjectId: body.subjectId,
        grade: body.grade,
      },
      select: {
        id: true,
        studentId: true,
        subjectId: true,
        grade: true,
        createdAt: true,
        updatedAt: true,
        student: { select: { id: true, username: true, email: true } },
        subject: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("[RESULTS_POST]", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}