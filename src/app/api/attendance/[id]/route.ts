// // // // import { PrismaClient } from "@/generated/prisma/client";
// // // // import { NextRequest, NextResponse } from "next/server";


// // // // const prisma = new PrismaClient();
// // // // type Ctx = { params: Promise<{ id: string }> };

// // // // const INCLUDE = {
// // // //   student: { select: { id: true, username: true, email: true } },
// // // //   session: {
// // // //     include: {
// // // //       class:  { select: { id: true, name: true } },
// // // //       school: {
// // // //         select: {
// // // //           id: true, name: true, address: true,
// // // //           latitude: true, longitude: true, radiusMeters: true,
// // // //         },
// // // //       },
// // // //     },
// // // //   },
// // // //   detectedZone: { select: { id: true, name: true, color: true } },
// // // // } as const;

// // // // function toDTO(r: any) {
// // // //   return {
// // // //     id:                 r.id,
// // // //     status:             r.status,
// // // //     date:               r.date.toISOString(),
// // // //     markedAt:           r.createdAt.toISOString(),
// // // //     markedLatitude:     r.markedLatitude,
// // // //     markedLongitude:    r.markedLongitude,
// // // //     distanceFromCenter: r.distanceFromCenter,
// // // //     distanceFromZone:   r.distanceFromZone,
// // // //     withinSchool:       r.withinSchool,
// // // //     gpsAccuracy:        r.gpsAccuracy,
// // // //     deviceInfo:         r.deviceInfo,
// // // //     ipAddress:          r.ipAddress,
// // // //     detectedZone:       r.detectedZone ?? null,
// // // //     student:            r.student,
// // // //     session: r.session
// // // //       ? {
// // // //           id:        r.session.id,
// // // //           date:      r.session.date.toISOString(),
// // // //           startTime: r.session.startTime.toISOString(),
// // // //           class:     r.session.class,
// // // //           school:    r.session.school,
// // // //         }
// // // //       : null,
// // // //   };
// // // // }


// // // // export async function GET(req: NextRequest, { params }: Ctx) {
// // // //   try {
// // // //     const { id } = await params;
// // // //     const userId = req.headers.get("x-user-id");
// // // //     if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

// // // //     const record = await prisma.attendance.findUnique({
// // // //       where:   { id },
// // // //       include: INCLUDE,
// // // //     });

// // // //     if (!record)
// // // //       return NextResponse.json({ error: "Record not found." }, { status: 404 });

  
// // // //     const student = await prisma.student.findUnique({
// // // //       where:  { userId },
// // // //       select: { id: true },
// // // //     });
// // // //     const isOwner = student?.id === record.studentId;
// // // //     if (!isOwner /* && !isAdmin */)
// // // //       return NextResponse.json({ error: "Forbidden." }, { status: 403 });

// // // //     return NextResponse.json(toDTO(record));

// // // //   } catch (err) {
// // // //     console.error("[GET /api/attendance/:id]", err);
// // // //     return NextResponse.json({ error: "Internal server error." }, { status: 500 });
// // // //   }
// // // // }


// // // // export async function PATCH(req: NextRequest, { params }: Ctx) {
// // // //   try {
// // // //     const { id } = await params;
// // // //     const userId = req.headers.get("x-user-id");
// // // //     if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    

// // // //     const body    = await req.json();
// // // //     const updates: Record<string, any> = {};
// // // //     if (body.status) updates.status = body.status;

// // // //     if (!Object.keys(updates).length)
// // // //       return NextResponse.json({ error: "No valid fields to update." }, { status: 400 });

// // // //     const record = await prisma.attendance.update({
// // // //       where:   { id },
// // // //       data:    updates,
// // // //       include: INCLUDE,
// // // //     });

// // // //     return NextResponse.json(toDTO(record));

// // // //   } catch (err) {
// // // //     console.error("[PATCH /api/attendance/:id]", err);
// // // //     return NextResponse.json({ error: "Internal server error." }, { status: 500 });
// // // //   }
// // // // }


// // // // export async function DELETE(req: NextRequest, { params }: Ctx) {
// // // //   try {
// // // //     const { id } = await params;
// // // //     const userId = req.headers.get("x-user-id");
// // // //     if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  

