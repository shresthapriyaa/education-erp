// // import { NextRequest, NextResponse } from "next/server";
// // import prisma from "@/core/lib/prisma";


// // export async function GET(req: NextRequest) {
// //   try {
// //     const { searchParams } = new URL(req.url);
// //     const classId  = searchParams.get("classId")  || "";
// //     const schoolId = searchParams.get("schoolId") || "";
// //     const open     = searchParams.get("open");

// //     const sessions = await prisma.session.findMany({
// //       where: {
// //         ...(classId  && { classId }),
// //         ...(schoolId && { schoolId }),
// //         ...(open !== null && { isOpen: open === "true" }),
// //       },
// //       select: {
// //         id:        true,
// //         date:      true,
// //         startTime: true,
// //         endTime:   true,
// //         isOpen:    true,
// //         createdAt: true,
// //         class:  { select: { id: true, name: true } },
// //         school: { select: { id: true, name: true } },
// //         _count: { select: { attendance: true } },
// //       },
// //       orderBy: { date: "desc" },
// //     });

// //     return NextResponse.json(sessions);
// //   } catch (error: any) {
// //     console.error("[SESSIONS_GET]", error.message);
// //     return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
// //   }
// // }


// // export async function POST(req: NextRequest) {
// //   try {
// //     const body = await req.json();

// //     const missing = ["classId", "schoolId", "date", "startTime"].filter(f => !body[f]);
// //     if (missing.length) {
// //       return NextResponse.json({ error: `Missing: ${missing.join(", ")}` }, { status: 400 });
// //     }

// //     const session = await prisma.session.create({
// //       data: {
// //         classId:   body.classId,
// //         schoolId:  body.schoolId,
// //         date:      new Date(body.date),
// //         startTime: new Date(body.startTime),
// //         endTime:   body.endTime ? new Date(body.endTime) : null,
// //         isOpen:    body.isOpen ?? false,
// //       },
// //       select: {
// //         id:        true,
// //         date:      true,
// //         startTime: true,
// //         endTime:   true,
// //         isOpen:    true,
// //         createdAt: true,
// //         class:  { select: { id: true, name: true } },
// //         school: { select: { id: true, name: true } },
// //         _count: { select: { attendance: true } },
// //       },
// //     });

// //     return NextResponse.json(session, { status: 201 });
// //   } catch (error: any) {
// //     console.error("[SESSIONS_POST]", error.message);
// //     if (error.code === "P2003") {
// //       return NextResponse.json({ error: "Invalid classId or schoolId" }, { status: 400 });
// //     }
// //     return NextResponse.json({ error: error.message }, { status: 500 });
// //   }
// // }




// // import { NextRequest, NextResponse } from "next/server";
// // import  prisma  from "@/core/lib/prisma";
// // import { getServerSession } from "next-auth";
// // import { authOptions } from "@/core/lib/auth";

// // export async function GET(req: NextRequest) {
// //   const session = await getServerSession(authOptions);
// //   if (!session || !["ADMIN", "TEACHER"].includes(session.user.role)) {
// //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
// //   }
// //   try {
// //     const where: any = {};
// //     if (session.user.role === "TEACHER") {
// //       const teacher = await prisma.teacher.findUnique({
// //         where:  { userId: session.user.id },
// //         select: { id: true },
// //       });
// //       if (!teacher) return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
// //       where.class = { teacherId: teacher.id };
// //     }
// //     const sessions = await prisma.session.findMany({
// //       where,
// //       orderBy: { startTime: "desc" },
// //       select: {
// //         id: true, date: true, startTime: true,
// //         endTime: true, isOpen: true, createdAt: true,
// //         class:  { select: { id: true, name: true } },
// //         school: { select: { id: true, name: true } },
// //         _count: { select: { attendance: true } },
// //       },
// //     });
// //     return NextResponse.json({ sessions, total: sessions.length });
// //   } catch (error: any) {
// //     console.error("[SESSIONS_GET]", error.message);
// //     return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
// //   }
// // }

