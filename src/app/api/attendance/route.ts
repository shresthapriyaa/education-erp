// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/core/lib/prisma";
// import { Prisma } from "@/generated/prisma/browser";

// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = req.nextUrl;
//     const status = searchParams.get("status") ?? undefined;
//     const from = searchParams.get("from") ?? undefined;
//     const to = searchParams.get("to") ?? undefined;
//     const classId = searchParams.get("classId") ?? undefined;
//     const search = searchParams.get("search") ?? undefined;
//     const pageSize = searchParams.get("pageSize")
//       ? parseInt(searchParams.get("pageSize")!)
//       : undefined;

//     const where: Prisma.AttendanceWhereInput = {};

//     if (status && status !== "ALL") {
//       where.status = status as Prisma.EnumAttendanceStatusFilter;
//     }
//     if (from || to) {
//       where.date = {
//         ...(from ? { gte: new Date(from) } : {}),
//         ...(to
//           ? { lte: new Date(new Date(to).setHours(23, 59, 59, 999)) }
//           : {}),
//       };
//     }
//     if (classId) {
//       where.student = { classId };
//     }
//     if (search) {
//       where.student = {
//         ...((where.student as object) ?? {}),
//         OR: [
//           { username: { contains: search, mode: "insensitive" } },
//           { class: { name: { contains: search, mode: "insensitive" } } },
//         ],
//       };
//     }

//     const [records, total, present, absent, late, excused] = await Promise.all([
//       prisma.attendance.findMany({
//         where,
//         orderBy: { date: "desc" },
//         ...(pageSize ? { take: pageSize } : {}),
//         include: {
//           student: {
//             select: {
//               id: true,
//               username: true,
//               email: true,
//               class: { select: { id: true, name: true } },
//             },
//           },
//         },
//       }),
//       prisma.attendance.count({ where }),
//       prisma.attendance.count({ where: { ...where, status: "PRESENT" } }),
//       prisma.attendance.count({ where: { ...where, status: "ABSENT" } }),
//       prisma.attendance.count({ where: { ...where, status: "LATE" } }),
//       prisma.attendance.count({ where: { ...where, status: "EXCUSED" } }),
//     ]);

//     return NextResponse.json({
//       records,
//       stats: { total, present, absent, late, excused },
//       total,
//     });
//   } catch (err) {
//     console.error("[GET /api/admin/attendance]", err);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 },
//     );
//   }
// }
// export async function POST(req: NextRequest) {
//   try {
//     const { classId, date, records } = await req.json();

//     if (!classId || !date || !Array.isArray(records)) {
//       return NextResponse.json(
//         { error: "classId, date, and records are required" },
//         { status: 400 },
//       );
//     }

//     const attendanceDate = new Date(date);

//     const results = await Promise.all(
//       records.map(
//         ({ studentId, status }: { studentId: string; status: string }) =>
//           prisma.attendance.upsert({
//             where: {
//               studentId_date_classId: {
//                 studentId,
//                 date: attendanceDate,
//                 classId,
//               },
//             },
//             update: { status: status as any },
//             create: {
//               studentId,
//               classId,
//               status: status as any,
//               date: attendanceDate,
//             },
//           }),
//       ),
//     );

//     return NextResponse.json({ success: true, count: results.length });
//   } catch (err: any) {
//     console.error("[POST /api/attendance]", err.message);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }




import { NextRequest, NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";
import { Prisma } from "@/generated/prisma/browser";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const status = searchParams.get("status") ?? undefined;
    const from = searchParams.get("from") ?? undefined;
    const to = searchParams.get("to") ?? undefined;
    const classId = searchParams.get("classId") ?? undefined;
    const search = searchParams.get("search") ?? undefined;
    const pageSize = searchParams.get("pageSize")
      ? parseInt(searchParams.get("pageSize")!)
      : undefined;

    const where: Prisma.AttendanceWhereInput = {};

    if (status && status !== "ALL") {
      where.status = status as Prisma.EnumAttendanceStatusFilter;
    }
    if (from || to) {
      where.date = {
        ...(from ? { gte: new Date(from) } : {}),
        ...(to ? { lte: new Date(new Date(to).setHours(23, 59, 59, 999)) } : {}),
      };
    }
    if (classId) {
      where.student = { classId };
    }
    if (search) {
      where.student = {
        ...((where.student as object) ?? {}),
        OR: [
          { username: { contains: search, mode: "insensitive" } },
          { class: { name: { contains: search, mode: "insensitive" } } },
        ],
      };
    }

    const [records, total, present, absent, late, excused] = await Promise.all([
      prisma.attendance.findMany({
        where,
        orderBy: { date: "desc" },
        ...(pageSize ? { take: pageSize } : {}),
        include: {
          student: {
            select: {
              id: true,
              username: true,
              email: true,
              class: { select: { id: true, name: true } },
            },
          },
        },
      }),
      prisma.attendance.count({ where }),
      prisma.attendance.count({ where: { ...where, status: "PRESENT" } }),
      prisma.attendance.count({ where: { ...where, status: "ABSENT" } }),
      prisma.attendance.count({ where: { ...where, status: "LATE" } }),
      prisma.attendance.count({ where: { ...where, status: "EXCUSED" } }),
    ]);

    return NextResponse.json({
      records,
      stats: { total, present, absent, late, excused },
      total,
    });
  } catch (err) {
    console.error("[GET /api/attendance]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { classId, date, records } = await req.json();

    if (!classId || !date || !Array.isArray(records)) {
      return NextResponse.json(
        { error: "classId, date, and records are required" },
        { status: 400 }
      );
    }

    const attendanceDate = new Date(date);
    const dateLabel = attendanceDate.toDateString();

    // 1. Upsert all attendance records
    const results = await Promise.all(
      records.map(
        ({ studentId, status }: { studentId: string; status: string }) =>
          prisma.attendance.upsert({
            where: {
              studentId_date_classId: { studentId, date: attendanceDate, classId },
            },
            update: { status: status as any },
            create: {
              studentId,
              classId,
              status: status as any,
              date: attendanceDate,
            },
          })
      )
    );

    // 2. Collect absent student IDs
    const absentIds = records
      .filter((r: any) => r.status === "ABSENT")
      .map((r: any) => r.studentId);

    if (absentIds.length > 0) {
      // 3. Fetch absent students WITH their userId (User.id) and parent
      const absentStudents = await prisma.student.findMany({
        where: { id: { in: absentIds } },
        select: {
          id: true,
          username: true,
          userId: true,        // ← Student's own User.id (for senderId)
          parent: {
            select: {
              userId: true,    // ← Parent's User.id (for receiverId)
              phone: true,
            },
          },
        },
      });

      // 4. Send in-app message to each parent who is linked
      const notifyPromises = absentStudents
        .filter((s) => s.parent?.userId)
        .map((s) =>
          prisma.message.create({
            data: {
              senderId:   s.userId,           // ✅ Student's User.id
              receiverId: s.parent!.userId,   // ✅ Parent's User.id
              content: `Your child ${s.username} was marked ABSENT on ${dateLabel}. Please contact the school if this is incorrect.`,
            },
          }).catch(() => null) // one failed notify won't break the whole save
        );

      await Promise.all(notifyPromises);
    }

    return NextResponse.json({ success: true, count: results.length });
  } catch (err: any) {
    console.error("[POST /api/attendance]", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}