import { NextRequest, NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const zones = await prisma.schoolZone.findMany({
      where: search ? {
        OR: [
          { name:   { contains: search, mode: "insensitive" } },
          { school: { name: { contains: search, mode: "insensitive" } } },
        ],
      } : undefined,
      include: {
        school: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(zones);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { schoolId, name, description, latitude, longitude, radiusMeters, color, isActive } = body;

    if (!schoolId || !name || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: "schoolId, name, latitude and longitude are required" },
        { status: 400 }
      );
    }

    const schoolExists = await prisma.school.findUnique({ where: { id: schoolId } });
    if (!schoolExists) return NextResponse.json({ error: "School not found" }, { status: 404 });

    const zone = await prisma.schoolZone.create({
      data: {
        schoolId,
        name,
        description,
        latitude:     parseFloat(latitude),
        longitude:    parseFloat(longitude),
        radiusMeters: parseFloat(radiusMeters ?? 100),
        color,
        isActive:     isActive ?? true,
      },
      include: {
        school: { select: { id: true, name: true } },
      },
    });
    return NextResponse.json(zone, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}