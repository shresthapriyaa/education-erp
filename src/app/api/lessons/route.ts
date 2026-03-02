import { NextRequest, NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const lessons = await prisma.lesson.findMany({
      where: search ? {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
        ],
      } : undefined,
      include: { materials: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(lessons);
  } catch (error: any) {
    console.error("[LESSONS_GET]", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.title || !body.content) {
      return NextResponse.json({ error: "Missing: title, content" }, { status: 400 });
    }

    const lesson = await prisma.lesson.create({
      data: {
        title: body.title.trim(),
        content: body.content.trim(),
        materials: body.materials?.length
          ? {
              create: body.materials.map((m: any) => ({
                title: m.title.trim(),
                type: m.type,
                url: m.url.trim(),
              })),
            }
          : undefined,
      },
      include: { materials: true },
    });

    return NextResponse.json(lesson, { status: 201 });
  } catch (error: any) {
    console.error("[LESSONS_POST]", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}