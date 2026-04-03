// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/core/lib/prisma";

// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const search = searchParams.get("search") || "";

//     const classes = await prisma.class.findMany({
//       where: search ? {
//         OR: [
//           { name: { contains: search, mode: "insensitive" } },
//           { teacher: { username: { contains: search, mode: "insensitive" } } },
//         ],
//       } : undefined,
//       select: {
//         id: true,
//         name: true,
//         teacherId: true,
//         createdAt: true,
//         updatedAt: true,
//         teacher: { select: { id: true, username: true, email: true } },
//       },
//       orderBy: { name: "asc" },
//     });
//     return NextResponse.json(classes);
//   } catch (error: any) {
//     console.error("[CLASSES_GET]", error.message);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();

//     if (!body.name || !body.teacherId) {
//       return NextResponse.json({ error: "Missing: name, teacherId" }, { status: 400 });
//     }

//     const teacherExists = await prisma.teacher.findUnique({ where: { id: body.teacherId } });
//     if (!teacherExists) {
//       return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
//     }

//     const newClass = await prisma.class.create({
//       data: {
//         name: body.name.trim(),
//         teacherId: body.teacherId,
//       },
//       select: {
//         id: true,
//         name: true,
//         teacherId: true,
//         createdAt: true,
//         updatedAt: true,
//         teacher: { select: { id: true, username: true, email: true } },
//       },
//     });

//     return NextResponse.json(newClass, { status: 201 });
//   } catch (error: any) {
//     console.error("[CLASSES_POST]", error.message);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }



import { NextRequest, NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/core/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search      = searchParams.get("search")      || "";
    const teacherOnly = searchParams.get("teacherOnly") === "true";

    let teacherId: string | undefined;

    if (teacherOnly) {
      const session = await getServerSession(authOptions);
      if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      const teacher = await prisma.teacher.findUnique({
        where:  { userId: session.user.id },
        select: { id: true },
      });
      if (!teacher) return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
      teacherId = teacher.id;
    }

    const classes = await prisma.class.findMany({
      where: {
        ...(teacherId ? { teacherId } : {}),
        ...(search ? {
          OR: [
            { name:    { contains: search, mode: "insensitive" } },
            { teacher: { username: { contains: search, mode: "insensitive" } } },
          ],
        } : {}),
      },
      select: {
        id: true, name: true, teacherId: true,
        createdAt: true, updatedAt: true,
        teacher:  { select: { id: true, username: true, email: true } },
        students: { select: { id: true } },
        _count:   { select: { students: true } },
      },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(classes);
  } catch (error: any) {
    console.error("[CLASSES_GET]", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.teacherId) {
      return NextResponse.json({ error: "Missing: name, teacherId" }, { status: 400 });
    }
    const teacherExists = await prisma.teacher.findUnique({ where: { id: body.teacherId } });
    if (!teacherExists) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }
    const newClass = await prisma.class.create({
      data: { name: body.name.trim(), teacherId: body.teacherId },
      select: {
        id: true, name: true, teacherId: true,
        createdAt: true, updatedAt: true,
        teacher: { select: { id: true, username: true, email: true } },
      },
    });
    return NextResponse.json(newClass, { status: 201 });
  } catch (error: any) {
    console.error("[CLASSES_POST]", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
