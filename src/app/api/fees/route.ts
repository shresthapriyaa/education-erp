// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/core/lib/prisma";

// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const search = searchParams.get("search") || "";
//     const fees = await prisma.fee.findMany({
//       where: search ? {
//         OR: [
//           { student: { username: { contains: search, mode: "insensitive" } } },
//           { student: { email: { contains: search, mode: "insensitive" } } },
//         ],
//       } : undefined,
//       select: {
//         id: true, studentId: true, amount: true, dueDate: true,
//         paid: true, createdAt: true, updatedAt: true,
//         student: { select: { id: true, username: true, email: true } },
//       },
//       orderBy: { dueDate: "asc" },
//     });
//     return NextResponse.json(fees);
//   } catch (error: any) {
//     console.error("[FEES_GET]", error.message);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     if (!body.studentId || !body.amount || !body.dueDate) {
//       return NextResponse.json({ error: "Missing: studentId, amount, dueDate" }, { status: 400 });
//     }
//     const studentExists = await prisma.student.findUnique({ where: { id: body.studentId } });
//     if (!studentExists) return NextResponse.json({ error: "Student not found" }, { status: 404 });
//     const fee = await prisma.fee.create({
//       data: {
//         studentId: body.studentId,
//         amount: parseFloat(body.amount),
//         dueDate: new Date(body.dueDate),
//         paid: body.paid ?? false,
//       },
//       select: {
//         id: true, studentId: true, amount: true, dueDate: true,
//         paid: true, createdAt: true, updatedAt: true,
//         student: { select: { id: true, username: true, email: true } },
//       },
//     });
//     return NextResponse.json(fee, { status: 201 });
//   } catch (error: any) {
//     console.error("[FEES_POST]", error.message);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }




import { NextRequest, NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const fees = await prisma.fee.findMany({
      where: search ? {
        OR: [
          { student: { username: { contains: search, mode: "insensitive" } } },
          { student: { email: { contains: search, mode: "insensitive" } } },
        ],
      } : undefined,
      select: {
        id: true, studentId: true, amount: true, dueDate: true,
        status: true, paidDate: true, remarks: true,
        createdAt: true, updatedAt: true,
        student: { select: { id: true, username: true, email: true } },
      },
      orderBy: { dueDate: "asc" },
    });
    return NextResponse.json(fees);
  } catch (error: any) {
    console.error("[FEES_GET]", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.studentId || !body.amount || !body.dueDate) {
      return NextResponse.json({ error: "Missing: studentId, amount, dueDate" }, { status: 400 });
    }
    const studentExists = await prisma.student.findUnique({ where: { id: body.studentId } });
    if (!studentExists) return NextResponse.json({ error: "Student not found" }, { status: 404 });
    const fee = await prisma.fee.create({
      data: {
        studentId: body.studentId,
        amount: parseFloat(body.amount),
        dueDate: new Date(body.dueDate),
        status: body.status ?? "PENDING",
        paidDate: body.paidDate ? new Date(body.paidDate) : null,
        remarks: body.remarks ?? null,
      },
      select: {
        id: true, studentId: true, amount: true, dueDate: true,
        status: true, paidDate: true, remarks: true,
        createdAt: true, updatedAt: true,
        student: { select: { id: true, username: true, email: true } },
      },
    });
    return NextResponse.json(fee, { status: 201 });
  } catch (error: any) {
    console.error("[FEES_POST]", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}