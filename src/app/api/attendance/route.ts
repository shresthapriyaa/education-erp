import { NextRequest, NextResponse } from "next/server";
import {
  detectSchoolZone,
  isValidCoords,
  clampRadius,
  LATE_THRESHOLD_MIN,
  type SchoolBoundaryInput,
} from "@/core/lib/haversine";
import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient();

const STUDENT_SELECT = {
  id:       true,
  username: true,
  email:    true,
} as const;

const ATTENDANCE_INCLUDE = {
  student: { select: STUDENT_SELECT },
  session: {
    include: {
      class:  { select: { id: true, name: true } },
      school: {
        include: {
          zones: {
            where:  { isActive: true },
            select: { id: true, name: true, color: true, latitude: true, longitude: true, radiusMeters: true, isActive: true, description: true },
          },
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
          school: {
            id:           r.session.school.id,
            name:         r.session.school.name,
            address:      r.session.school.address ?? null,
            latitude:     r.session.school.latitude,
            longitude:    r.session.school.longitude,
            radiusMeters: r.session.school.radiusMeters,
            zones:        r.session.school.zones,
          },
        }
      : null,
  };
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = req.nextUrl;
    const isAdminView =
      searchParams.has("status")   ||
      searchParams.has("classId")  ||
      searchParams.has("dateFrom") ||
      searchParams.has("pageSize");

    if (isAdminView) {
      const status   = searchParams.get("status")   || undefined;
      const classId  = searchParams.get("classId")  || undefined;
      const dateFrom = searchParams.get("dateFrom") || undefined;
      const dateTo   = searchParams.get("dateTo")   || undefined;
      const search   = searchParams.get("search")   || undefined;
      const page     = parseInt(searchParams.get("page")     ?? "1");
      const pageSize = parseInt(searchParams.get("pageSize") ?? "20");

      const where: any = {};
      if (status)  where.status = status;
      if (classId) where.session = { classId };
      if (dateFrom || dateTo) {
        where.date = {
          ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
          ...(dateTo   ? { lte: new Date(dateTo)   } : {}),
        };
      }
      if (search) {
        where.student = { username: { contains: search, mode: "insensitive" } };
      }

      const [total, rows] = await Promise.all([
        prisma.attendance.count({ where }),
        prisma.attendance.findMany({
          where,
          include:  ATTENDANCE_INCLUDE,
          orderBy:  { date: "desc" },
          take:     pageSize,
          skip:     (page - 1) * pageSize,
        }),
      ]);

      const stats = await prisma.attendance.groupBy({
        by: ["status"],
        where,
        _count: { status: true },
      });
      const summary = {
        PRESENT: 0, LATE: 0, ABSENT: 0, EXCUSED: 0,
        total, attendanceRate: 0,
      };
      stats.forEach(s => {
        summary[s.status as keyof typeof summary] = s._count.status as any;
      });
      summary.attendanceRate = total > 0
        ? Math.round(((summary.PRESENT + summary.LATE) / total) * 100)
        : 0;

      return NextResponse.json({
        records: rows.map(toDTO),
        summary,
        total,
      });
    }

    const now        = new Date();
    const todayStart = new Date(new Date(now).setHours(0,  0,  0,  0));
    const todayEnd   = new Date(new Date(now).setHours(23, 59, 59, 999));

    const student = await prisma.student.findUnique({
      where:  { userId },
      select: { id: true },
    });
    if (!student) return NextResponse.json({ error: "Student not found." }, { status: 404 });

    const sessions = await prisma.session.findMany({
      where: {
        isOpen: true,
        date:   { gte: todayStart, lte: todayEnd },
      },
      include: {
        class:  { select: { id: true, name: true } },
        school: {
          include: {
            zones: {
              where:  { isActive: true },
              select: {
                id: true, name: true, description: true, color: true,
                latitude: true, longitude: true, radiusMeters: true, isActive: true,
              },
            },
          },
        },
        attendance: {
          where:   { studentId: student.id },
          include: ATTENDANCE_INCLUDE,
        },
      },
      orderBy: { startTime: "asc" },
    });

    return NextResponse.json({
      sessions: sessions.map(s => ({
        id:        s.id,
        date:      s.date.toISOString(),
        startTime: s.startTime.toISOString(),
        endTime:   s.endTime?.toISOString() ?? null,
        isOpen:    s.isOpen,
        class:     s.class,
        school: {
          id:           s.school.id,
          name:         s.school.name,
          address:      s.school.address ?? null,
          latitude:     s.school.latitude,
          longitude:    s.school.longitude,
          radiusMeters: s.school.radiusMeters,
          zones:        s.school.zones,
        },
        alreadyMarked:  s.attendance.length > 0,
        existingRecord: s.attendance[0] ? toDTO(s.attendance[0]) : null,
      })),
    });

  } catch (err) {
    console.error("[GET /api/attendance]", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { sessionId, latitude, longitude, accuracy, isManualOverride } = body;

    // ── Manual override (admin) 
    if (isManualOverride) {
      const { studentId, status } = body;

      if (!studentId || !sessionId || !status)
        return NextResponse.json(
          { success: false, error: "studentId, sessionId, status required." },
          { status: 400 }
        );

      const session = await prisma.session.findUnique({
        where:  { id: sessionId },
        select: { date: true },
      });
      if (!session)
        return NextResponse.json({ success: false, error: "Session not found." }, { status: 404 });

      // If record already exists → update instead of create
      const existing = await prisma.attendance.findUnique({
        where: { studentId_sessionId: { studentId, sessionId } },
      });

      if (existing) {
        const updated = await prisma.attendance.update({
          where:   { studentId_sessionId: { studentId, sessionId } },
          data:    { status, deviceInfo: `admin-override:${userId}` },
          include: ATTENDANCE_INCLUDE,
        });
        return NextResponse.json({ success: true, attendance: toDTO(updated) });
      }

      const record = await prisma.attendance.create({
        data: {
          studentId,
          sessionId,
          date:         session.date,
          status,
          withinSchool: false,
          deviceInfo:   `admin-override:${userId}`,
        },
        include: ATTENDANCE_INCLUDE,
      });

      return NextResponse.json({ success: true, attendance: toDTO(record) }, { status: 201 });
    }

    // ── GPS-based attendance 
    if (!sessionId || latitude == null || longitude == null)
      return NextResponse.json(
        { success: false, error: "sessionId, latitude, longitude required." },
        { status: 400 }
      );

    if (!isValidCoords({ latitude, longitude }))
      return NextResponse.json({ success: false, error: "Invalid coordinates." }, { status: 400 });

    const student = await prisma.student.findUnique({
      where:  { userId },
      select: { id: true },
    });
    if (!student)
      return NextResponse.json({ success: false, error: "Student profile not found." }, { status: 404 });

    const studentId = student.id;

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        school: {
          include: {
            zones: { where: { isActive: true } },
          },
        },
      },
    });

    if (!session)
      return NextResponse.json({ success: false, error: "Session not found." }, { status: 404 });
    if (!session.isOpen)
      return NextResponse.json({ success: false, error: "Attendance window is closed." }, { status: 400 });

    // Prevent duplicate
    const exists = await prisma.attendance.findUnique({
      where: { studentId_sessionId: { studentId, sessionId } },
    });
    if (exists)
      return NextResponse.json(
        { success: false, error: "Already marked for this session." },
        { status: 409 }
      );

    const school = session.school;
    const boundary: SchoolBoundaryInput = {
      id:           school.id,
      name:         school.name,
      center:       { latitude: school.latitude, longitude: school.longitude },
      radiusMeters: clampRadius(school.radiusMeters),
      zones: school.zones.map(z => ({
        id:           z.id,
        name:         z.name,
        center:       { latitude: z.latitude, longitude: z.longitude },
        radiusMeters: clampRadius(z.radiusMeters),
        color:        z.color ?? undefined,
      })),
    };

    const detection  = detectSchoolZone({ latitude, longitude }, boundary, accuracy ?? 0);
    const minutesLate = (Date.now() - session.startTime.getTime()) / 60_000;
    const status =
      !detection.withinSchool             ? "ABSENT"
      : minutesLate > LATE_THRESHOLD_MIN  ? "LATE"
      :                                     "PRESENT";

    const record = await prisma.attendance.create({
      data: {
        studentId,
        sessionId,
        date:               session.date,
        status,
        markedLatitude:     latitude,
        markedLongitude:    longitude,
        distanceFromCenter: detection.distanceFromCenter,
        distanceFromZone:   detection.allZones[0]?.check.distance ?? null,
        detectedZoneId:     detection.currentZone?.id ?? null,
        withinSchool:       detection.withinSchool,
        gpsAccuracy:        accuracy ?? null,
        deviceInfo:         (req.headers.get("user-agent") ?? "").slice(0, 200),
        ipAddress:          req.headers.get("x-forwarded-for") ?? "unknown",
      },
      include: ATTENDANCE_INCLUDE,
    });

    return NextResponse.json({
      success: true,
      status,
      attendance: toDTO(record),
      detection: {
        withinSchool:       detection.withinSchool,
        distanceFromCenter: detection.distanceFromCenter,
        distanceToBoundary: detection.distanceToBoundary,
        currentZone:        detection.currentZone
          ? { id: detection.currentZone.id, name: detection.currentZone.name }
          : null,
        directionToCenter:  detection.directionToCenter,
      },
    });

  } catch (err) {
    console.error("[POST /api/attendance]", err);
    return NextResponse.json({ success: false, error: "Internal server error." }, { status: 500 });
  }
}