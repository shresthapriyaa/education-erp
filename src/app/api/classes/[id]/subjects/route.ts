import { NextRequest, NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: classId } = await params;

    const classSubjects = await prisma.classSubject.findMany({
      where: { classId },
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            code: true
          }
        },
        teacher: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(classSubjects);
  } catch (error: any) {
    console.error("[CLASS_SUBJECTS_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch class subjects", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: classId } = await params;
    const body = await req.json();

    console.log('[CLASS_SUBJECTS_POST] classId:', classId);
    console.log('[CLASS_SUBJECTS_POST] body:', body);

    if (!classId) {
      return NextResponse.json(
        { error: "classId is required" },
        { status: 400 }
      );
    }

    if (!body.subjectId) {
      return NextResponse.json(
        { error: "subjectId is required" },
        { status: 400 }
      );
    }

    // Create ClassSubject record directly (let database handle duplicates)
    const classSubject = await prisma.classSubject.create({
      data: {
        classId,
        subjectId: body.subjectId,
        teacherId: body.teacherId || null
      },
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            code: true
          }
        },
        teacher: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });

    console.log('[CLASS_SUBJECTS_POST] Created:', classSubject);
    return NextResponse.json(classSubject, { status: 201 });
  } catch (error: any) {
    console.error("[CLASS_SUBJECTS_POST] Error:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "This subject is already assigned to this class" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to assign subject to class", details: error.message },
      { status: 500 }
    );
  }
}