// // export async function POST(req: NextRequest) {
// //   const session = await getServerSession(authOptions);
// //   if (!session || !["ADMIN", "TEACHER"].includes(session.user.role)) {
// //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
// //   }
// //   try {
// //     const { classId, schoolId, date, startTime, endTime, isOpen } = await req.json();
// //     if (!classId || !schoolId || !date || !startTime) {
// //       return NextResponse.json(
// //         { error: "classId, schoolId, date, startTime required" },
// //         { status: 400 }
// //       );
// //     }
// //     const record = await prisma.session.create({
// //       data: {
// //         classId, schoolId,
// //         date:      new Date(date),
// //         startTime: new Date(startTime),
// //         endTime:   endTime ? new Date(endTime) : null,
// //         isOpen:    isOpen ?? false,
// //       },
// //     });
// //     return NextResponse.json(record, { status: 201 });
// //   } catch (error: any) {
// //     console.error("[SESSIONS_POST]", error.message);
// //     return NextResponse.json({ error: error.message }, { status: 500 });
// //   }
// // }




// // src/app/api/admin/attendance/[id]/route.ts

// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/core/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/core/lib/auth";

// export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
//   const session = await getServerSession(authOptions);
//   if (!session || session.user.role !== "ADMIN") {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }
//   try {
//     const { status } = await req.json();
//     const valid = ["PRESENT", "ABSENT", "LATE", "EXCUSED"];
//     if (!valid.includes(status)) {
//       return NextResponse.json({ error: "Invalid status" }, { status: 400 });
//     }
//     const updated = await prisma.attendance.update({
//       where: { id: params.id },
//       data:  { status },
//     });
//     return NextResponse.json(updated);
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
//   const session = await getServerSession(authOptions);
//   if (!session || session.user.role !== "ADMIN") {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }
//   try {
//     await prisma.attendance.delete({ where: { id: params.id } });
//     return NextResponse.json({ success: true });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }









import { NextRequest, NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/core/lib/auth";

const SESSION_SELECT = {
  id: true, date: true, startTime: true,
  endTime: true, isOpen: true, createdAt: true,
  radiusMeters: true, lateThresholdMin: true,
  class:   { select: { id: true, name: true } },
  school:  { select: { id: true, name: true } },
  teacher: { select: { id: true, username: true } },
  _count:  { select: { attendance: true } },
} as const;

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "TEACHER"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const where: any = {};

    if (session.user.role === "TEACHER") {
      const teacher = await prisma.teacher.findUnique({
        where:  { userId: session.user.id },
        select: { id: true },
      });
      if (!teacher) return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
      where.teacherId = teacher.id;
    }

    const { searchParams } = new URL(req.url);
    const classId = searchParams.get("classId");
    const isOpen  = searchParams.get("isOpen");
    if (classId) where.classId = classId;
    if (isOpen !== null) where.isOpen = isOpen === "true";

    const sessions = await prisma.session.findMany({
      where,
      orderBy: { startTime: "desc" },
      select:  SESSION_SELECT,
    });
    return NextResponse.json({ sessions, total: sessions.length });
  } catch (error: any) {
    console.error("[SESSIONS_GET]", error.message);
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "TEACHER"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { classId, schoolId, date, startTime, endTime, isOpen, radiusMeters, lateThresholdMin } = await req.json();
    if (!classId || !schoolId || !date || !startTime) {
      return NextResponse.json({ error: "classId, schoolId, date, startTime are required" }, { status: 400 });
    }

    let teacherId: string | undefined;
    if (session.user.role === "TEACHER") {
      const teacher = await prisma.teacher.findUnique({
        where:  { userId: session.user.id },
        select: { id: true },
      });
      if (!teacher) return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
      teacherId = teacher.id;
    }

    const record = await prisma.session.create({
      data: {
        classId, schoolId,
        date:             new Date(date),
        startTime:        new Date(startTime),
        endTime:          endTime ? new Date(endTime) : null,
        isOpen:           isOpen ?? true,
        radiusMeters:     radiusMeters ?? 100,
        lateThresholdMin: lateThresholdMin ?? 10,
        ...(teacherId ? { teacherId } : {}),
      },
      select: SESSION_SELECT,
    });
    return NextResponse.json(record, { status: 201 });
  } catch (error: any) {
    console.error("[SESSIONS_POST]", error.message);
    if (error.code === "P2003") return NextResponse.json({ error: "Invalid classId or schoolId" }, { status: 400 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
