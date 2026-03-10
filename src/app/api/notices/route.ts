import { NextRequest, NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const notices = await prisma.notice.findMany({
      where: search ? {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
        ],
      } : undefined,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(notices);
  } catch (error: any) {
    console.error("[NOTICES_GET]", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.title || !body.content) {
      return NextResponse.json({ error: "Missing: title, content" }, { status: 400 });
    }
    const notice = await prisma.notice.create({
      data: { title: body.title.trim(), content: body.content.trim() },
    });
    return NextResponse.json(notice, { status: 201 });
  } catch (error: any) {
    console.error("[NOTICES_POST]", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}