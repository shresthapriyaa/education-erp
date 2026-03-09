import { NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const existing = await prisma.fee.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Fee not found" }, { status: 404 });
    const fee = await prisma.fee.update({
      where: { id },
      data: {
        studentId: body.studentId,
        amount: parseFloat(body.amount),
        dueDate: new Date(body.dueDate),
        paid: body.paid ?? false,
      },
      include: { student: { select: { id: true, username: true, email: true } } },
    });
    return NextResponse.json(fee);
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const existing = await prisma.fee.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Fee not found" }, { status: 404 });
    const data: any = {};
    if (body.studentId !== undefined) data.studentId = body.studentId;
    if (body.amount !== undefined) data.amount = parseFloat(body.amount);
    if (body.dueDate !== undefined) data.dueDate = new Date(body.dueDate);
    if (body.paid !== undefined) data.paid = body.paid;
    const fee = await prisma.fee.update({
      where: { id }, data,
      include: { student: { select: { id: true, username: true, email: true } } },
    });
    return NextResponse.json(fee);
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const existing = await prisma.fee.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Fee not found" }, { status: 404 });
    await prisma.fee.delete({ where: { id } });
    return NextResponse.json({ message: "Fee deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}