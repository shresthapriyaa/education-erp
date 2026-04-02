import { NextRequest, NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const schools = await prisma.school.findMany({
      where: search
        ? {
            name: { contains: search, mode: "insensitive" },
          }
        : undefined,
      select: {
        id: true,
        name: true,
        address: true,
        latitude: true,
        longitude: true,
        radiusMeters: true,
        createdAt: true,
        _count: {
          select: { zones: true, sessions: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(schools);
  } catch (error: any) {
    console.error("[SCHOOLS_GET]", error.message);
    return NextResponse.json(
      { error: "Failed to fetch schools" },
      { status: 500 },
    );
  }
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const missing = ["name", "latitude", "longitude"].filter(
      (f) => body[f] === undefined || body[f] === null || body[f] === "",
    );
    if (missing.length) {
      return NextResponse.json(
        { error: `Missing: ${missing.join(", ")}` },
        { status: 400 },
      );
    }

    const school = await prisma.school.create({
      data: {
        name: body.name.trim(),
        address: body.address || null,
        latitude: Number(body.latitude),
        longitude: Number(body.longitude),
        radiusMeters: body.radiusMeters ? Number(body.radiusMeters) : 200,
      },
      select: {
        id: true,
        name: true,
        address: true,
        latitude: true,
        longitude: true,
        radiusMeters: true,
        createdAt: true,
        _count: {
          select: { zones: true, sessions: true },
        },
      },
    });

    return NextResponse.json(school, { status: 201 });
  } catch (error: any) {
    console.error("[SCHOOLS_POST]", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
