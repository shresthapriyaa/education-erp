import { NextRequest, NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const classId = searchParams.get('classId');

    if (!classId) {
      // If no classId provided, return all subjects (for backward compatibility)
      const subjects = await prisma.subject.findMany({
        select: {
          id: true,
          name: true,
          code: true,
          description: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: {
          name: 'asc'
        }
      });
      return NextResponse.json(subjects);
    }

    // Get subjects for the class via ClassSubject relationship
    const classSubjects = await prisma.classSubject.findMany({
      where: { classId },
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            code: true,
            description: true
          }
        },
        teacher: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      },
      orderBy: {
        subject: {
          name: 'asc'
        }
      }
    });

    // Transform to return subjects with their assigned teachers
    const subjects = classSubjects.map(cs => ({
      id: cs.subject.id,
      name: cs.subject.name,
      code: cs.subject.code,
      description: cs.subject.description,
      assignedTeacher: cs.teacher ? {
        id: cs.teacher.id,
        username: cs.teacher.username,
        email: cs.teacher.email
      } : null
    }));

    return NextResponse.json(subjects);
  } catch (error: any) {
    console.error("[SUBJECTS_API] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subjects", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.name) {
      return NextResponse.json({ error: "Subject name is required" }, { status: 400 });
    }

    const subject = await prisma.subject.create({
      data: {
        name: body.name.trim(),
        code: body.code?.trim() || null,
        description: body.description?.trim() || null,
      },
    });

    return NextResponse.json(subject, { status: 201 });
  } catch (error: any) {
    console.error("[SUBJECTS_POST] Error:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Subject code already exists" }, { status: 409 });
    }
    return NextResponse.json(
      { error: "Failed to create subject", details: error.message },
      { status: 500 }
    );
  }
}