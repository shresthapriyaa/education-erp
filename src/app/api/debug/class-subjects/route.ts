import { NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

export async function GET() {
  try {
    const classSubjects = await prisma.classSubject.findMany({
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
            username: true
          }
        }
      }
    });

    return NextResponse.json({
      total: classSubjects.length,
      records: classSubjects
    });
  } catch (error: any) {
    console.error("[DEBUG_CLASS_SUBJECTS]", error);
    return NextResponse.json(
      { error: "Failed to fetch class subjects", details: error.message },
      { status: 500 }
    );
  }
}