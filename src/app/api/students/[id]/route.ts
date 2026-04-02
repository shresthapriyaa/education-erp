import { NextRequest, NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const student = await prisma.student.findUnique({
      where: { id },
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
        parent: {
          select: { id: true, username: true, email: true },
        },
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error: any) {
    console.error("[STUDENT_ID_GET]", error.message);
    return NextResponse.json(
      { error: "Failed to fetch student" },
      { status: 500 },
    );
  }
}


export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const body = await req.json();

    if (!body.username || !body.email || !body.sex) {
      const missing = ["username", "email", "sex"].filter((f) => !body[f]);
      return NextResponse.json(
        { error: `Missing: ${missing.join(", ")}` },
        { status: 400 },
      );
    }

    const cleanParentId = body.parentId?.trim() || null;

    if (cleanParentId) {
      const parentExists = await prisma.parent.findUnique({
        where: { id: cleanParentId },
        select: { id: true },
      });
      if (!parentExists) {
        return NextResponse.json(
          { error: `Parent with id "${cleanParentId}" not found.` },
          { status: 404 },
        );
      }
    }

    const student = await prisma.student.update({
      where: { id },
      data: {
        username: body.username,
        email: body.email,
        phone: body.phone || null,
        address: body.address || null,
        img: body.img || null,
        bloodGroup: body.bloodGroup || null,
        sex: body.sex,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
        parent: cleanParentId
          ? { connect: { id: cleanParentId } }
          : { disconnect: true },
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
        parent: {
          select: { id: true, username: true, email: true },
        },
      },
    });

    // Keep user table in sync
    await prisma.user
      .update({
        where: { email: body.email },
        data: { username: body.username, email: body.email },
      })
      .catch(() => {}); // non-fatal

    return NextResponse.json(student);
  } catch (error: any) {
    console.error("[STUDENT_ID_PUT]", error.message);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: `Already exists: ${error.meta?.target}` },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const body = await req.json();

    if (Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: "No fields provided" },
        { status: 400 },
      );
    }

    const cleanParentId =
      "parentId" in body ? body.parentId?.trim() || null : undefined;

    if (cleanParentId) {
      const parentExists = await prisma.parent.findUnique({
        where: { id: cleanParentId },
        select: { id: true },
      });
      if (!parentExists) {
        return NextResponse.json(
          { error: `Parent with id "${cleanParentId}" not found.` },
          { status: 404 },
        );
      }
    }

    const student = await prisma.student.update({
      where: { id },
      data: {
        ...(body.username !== undefined && { username: body.username }),
        ...(body.email !== undefined && { email: body.email }),
        ...(body.phone !== undefined && { phone: body.phone || null }),
        ...(body.address !== undefined && { address: body.address || null }),
        ...(body.img !== undefined && { img: body.img || null }),
        ...(body.bloodGroup !== undefined && {
          bloodGroup: body.bloodGroup || null,
        }),
        ...(body.sex !== undefined && { sex: body.sex }),
        ...(body.dateOfBirth !== undefined && {
          dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
        }),
        ...("parentId" in body && {
          parent: cleanParentId
            ? { connect: { id: cleanParentId } }
            : { disconnect: true },
        }),
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
        parent: {
          select: { id: true, username: true, email: true },
        },
      },
    });

    if (body.username !== undefined || body.email !== undefined) {
      await prisma.user
        .update({
          where: { email: body.email ?? student.email },
          data: {
            ...(body.username !== undefined && { username: body.username }),
            ...(body.email !== undefined && { email: body.email }),
          },
        })
        .catch(() => {}); // non-fatal
    }

    return NextResponse.json(student);
  } catch (error: any) {
    console.error("[STUDENT_ID_PATCH]", error.message);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: `Already exists: ${error.meta?.target}` },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    await prisma.student.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[STUDENT_ID_DELETE]", error.message);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
