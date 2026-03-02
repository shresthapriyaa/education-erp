import { NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const c = await prisma.class.findUnique({
      where: { id },
      include: { teacher: { select: { id: true, username: true, email: true } } },
    });
    if (!c) return NextResponse.json({ error: "Class not found" }, { status: 404 });
    return NextResponse.json(c);
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.class.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Class not found" }, { status: 404 });

    if (body.teacherId) {
      const teacherExists = await prisma.teacher.findUnique({ where: { id: body.teacherId } });
      if (!teacherExists) return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    const updated = await prisma.class.update({
      where: { id },
      data: {
        name: body.name?.trim(),
        teacherId: body.teacherId,
      },
      include: { teacher: { select: { id: true, username: true, email: true } } },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("[CLASS_PUT]", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.class.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Class not found" }, { status: 404 });

    const data: any = {};
    if (body.name !== undefined) data.name = body.name.trim();
    if (body.teacherId !== undefined) data.teacherId = body.teacherId;

    const updated = await prisma.class.update({
      where: { id },
      data,
      include: { teacher: { select: { id: true, username: true, email: true } } },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("[CLASS_PATCH]", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await prisma.class.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Class not found" }, { status: 404 });

    await prisma.class.delete({ where: { id } });
    return NextResponse.json({ message: "Class deleted successfully" });
  } catch (error: any) {
    console.error("[CLASS_DELETE]", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
