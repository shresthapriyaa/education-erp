import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/core/lib/auth";
import prisma from "@/core/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const teacher = await prisma.teacher.findUnique({
      where: { email: session.user.email },
      include: { classTeacherFor: true },
    });

    if (!teacher || teacher.classTeacherFor.length === 0) {
      return NextResponse.json(
        { error: "You are not a class teacher" },
        { status: 403 }
      );
    }

    const classId = teacher.classTeacherFor[0].id;
    const student = await prisma.student.findUnique({
      where: { id: params.id },
    });

    if (!student || student.classId !== classId) {
      return NextResponse.json(
        { error: "Student not found in your class" },
        { status: 404 }
      );
    }

    await prisma.user.delete({
      where: { id: student.userId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting student:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete student" },
      { status: 500 }
    );
  }
}
