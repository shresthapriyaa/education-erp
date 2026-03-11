import { NextRequest, NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

type Params = { params: Promise<{ id: string }> };

const SCHOOL_SELECT = {
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
} as const;

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const school = await prisma.school.findUnique({
      where: { id },
      select: SCHOOL_SELECT,
    });
    if (!school) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }
    return NextResponse.json(school);
  } catch (error: any) {
    console.error("[SCHOOL_ID_GET]", error.message);
    return NextResponse.json(
      { error: "Failed to fetch school" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const body = await req.json();

    const school = await prisma.school.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name.trim() }),
        ...(body.address !== undefined && { address: body.address || null }),
        ...(body.latitude !== undefined && { latitude: Number(body.latitude) }),
        ...(body.longitude !== undefined && {
          longitude: Number(body.longitude),
        }),
        ...(body.radiusMeters !== undefined && {
          radiusMeters: Number(body.radiusMeters),
        }),
      },
      select: SCHOOL_SELECT,
    });

    return NextResponse.json(school);
  } catch (error: any) {
    console.error("[SCHOOL_ID_PATCH]", error.message);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    await prisma.school.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[SCHOOL_ID_DELETE]", error.message);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
