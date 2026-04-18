import { NextRequest, NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const classId = searchParams.get('classId');
    const subjectId = searchParams.get('subjectId');

    if (!classId || !subjectId) {
      return NextResponse.json({ 
        error: "Both classId and subjectId parameters are required" 
      }, { status: 400 });
    }

    // Get the ClassSubject relationship to find the assigned teacher
    const classSubject = await prisma.classSubject.findUnique({
      where: {
        classId_subjectId: {
          classId,
          subjectId
        }
      },
      include: {
        class: {
          select: {
            id: true,
            name: true,
            grade: true,
            section: true
          }
        },
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

    if (!classSubject) {
      return NextResponse.json({ 
        error: "No teacher assigned to this class-subject combination" 
      }, { status: 404 });
    }

    return NextResponse.json({
      id: classSubject.id,
      class: classSubject.class,
      subject: classSubject.subject,
      teacher: classSubject.teacher,
      createdAt: classSubject.createdAt,
      updatedAt: classSubject.updatedAt
    });
  } catch (error: any) {
    console.error("[CLASS_SUBJECT_API] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch class-subject assignment", details: error.message },
      { status: 500 }
    );
  }
}