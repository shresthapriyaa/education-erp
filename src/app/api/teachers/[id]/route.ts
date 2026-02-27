import { NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: {
        classes: { select: { id: true, name: true } },
        user: { select: { id: true, username: true, email: true, role: true, isVerified: true } },
      },
    });
    if (!teacher) return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    return NextResponse.json(teacher);
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
    const { username, email, password, phone, address, img } = body;

    const existing = await prisma.teacher.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Teacher not found" }, { status: 404 });

    if (email && email !== existing.email) {
      const emailExists = await prisma.teacher.findUnique({ where: { email } });
      if (emailExists) return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 12) : undefined;

    const teacher = await prisma.teacher.update({
      where: { id },
      data: {
        username,
        email,
        phone: phone?.trim() || null,
        address: address?.trim() || null,
        img: img?.trim() || null,
        user: {
          update: {
            username,
            email,
            ...(hashedPassword && { password: hashedPassword }),
          },
        },
      },
      include: {
        classes: { select: { id: true, name: true } },
        user: { select: { id: true, username: true, email: true, role: true, isVerified: true } },
      },
    });

    return NextResponse.json(teacher);
  } catch (error: any) {
    console.error("[TEACHER_PUT]", error.message);
    if (error.code === "P2002") {
      return NextResponse.json({ error: `Already exists: ${error.meta?.target}` }, { status: 409 });
    }
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

    const existing = await prisma.teacher.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Teacher not found" }, { status: 404 });

    const hashedPassword = body.password ? await bcrypt.hash(body.password, 12) : undefined;

    const data: any = {};
    if (body.username !== undefined) data.username = body.username;
    if (body.email !== undefined) data.email = body.email;
    if (body.phone !== undefined) data.phone = body.phone?.trim() || null;
    if (body.address !== undefined) data.address = body.address?.trim() || null;
    if (body.img !== undefined) data.img = body.img?.trim() || null;

    const userUpdate: any = {};
    if (body.username !== undefined) userUpdate.username = body.username;
    if (body.email !== undefined) userUpdate.email = body.email;
    if (hashedPassword) userUpdate.password = hashedPassword;
    if (Object.keys(userUpdate).length > 0) data.user = { update: userUpdate };

    const teacher = await prisma.teacher.update({
      where: { id },
      data,
      include: {
        classes: { select: { id: true, name: true } },
        user: { select: { id: true, username: true, email: true, role: true, isVerified: true } },
      },
    });

    return NextResponse.json(teacher);
  } catch (error: any) {
    console.error("[TEACHER_PATCH]", error.message);
    if (error.code === "P2002") {
      return NextResponse.json({ error: `Already exists: ${error.meta?.target}` }, { status: 409 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const teacher = await prisma.teacher.findUnique({ where: { id } });
    if (!teacher) return NextResponse.json({ error: "Teacher not found" }, { status: 404 });

    await prisma.teacher.delete({ where: { id } });
    if (teacher.userId) await prisma.user.delete({ where: { id: teacher.userId } });

    return NextResponse.json({ message: "Teacher deleted successfully" });
  } catch (error: any) {
    console.error("[TEACHER_DELETE]", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}