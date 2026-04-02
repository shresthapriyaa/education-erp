// // import { NextRequest, NextResponse } from "next/server";
// // import prisma from "@/core/lib/prisma";

// // type Params = { params: Promise<{ id: string }> };

// // const SESSION_SELECT = {
// //   id:        true,
// //   date:      true,
// //   startTime: true,
// //   endTime:   true,
// //   isOpen:    true,
// //   createdAt: true,
// //   class:  { select: { id: true, name: true } },
// //   school: { select: { id: true, name: true } },
// //   _count: { select: { attendance: true } },
// // } as const;

// // // ── GET /api/sessions/[id] ────────────────────────────────────────────────────
// // export async function GET(_req: NextRequest, { params }: Params) {
// //   const { id } = await params;
// //   try {
// //     const session = await prisma.session.findUnique({
// //       where: { id },
// //       select: SESSION_SELECT,
// //     });
// //     if (!session) {
// //       return NextResponse.json({ error: "Session not found" }, { status: 404 });
// //     }
// //     return NextResponse.json(session);
// //   } catch (error: any) {
// //     console.error("[SESSION_ID_GET]", error.message);
// //     return NextResponse.json({ error: "Failed to fetch session" }, { status: 500 });
// //   }
// // }

// // // ── PATCH /api/sessions/[id] ──────────────────────────────────────────────────
// // export async function PATCH(req: NextRequest, { params }: Params) {
// //   const { id } = await params;
// //   try {
// //     const body = await req.json();

// //     const session = await prisma.session.update({
// //       where: { id },
// //       data: {
// //         ...(body.classId   !== undefined && { classId:   body.classId }),
// //         ...(body.schoolId  !== undefined && { schoolId:  body.schoolId }),
// //         ...(body.date      !== undefined && { date:      new Date(body.date) }),
// //         ...(body.startTime !== undefined && { startTime: new Date(body.startTime) }),
// //         ...(body.endTime   !== undefined && {
// //           endTime: body.endTime ? new Date(body.endTime) : null,
// //         }),
// //         ...(body.isOpen !== undefined && { isOpen: body.isOpen }),
// //       },
// //       select: SESSION_SELECT,
// //     });

// //     return NextResponse.json(session);
// //   } catch (error: any) {
// //     console.error("[SESSION_ID_PATCH]", error.message);
// //     if (error.code === "P2025") {
// //       return NextResponse.json({ error: "Session not found" }, { status: 404 });
// //     }
// //     return NextResponse.json({ error: error.message }, { status: 500 });
// //   }
// // }

// // // ── DELETE /api/sessions/[id] ─────────────────────────────────────────────────
// // export async function DELETE(_req: NextRequest, { params }: Params) {
// //   const { id } = await params;
// //   try {
// //     await prisma.session.delete({ where: { id } });
// //     return NextResponse.json({ success: true });
// //   } catch (error: any) {
// //     console.error("[SESSION_ID_DELETE]", error.message);
// //     if (error.code === "P2025") {
// //       return NextResponse.json({ error: "Session not found" }, { status: 404 });
// //     }
// //     return NextResponse.json({ error: error.message }, { status: 500 });
// //   }
// // }


// import { NextRequest, NextResponse } from "next/server";
// import  prisma  from "@/core/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/core/lib/auth";

// type Params = { params: Promise<{ id: string }> };

// const SESSION_SELECT = {
//   id:        true,
//   date:      true,
//   startTime: true,
//   endTime:   true,
//   isOpen:    true,
//   createdAt: true,
//   class:  { select: { id: true, name: true } },
//   school: {
//     select: {
//       id: true, name: true, address: true,
//       latitude: true, longitude: true, radiusMeters: true,
//       zones: {
//         where:  { isActive: true },
//         select: {
//           id: true, name: true,
//           latitude: true, longitude: true,
//           radiusMeters: true, color: true,
//         },
//       },
//     },
//   },
//   _count: { select: { attendance: true } },
// } as const;

// export async function GET(_req: NextRequest, { params }: Params) {
//   const session = await getServerSession(authOptions);
//   if (!session) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }
//   const { id } = await params;
//   try {
//     const record = await prisma.session.findUnique({
//       where:  { id },
//       select: SESSION_SELECT,
//     });
//     if (!record) {
//       return NextResponse.json({ error: "Session not found" }, { status: 404 });
//     }
//     return NextResponse.json(record);
//   } catch (error: any) {
//     console.error("[SESSION_ID_GET]", error.message);
//     return NextResponse.json({ error: "Failed to fetch session" }, { status: 500 });
//   }
// }

// export async function PATCH(req: NextRequest, { params }: Params) {
//   const session = await getServerSession(authOptions);
//   if (!session || !["ADMIN", "TEACHER"].includes(session.user.role)) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }
//   const { id } = await params;
//   try {
//     const body = await req.json();
//     const record = await prisma.session.update({
//       where: { id },
//       data: {
//         ...(body.classId   !== undefined && { classId:   body.classId }),
//         ...(body.schoolId  !== undefined && { schoolId:  body.schoolId }),
//         ...(body.date      !== undefined && { date:      new Date(body.date) }),
//         ...(body.startTime !== undefined && { startTime: new Date(body.startTime) }),
//         ...(body.endTime   !== undefined && {
//           endTime: body.endTime ? new Date(body.endTime) : null,
//         }),
//         ...(body.isOpen !== undefined && { isOpen: body.isOpen }),
//       },
//       select: SESSION_SELECT,
//     });
//     return NextResponse.json(record);
//   } catch (error: any) {
//     console.error("[SESSION_ID_PATCH]", error.message);
//     if (error.code === "P2025") {
//       return NextResponse.json({ error: "Session not found" }, { status: 404 });
//     }
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// export async function DELETE(_req: NextRequest, { params }: Params) {
//   const session = await getServerSession(authOptions);
//   if (!session || session.user.role !== "ADMIN") {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }
//   const { id } = await params;
//   try {
//     await prisma.session.delete({ where: { id } });
//     return NextResponse.json({ success: true });
//   } catch (error: any) {
//     console.error("[SESSION_ID_DELETE]", error.message);
//     if (error.code === "P2025") {
//       return NextResponse.json({ error: "Session not found" }, { status: 404 });
//     }
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }









// src/app/api/admin/attendance/sessions/[sessionId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/core/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { sessionId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "TEACHER"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const record = await prisma.session.findUnique({
      where: { id: params.sessionId },
      include: {
        class:   { select: { id: true, name: true } },
        school:  { select: { id: true, name: true } },
        teacher: { select: { id: true, username: true } },
        attendance: {
          include: {
            student: {
              select: {
                id: true, username: true, email: true,
                class: { select: { id: true, name: true } },
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });
    if (!record) return NextResponse.json({ error: "Session not found" }, { status: 404 });
    return NextResponse.json(record);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { sessionId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "TEACHER"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body    = await req.json();
    const updated = await prisma.session.update({
      where: { id: params.sessionId },
      data: {
        ...(body.isOpen    !== undefined ? { isOpen:  body.isOpen }            : {}),
        ...(body.endTime                 ? { endTime: new Date(body.endTime) }  : {}),
        ...(body.radiusMeters            ? { radiusMeters: body.radiusMeters }  : {}),
      },
    });
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { sessionId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await prisma.session.delete({ where: { id: params.sessionId } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}