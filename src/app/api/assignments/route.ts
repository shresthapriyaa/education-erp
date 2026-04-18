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
        classSubject: {
          include: {
            class: { select: { name: true, grade: true, section: true } },
            subject: { select: { name: true, code: true } },
            teacher: { select: { username: true, email: true } },
          }
        },
        materials: true,
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

    if (!body.title || !body.description || !body.dueDate || !body.classSubjectId) {
      return NextResponse.json(
        { error: "Missing: title, description, dueDate, classSubjectId" },
        { status: 400 }
      );
    }

    // Verify that the classSubject exists
    const classSubject = await prisma.classSubject.findUnique({
      where: { id: body.classSubjectId },
      include: {
        class: { select: { name: true } },
        subject: { select: { name: true } },
        teacher: { select: { username: true } },
      }
    });

    if (!classSubject) {
      return NextResponse.json(
        { error: "Invalid class-subject assignment" },
        { status: 400 }
      );
    }

    const assignment = await prisma.assignment.create({
      data: {
        title:           body.title.trim(),
        description:     body.description.trim(),
        dueDate:         new Date(body.dueDate),
        totalMarks:      body.totalMarks ? parseFloat(body.totalMarks) : 100,
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

    return NextResponse.json(assignment, { status: 201 });
  } catch (error: any) {
    console.error("[ASSIGNMENTS_POST]", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
