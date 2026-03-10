

import { PrismaClient } from "@/generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";


const prisma = new PrismaClient();
type Ctx = { params: Promise<{ id: string }> };

const INCLUDE = {
  student: { select: { id: true, username: true, email: true } },
  session: {
    include: {
      class:  { select: { id: true, name: true } },
      school: {
        select: {
          id: true, name: true, address: true,
          latitude: true, longitude: true, radiusMeters: true,
        },
      },
    },
  },
  detectedZone: { select: { id: true, name: true, color: true } },
} as const;

function toDTO(r: any) {
  return {
    id:                 r.id,
    status:             r.status,
    date:               r.date.toISOString(),
    markedAt:           r.createdAt.toISOString(),
    markedLatitude:     r.markedLatitude,
    markedLongitude:    r.markedLongitude,
    distanceFromCenter: r.distanceFromCenter,
    distanceFromZone:   r.distanceFromZone,
    withinSchool:       r.withinSchool,
    gpsAccuracy:        r.gpsAccuracy,
    deviceInfo:         r.deviceInfo,
    ipAddress:          r.ipAddress,
    detectedZone:       r.detectedZone ?? null,
    student:            r.student,
    session: r.session
      ? {
          id:        r.session.id,
          date:      r.session.date.toISOString(),
          startTime: r.session.startTime.toISOString(),
          class:     r.session.class,
          school:    r.session.school,
        }
      : null,
  };
}

// ─── GET ──────────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    const userId = req.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const record = await prisma.attendance.findUnique({
      where:   { id },
      include: INCLUDE,
    });

    if (!record)
      return NextResponse.json({ error: "Record not found." }, { status: 404 });

    // Student can only see their own record
    // TODO: replace with real role check
    const student = await prisma.student.findUnique({
      where:  { userId },
      select: { id: true },
    });
    const isOwner = student?.id === record.studentId;
    if (!isOwner /* && !isAdmin */)
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });

    return NextResponse.json(toDTO(record));

  } catch (err) {
    console.error("[GET /api/attendance/:id]", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

// ─── PATCH ────────────────────────────────────────────────────────────────────
export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    const userId = req.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // TODO: check ADMIN role

    const body    = await req.json();
    const updates: Record<string, any> = {};
    if (body.status) updates.status = body.status;

    if (!Object.keys(updates).length)
      return NextResponse.json({ error: "No valid fields to update." }, { status: 400 });

    const record = await prisma.attendance.update({
      where:   { id },
      data:    updates,
      include: INCLUDE,
    });

    return NextResponse.json(toDTO(record));

  } catch (err) {
    console.error("[PATCH /api/attendance/:id]", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

// ─── DELETE ───────────────────────────────────────────────────────────────────
export async function DELETE(req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    const userId = req.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // TODO: check ADMIN role

    await prisma.attendance.delete({ where: { id } });
    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("[DELETE /api/attendance/:id]", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}