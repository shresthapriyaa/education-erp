import { NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const parent = await prisma.parent.findUnique({
      where: { id },
      include: {
        students: { select: { id: true, username: true, email: true } },
        user: { select: { id: true, username: true, email: true, role: true, isVerified: true } },
      },
    });
    if (!parent) return NextResponse.json({ error: "Parent not found" }, { status: 404 });
    return NextResponse.json(parent);
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

    const existing = await prisma.parent.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Parent not found" }, { status: 404 });

    if (email && email !== existing.email) {
      const emailExists = await prisma.parent.findUnique({ where: { email } });
      if (emailExists) return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 12) : undefined;

    const parent = await prisma.parent.update({
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
        students: { select: { id: true, username: true, email: true } },
        user: { select: { id: true, username: true, email: true, role: true, isVerified: true } },
      },
    });

    return NextResponse.json(parent);
  } catch (error: any) {
    console.error("[PARENT_PUT]", error.message);
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

    const existing = await prisma.parent.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Parent not found" }, { status: 404 });

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

    const parent = await prisma.parent.update({
      where: { id },
      data,
      include: {
        students: { select: { id: true, username: true, email: true } },
        user: { select: { id: true, username: true, email: true, role: true, isVerified: true } },
      },
    });

    return NextResponse.json(parent);
  } catch (error: any) {
    console.error("[PARENT_PATCH]", error.message);
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
    const parent = await prisma.parent.findUnique({ where: { id } });
    if (!parent) return NextResponse.json({ error: "Parent not found" }, { status: 404 });

    await prisma.parent.delete({ where: { id } });
    if (parent.userId) await prisma.user.delete({ where: { id: parent.userId } });

    return NextResponse.json({ message: "Parent deleted successfully" });
  } catch (error: any) {
    console.error("[PARENT_DELETE]", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}