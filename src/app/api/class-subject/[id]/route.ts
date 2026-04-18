import { NextRequest, NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const classSubject = await prisma.classSubject.findUnique({
      where: { id },
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
        error: "ClassSubject not found" 
      }, { status: 404 });
    }

    return NextResponse.json(classSubject);
  } catch (error: any) {
    console.error("[CLASS_SUBJECT_BY_ID_API] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch class-subject", details: error.message },
      { status: 500 }
    );
  }
}