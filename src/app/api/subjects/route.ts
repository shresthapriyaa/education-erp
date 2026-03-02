import { NextRequest, NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const subjects = await prisma.subject.findMany({
      where: search ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      } : undefined,
      orderBy: { name: "asc" },
    });
    return NextResponse.json(subjects);
  } catch (error: any) {
    console.error("[SUBJECTS_GET]", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.name || !body.description) {
      return NextResponse.json({ error: "Missing: name, description" }, { status: 400 });
    }

    const subject = await prisma.subject.create({
      data: {
        name: body.name.trim(),
        description: body.description.trim(),
      },
    });

    return NextResponse.json(subject, { status: 201 });
  } catch (error: any) {
    console.error("[SUBJECTS_POST]", error.message);
    if (error.code === "P2002") {
      return NextResponse.json({ error: `Already exists: ${error.meta?.target}` }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}