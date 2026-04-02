// src/app/api/admin/attendance/geofence/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/core/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const school = await prisma.school.findFirst({
      select: {
        id: true, name: true,
        latitude: true, longitude: true,
        radiusMeters: true,
        minRadiusMeters: true,
        maxRadiusMeters: true,
        lateThresholdMin: true,
      },
    });
    if (!school) return NextResponse.json({ error: "School not found" }, { status: 404 });
    return NextResponse.json(school);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { latitude, longitude, radiusMeters, minRadiusMeters, maxRadiusMeters, lateThresholdMin } = await req.json();
    const school = await prisma.school.findFirst({ select: { id: true } });
    if (!school) return NextResponse.json({ error: "School not found" }, { status: 404 });

    const updated = await prisma.school.update({
      where: { id: school.id },
      data: {
        ...(latitude         !== undefined ? { latitude }         : {}),
        ...(longitude        !== undefined ? { longitude }        : {}),
        ...(radiusMeters     !== undefined ? { radiusMeters }     : {}),
        ...(minRadiusMeters  !== undefined ? { minRadiusMeters }  : {}),
        ...(maxRadiusMeters  !== undefined ? { maxRadiusMeters }  : {}),
        ...(lateThresholdMin !== undefined ? { lateThresholdMin } : {}),
      },
      select: {
        id: true, name: true,
        latitude: true, longitude: true,
        radiusMeters: true,
        minRadiusMeters: true,
        maxRadiusMeters: true,
        lateThresholdMin: true,
      },
    });
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}