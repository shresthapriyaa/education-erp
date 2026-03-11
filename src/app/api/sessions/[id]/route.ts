import { NextRequest, NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

type Params = { params: Promise<{ id: string }> };

const SESSION_SELECT = {
  id:        true,
  date:      true,
  startTime: true,
  endTime:   true,
  isOpen:    true,
  createdAt: true,
  class:  { select: { id: true, name: true } },
  school: { select: { id: true, name: true } },
  _count: { select: { attendance: true } },
} as const;

// ── GET /api/sessions/[id] ────────────────────────────────────────────────────
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const session = await prisma.session.findUnique({
      where: { id },
      select: SESSION_SELECT,
    });
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    return NextResponse.json(session);
  } catch (error: any) {
    console.error("[SESSION_ID_GET]", error.message);
    return NextResponse.json({ error: "Failed to fetch session" }, { status: 500 });
  }
}

// ── PATCH /api/sessions/[id] ──────────────────────────────────────────────────
export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const body = await req.json();

    const session = await prisma.session.update({
      where: { id },
      data: {
        ...(body.classId   !== undefined && { classId:   body.classId }),
        ...(body.schoolId  !== undefined && { schoolId:  body.schoolId }),
        ...(body.date      !== undefined && { date:      new Date(body.date) }),
        ...(body.startTime !== undefined && { startTime: new Date(body.startTime) }),
        ...(body.endTime   !== undefined && {
          endTime: body.endTime ? new Date(body.endTime) : null,
        }),
        ...(body.isOpen !== undefined && { isOpen: body.isOpen }),
      },
      select: SESSION_SELECT,
    });

    return NextResponse.json(session);
  } catch (error: any) {
    console.error("[SESSION_ID_PATCH]", error.message);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ── DELETE /api/sessions/[id] ─────────────────────────────────────────────────
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    await prisma.session.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[SESSION_ID_DELETE]", error.message);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}