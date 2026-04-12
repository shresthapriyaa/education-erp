// import { NextResponse } from "next/server";
// import prisma from "@/core/lib/prisma";

// export async function GET(
//   req: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params;
//     const lesson = await prisma.lesson.findUnique({
//       where: { id },
//       include: { materials: true },
//     });
//     if (!lesson) return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
//     return NextResponse.json(lesson);
//   } catch (error: any) {
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

// export async function PUT(
//   req: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params;
//     const body = await req.json();

//     const existing = await prisma.lesson.findUnique({ where: { id } });
//     if (!existing) return NextResponse.json({ error: "Lesson not found" }, { status: 404 });

//     // Delete old materials and recreate
//     await prisma.material.deleteMany({ where: { lessonId: id } });

//     const lesson = await prisma.lesson.update({
//       where: { id },
//       data: {
//         title: body.title?.trim(),
//         content: body.content?.trim(),
//         materials: body.materials?.length
//           ? {
//               create: body.materials.map((m: any) => ({
//                 title: m.title.trim(),
//                 type: m.type,
//                 url: m.url.trim(),
//               })),
//             }
//           : undefined,
//       },
//       include: { materials: true },
//     });

//     return NextResponse.json(lesson);
//   } catch (error: any) {
//     console.error("[LESSON_PUT]", error.message);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

// export async function PATCH(
//   req: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params;
//     const body = await req.json();

//     const existing = await prisma.lesson.findUnique({ where: { id } });
//     if (!existing) return NextResponse.json({ error: "Lesson not found" }, { status: 404 });

//     const data: any = {};
//     if (body.title !== undefined) data.title = body.title.trim();
//     if (body.content !== undefined) data.content = body.content.trim();

//     if (body.materials !== undefined) {
//       await prisma.material.deleteMany({ where: { lessonId: id } });
//       if (body.materials.length > 0) {
//         data.materials = {
//           create: body.materials.map((m: any) => ({
//             title: m.title.trim(),
//             type: m.type,
//             url: m.url.trim(),
//           })),
//         };
//       }
//     }

//     const lesson = await prisma.lesson.update({
//       where: { id },
//       data,
//       include: { materials: true },
//     });

//     return NextResponse.json(lesson);
//   } catch (error: any) {
//     console.error("[LESSON_PATCH]", error.message);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

// export async function DELETE(
//   req: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params;
//     const existing = await prisma.lesson.findUnique({ where: { id } });
//     if (!existing) return NextResponse.json({ error: "Lesson not found" }, { status: 404 });

//     await prisma.material.deleteMany({ where: { lessonId: id } });
//     await prisma.lesson.delete({ where: { id } });

//     return NextResponse.json({ message: "Lesson deleted successfully" });
//   } catch (error: any) {
//     console.error("[LESSON_DELETE]", error.message);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }







import { NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

const lessonInclude = {
  materials: true,
  class:     { select: { id: true, name: true } },
  subject:   { select: { id: true, name: true } },
  teacher:   { select: { id: true, username: true } },
};

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: lessonInclude,
    });
    if (!lesson) return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    return NextResponse.json(lesson);
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.lesson.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Lesson not found" }, { status: 404 });

    await prisma.material.deleteMany({ where: { lessonId: id } });

    const lesson = await prisma.lesson.update({
      where: { id },
      data: {
        title:       body.title?.trim(),
        content:     body.content?.trim(),
        isPublished: body.isPublished ?? existing.isPublished,
        classId:     body.classId    ?? existing.classId,
        subjectId:   body.subjectId  ?? existing.subjectId,
        teacherId:   body.teacherId  ?? existing.teacherId,
        materials:   body.materials?.length
          ? {
              create: body.materials.map((m: any) => ({
                title: m.title.trim(),
                type:  m.type,
                url:   m.url.trim(),
              })),
            }
          : undefined,
      },
      include: lessonInclude,
    });

    return NextResponse.json(lesson);
  } catch (error: any) {
    console.error("[LESSON_PUT]", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.lesson.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Lesson not found" }, { status: 404 });

    const data: any = {};
    if (body.title       !== undefined) data.title       = body.title.trim();
    if (body.content     !== undefined) data.content     = body.content.trim();
    if (body.isPublished !== undefined) data.isPublished = body.isPublished;
    if (body.classId     !== undefined) data.classId     = body.classId;
    if (body.subjectId   !== undefined) data.subjectId   = body.subjectId;
    if (body.teacherId   !== undefined) data.teacherId   = body.teacherId;

    if (body.materials !== undefined) {
      await prisma.material.deleteMany({ where: { lessonId: id } });
      if (body.materials.length > 0) {
        data.materials = {
          create: body.materials.map((m: any) => ({
            title: m.title.trim(),
            type:  m.type,
            url:   m.url.trim(),
          })),
        };
      }
    }

    const lesson = await prisma.lesson.update({
      where: { id },
      data,
      include: lessonInclude,
    });

    return NextResponse.json(lesson);
  } catch (error: any) {
    console.error("[LESSON_PATCH]", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await prisma.lesson.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Lesson not found" }, { status: 404 });

    await prisma.lesson.delete({ where: { id } });
    return NextResponse.json({ message: "Lesson deleted successfully" });
  } catch (error: any) {
    console.error("[LESSON_DELETE]", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}