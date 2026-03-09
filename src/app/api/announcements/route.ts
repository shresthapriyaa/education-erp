import { NextRequest, NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const announcements = await prisma.announcement.findMany({
      where: search ? {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
        ],
      } : undefined,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(announcements);
  } catch (error: any) {
    console.error("[ANNOUNCEMENTS_GET]", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.title || !body.content) {
      return NextResponse.json({ error: "Missing: title, content" }, { status: 400 });
    }

    const announcement = await prisma.announcement.create({
      data: {
        title: body.title.trim(),
        content: body.content.trim(),
        publishDate: body.publishDate ? new Date(body.publishDate) : null, 
      },
    });

    return NextResponse.json(announcement, { status: 201 });
  } catch (error: any) {
    console.error("[ANNOUNCEMENTS_POST]", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}