import { NextRequest, NextResponse } from "next/server";
import  prisma  from "@/core/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/core/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "TEACHER"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const classSession = await prisma.session.findUnique({
      where:  { id },
      select: { classId: true },
    });

    if (!classSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const students = await prisma.student.findMany({
      select: {
        id:       true,
        username: true,
        email:    true,
        attendance: {
          where:  { sessionId: id },
          select: {
            id:                 true,
            status:             true,
            distanceFromCenter: true,
            withinSchool:       true,
          },
        },
      },
      orderBy: { username: "asc" },
    });

    const rows = students.map(s => ({
      id:           s.id,
      username:     s.username,
      email:        s.email,
      status:       s.attendance[0]?.status             ?? null,
      attendanceId: s.attendance[0]?.id                 ?? null,
      withinSchool: s.attendance[0]?.withinSchool       ?? null,
      distance:     s.attendance[0]?.distanceFromCenter ?? null,
    }));

    return NextResponse.json({ students: rows });

  } catch (error: any) {
    console.error("[SESSION_STUDENTS_GET]", error.message);
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}