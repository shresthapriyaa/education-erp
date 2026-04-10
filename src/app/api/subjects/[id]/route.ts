import { NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const subject = await prisma.subject.findUnique({ where: { id } });
    if (!subject) return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    return NextResponse.json(subject);
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

    const existing = await prisma.subject.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Subject not found" }, { status: 404 });

    const subject = await prisma.subject.update({
      where: { id },
      data: {
        name: body.name?.trim(),
        code: body.code?.trim() || null,
        description: body.description?.trim() || null,
      },
    });

    return NextResponse.json(subject);
  } catch (error: any) {
    console.error("[SUBJECT_PUT]", error.message);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Subject code already exists" }, { status: 409 });
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

    const existing = await prisma.subject.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Subject not found" }, { status: 404 });

    const data: any = {};
    if (body.name !== undefined) data.name = body.name.trim();
    if (body.code !== undefined) data.code = body.code?.trim() || null;
    if (body.description !== undefined) data.description = body.description?.trim() || null;

    const subject = await prisma.subject.update({ where: { id }, data });
    return NextResponse.json(subject);
  } catch (error: any) {
    console.error("[SUBJECT_PATCH]", error.message);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Subject code already exists" }, { status: 409 });
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
    const subject = await prisma.subject.findUnique({ where: { id } });
    if (!subject) return NextResponse.json({ error: "Subject not found" }, { status: 404 });

    await prisma.subject.delete({ where: { id } });
    return NextResponse.json({ message: "Subject deleted successfully" });
  } catch (error: any) {
    console.error("[SUBJECT_DELETE]", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}