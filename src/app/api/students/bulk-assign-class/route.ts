import { NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

export async function POST(req: Request) {
  try {
    const { studentIds, classId } = await req.json();

    if (!studentIds?.length || !classId) {
      return NextResponse.json(
        { error: "Missing studentIds or classId" },
        { status: 400 }
      );
    }

    await prisma.student.updateMany({
      where: { id: { in: studentIds } },
      data: { classId },
    });

    return NextResponse.json({ success: true, updated: studentIds.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}