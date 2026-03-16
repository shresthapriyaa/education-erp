import { NextRequest, NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const zone = await prisma.schoolZone.findUnique({
      where: { id },
      include: { school: { select: { id: true, name: true } } },
    });
    if (!zone) return NextResponse.json({ error: "Zone not found" }, { status: 404 });
    return NextResponse.json(zone);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.schoolZone.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Zone not found" }, { status: 404 });

    const zone = await prisma.schoolZone.update({
      where: { id },
      data: {
        schoolId:     body.schoolId,
        name:         body.name,
        description:  body.description,
        latitude:     body.latitude     !== undefined ? parseFloat(body.latitude)     : undefined,
        longitude:    body.longitude    !== undefined ? parseFloat(body.longitude)    : undefined,
        radiusMeters: body.radiusMeters !== undefined ? parseFloat(body.radiusMeters) : undefined,
        color:        body.color,
        isActive:     body.isActive,
      },
      include: { school: { select: { id: true, name: true } } },
    });
    return NextResponse.json(zone);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await prisma.schoolZone.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Zone not found" }, { status: 404 });

    await prisma.schoolZone.delete({ where: { id } });
    return NextResponse.json({ message: "Zone deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}