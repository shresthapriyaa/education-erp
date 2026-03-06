import { NextRequest, NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const events = await prisma.event.findMany({
      where: search ? {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      } : undefined,
      orderBy: { eventDate: "asc" },
    });
    return NextResponse.json(events);
  } catch (error: any) {
    console.error("[EVENTS_GET]", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.title || !body.description || !body.eventDate) {
      return NextResponse.json({ error: "Missing: title, description, eventDate" }, { status: 400 });
    }

    const event = await prisma.event.create({
      data: {
        title: body.title.trim(),
        description: body.description.trim(),
        eventDate: new Date(body.eventDate),
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error: any) {
    console.error("[EVENTS_POST]", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}