// // // //     await prisma.attendance.delete({ where: { id } });
// // // //     return NextResponse.json({ success: true });

// // // //   } catch (err) {
// // // //     console.error("[DELETE /api/attendance/:id]", err);
// // // //     return NextResponse.json({ error: "Internal server error." }, { status: 500 });
// // // //   }
// // // // }



// // // import  prisma  from "@/core/lib/prisma"; // ✅ singleton, not new PrismaClient()
// // // import { NextRequest, NextResponse } from "next/server";
// // // import { getServerSession } from "next-auth";
// // // import { authOptions } from "@/core/lib/auth";

// // // type Ctx = { params: Promise<{ id: string }> };

// // // const INCLUDE = {
// // //   student:      { select: { id: true, username: true, email: true } },
// // //   detectedZone: { select: { id: true, name: true, color: true } },
// // //   session: {
// // //     include: {
// // //       class:  { select: { id: true, name: true } },
// // //       school: {
// // //         select: {
// // //           id: true, name: true, address: true,
// // //           latitude: true, longitude: true, radiusMeters: true,
// // //         },
// // //       },
// // //     },
// // //   },
// // // } as const;

// // // function toDTO(r: any) {
// // //   return {
// // //     id:                 r.id,
// // //     status:             r.status,
// // //     date:               r.date.toISOString(),
// // //     markedAt:           r.createdAt.toISOString(),
// // //     markedLatitude:     r.markedLatitude,
// // //     markedLongitude:    r.markedLongitude,
// // //     distanceFromCenter: r.distanceFromCenter,
// // //     distanceFromZone:   r.distanceFromZone,
// // //     withinSchool:       r.withinSchool,
// // //     gpsAccuracy:        r.gpsAccuracy,
// // //     deviceInfo:         r.deviceInfo,
// // //     ipAddress:          r.ipAddress,
// // //     detectedZone:       r.detectedZone ?? null,
// // //     student:            r.student,
// // //     session: r.session ? {
// // //       id:        r.session.id,
// // //       date:      r.session.date.toISOString(),
// // //       startTime: r.session.startTime.toISOString(),
// // //       class:     r.session.class,
// // //       school:    r.session.school,
// // //     } : null,
// // //   };
// // // }

// // // // ── GET /api/attendance/:id ────────────────────────────────────────
// // // // Student: own record only   |   Admin/Teacher: any record
// // // export async function GET(req: NextRequest, { params }: Ctx) {
// // //   try {
// // //     const session = await getServerSession(authOptions);
// // //     if (!session) {
// // //       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
// // //     }

// // //     const { id } = await params;

// // //     const record = await prisma.attendance.findUnique({
// // //       where:   { id },
// // //       include: INCLUDE,
// // //     });
// // //     if (!record) {
// // //       return NextResponse.json({ error: "Record not found" }, { status: 404 });
// // //     }

// // //     // Students can only view their own record
// // //     if (session.user.role === "STUDENT") {
// // //       const student = await prisma.student.findUnique({
// // //         where:  { userId: session.user.id },
// // //         select: { id: true },
// // //       });
// // //       if (student?.id !== record.studentId) {
// // //         return NextResponse.json({ error: "Forbidden" }, { status: 403 });
// // //       }
// // //     }

// // //     return NextResponse.json(toDTO(record));

// // //   } catch (err) {
// // //     console.error("[GET /api/attendance/:id]", err);
// // //     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
// // //   }
// // // }

// // // // ── PATCH /api/attendance/:id ──────────────────────────────────────
// // // // Admin/Teacher only — manually override status (e.g. EXCUSED)
// // // export async function PATCH(req: NextRequest, { params }: Ctx) {
// // //   try {
// // //     const session = await getServerSession(authOptions);
// // //     if (!session || !["ADMIN", "TEACHER"].includes(session.user.role)) {
// // //       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
// // //     }

// // //     const { id } = await params;
// // //     const body = await req.json();

// // //     const ALLOWED_STATUSES = ["PRESENT", "ABSENT", "LATE", "EXCUSED"];
// // //     if (!body.status || !ALLOWED_STATUSES.includes(body.status)) {
// // //       return NextResponse.json(
// // //         { error: `status must be one of: ${ALLOWED_STATUSES.join(", ")}` },
// // //         { status: 400 }
// // //       );
// // //     }

