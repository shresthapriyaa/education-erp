import prisma from "@/core/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { status } = await req.json();

    if (!status) {
      return NextResponse.json(
        { error: "status is required" },
        { status: 400 },
      );
    }

    const updated = await prisma.attendance.update({
      where: { id },
      data: { status },
      include: {
        student: {
          select: {
            id: true,
            username: true,
            email: true,
            class: { select: { id: true, name: true } },
          },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("[PATCH /api/admin/attendance/[id]]", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await prisma.attendance.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("[DELETE /api/admin/attendance/[id]]", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
