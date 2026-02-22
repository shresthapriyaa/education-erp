import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/core/lib/prisma";

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        address: true,
        img: true,
        bloodGroup: true,
        sex: true,
        dateOfBirth: true,
        createdAt: true,
      },
    });
    return NextResponse.json(students);
  } catch (error: any) {
    console.error("[STUDENT_GET]", error.message);
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.username || !body.email || !body.password || !body.sex) {
      const missing = ["username", "email", "password", "sex"].filter((f) => !body[f]);
      return NextResponse.json({ error: `Missing: ${missing.join(", ")}` }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const student = await prisma.student.create({
      data: {
        username: body.username,
        email: body.email,
        phone: body.phone || null,
        address: body.address || null,
        img: body.img || null,
        bloodGroup: body.bloodGroup || null,
        sex: body.sex,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
        user: {
          create: {
            username: body.username,
            email: body.email,
            password: hashedPassword,
            role: "STUDENT",
          },
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        address: true,
        img: true,
        bloodGroup: true,
        sex: true,
        dateOfBirth: true,
      },
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error: any) {
    console.error("[STUDENT_POST]", error.message);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: `Already exists: ${error.meta?.target}` },
        { status: 409 }
      );
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}