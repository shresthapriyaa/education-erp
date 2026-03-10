import { NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const existing = await prisma.notice.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Notice not found" }, { status: 404 });
    const notice = await prisma.notice.update({
      where: { id },
      data: { title: body.title?.trim(), content: body.content?.trim() },
    });
    return NextResponse.json(notice);
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const existing = await prisma.notice.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Notice not found" }, { status: 404 });
    const data: any = {};
    if (body.title !== undefined) data.title = body.title.trim();
    if (body.content !== undefined) data.content = body.content.trim();
    const notice = await prisma.notice.update({ where: { id }, data });
    return NextResponse.json(notice);
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const existing = await prisma.notice.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Notice not found" }, { status: 404 });
    await prisma.notice.delete({ where: { id } });
    return NextResponse.json({ message: "Notice deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}