// // //     const record = await prisma.attendance.update({
// // //       where:   { id },
// // //       data:    { status: body.status },
// // //       include: INCLUDE,
// // //     });

// // //     return NextResponse.json(toDTO(record));

// // //   } catch (err) {
// // //     console.error("[PATCH /api/attendance/:id]", err);
// // //     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
// // //   }
// // // }

// // // // ── DELETE /api/attendance/:id ─────────────────────────────────────
// // // // Admin only
// // // export async function DELETE(req: NextRequest, { params }: Ctx) {
// // //   try {
// // //     const session = await getServerSession(authOptions);
// // //     if (!session || session.user.role !== "ADMIN") {
// // //       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
// // //     }

// // //     const { id } = await params;

// // //     await prisma.attendance.delete({ where: { id } });
// // //     return NextResponse.json({ success: true });

// // //   } catch (err) {
// // //     console.error("[DELETE /api/attendance/:id]", err);
// // //     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
// // //   }
// // // }






// // // src/app/api/admin/attendance/[id]/route.ts

// // import { NextRequest, NextResponse } from "next/server";
// // import prisma from "@/core/lib/prisma";
// // import { getServerSession } from "next-auth";
// // import { authOptions } from "@/core/lib/auth";

// // export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
// //   const session = await getServerSession(authOptions);
// //   if (!session || session.user.role !== "ADMIN") {
// //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
// //   }
// //   try {
// //     const { status } = await req.json();
// //     const valid = ["PRESENT", "ABSENT", "LATE", "EXCUSED"];
// //     if (!valid.includes(status)) {
// //       return NextResponse.json({ error: "Invalid status" }, { status: 400 });
// //     }
// //     const updated = await prisma.attendance.update({
// //       where: { id: params.id },
// //       data:  { status },
// //     });
// //     return NextResponse.json(updated);
// //   } catch (error: any) {
// //     return NextResponse.json({ error: error.message }, { status: 500 });
// //   }
// // }

// // export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
// //   const session = await getServerSession(authOptions);
// //   if (!session || session.user.role !== "ADMIN") {
// //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
// //   }
// //   try {
// //     await prisma.attendance.delete({ where: { id: params.id } });
// //     return NextResponse.json({ success: true });
// //   } catch (error: any) {
// //     return NextResponse.json({ error: error.message }, { status: 500 });
// //   }
// // }







// import prisma from "@/core/lib/prisma";
// import { NextRequest, NextResponse } from "next/server";


// interface Params {
//   params: Promise<{ id: string }>;
// }

// export async function PATCH(req: NextRequest, { params }: Params) {
//   try {
//     const { id } = await params;
//     const body = await req.json();
//     const { status } = body;

//     if (!status) {
//       return NextResponse.json({ error: "status is required" }, { status: 400 });
//     }

//     const updated = await prisma.attendance.update({
//       where: { id },
//       data: { status },
//       include: {
//         student: {
//           select: {
//             id:       true,
//             username: true,
//             email:    true,
//             class:    { select: { id: true, name: true } },
//           },
//         },
//         session: {
//           select: {
//             id:    true,
//             class: { select: { id: true, name: true } },
//           },
//         },
//       },
//     });

//     return NextResponse.json(updated);
//   } catch (err) {
//     console.error("[PATCH /api/admin/attendance/[id]]", err);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

// export async function DELETE(_req: NextRequest, { params }: Params) {
//   try {
//     const { id } = await params;
//     await prisma.attendance.delete({ where: { id } });
//     return new NextResponse(null, { status: 204 });
//   } catch (err) {
//     console.error("[DELETE /api/admin/attendance/[id]]", err);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }










import prisma from "@/core/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/core/lib/prisma";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { status } = await req.json();

    if (!status) {
      return NextResponse.json({ error: "status is required" }, { status: 400 });
    }

    const updated = await prisma.attendance.update({
      where: { id },
      data:  { status },
      include: {
        student: {
          select: {
            id:       true,
            username: true,
            email:    true,
            class:    { select: { id: true, name: true } },
          },
        },
        session: {
          select: {
            id:    true,
            class: { select: { id: true, name: true } },
          },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("[PATCH /api/admin/attendance/[id]]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await prisma.attendance.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("[DELETE /api/admin/attendance/[id]]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
