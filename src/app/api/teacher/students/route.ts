import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/core/lib/auth";
import prisma from "@/core/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const teacher = await prisma.teacher.findUnique({
      where: { email: session.user.email },
      include: {
        classTeacherFor: {
          include: {
            students: {
              include: {
                class: true,
                parent: true,
              },
            },
          },
        },
      },
    });

    if (!teacher || teacher.classTeacherFor.length === 0) {
      return NextResponse.json(
        { error: "You are not a class teacher for any class" },
        { status: 403 }
      );
    }

    const classInfo = teacher.classTeacherFor[0];
    const students = classInfo.students;

    return NextResponse.json({
      students,
      classInfo: { id: classInfo.id, name: classInfo.name },
    });
  } catch (error: any) {
    console.error("Error fetching teacher students:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch students" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
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
    const body = await req.json();
    const { username, email, password, sex, phone, address, bloodGroup, dateOfBirth } = body;

    if (!username || !email || !password || !sex) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: "STUDENT",
        isVerified: true,
      },
    });

    const student = await prisma.student.create({
      data: {
        username,
        email,
        userId: user.id,
        sex,
        phone: phone || null,
        address: address || null,
        bloodGroup: bloodGroup || null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        classId,
      },
      include: {
        class: true,
        parent: true,
      },
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error: any) {
    console.error("Error creating student:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create student" },
      { status: 500 }
    );
  }
}
