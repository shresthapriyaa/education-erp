import { NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const announcement = await prisma.announcement.findUnique({ where: { id } });
    if (!announcement)
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
    return NextResponse.json(announcement);
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

    const existing = await prisma.announcement.findUnique({ where: { id } });
    if (!existing)
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 });

    const announcement = await prisma.announcement.update({
      where: { id },
      data: {
        title: body.title?.trim(),
        content: body.content?.trim(),
        publishDate: body.publishDate ? new Date(body.publishDate) : null, // ✅
      },
    });

    return NextResponse.json(announcement);
  } catch (error: any) {
    console.error("[ANNOUNCEMENT_PUT]", error.message);
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

    const existing = await prisma.announcement.findUnique({ where: { id } });
    if (!existing)
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 });

    const data: any = {};
    if (body.title !== undefined) data.title = body.title.trim();
    if (body.content !== undefined) data.content = body.content.trim();
    if (body.publishDate !== undefined)
      data.publishDate = body.publishDate ? new Date(body.publishDate) : null; // ✅

    const announcement = await prisma.announcement.update({ where: { id }, data });
    return NextResponse.json(announcement);
  } catch (error: any) {
    console.error("[ANNOUNCEMENT_PATCH]", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await prisma.announcement.findUnique({ where: { id } });
    if (!existing)
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 });

    await prisma.announcement.delete({ where: { id } });
    return NextResponse.json({ message: "Announcement deleted successfully" });
  } catch (error: any) {
    console.error("[ANNOUNCEMENT_DELETE]", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}