// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/core/lib/prisma";

// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: { id: string; subjectId: string } }
// ) {
//   try {
//     const classId = params.id;
//     const subjectId = params.subjectId;

//     // Find and delete the ClassSubject record
//     const deleted = await prisma.classSubject.delete({
//       where: {
//         classId_subjectId: {
//           classId,
//           subjectId
//         }
//       }
//     });

//     return NextResponse.json({ success: true, deleted });
//   } catch (error: any) {
//     console.error("[CLASS_SUBJECT_DELETE]", error);
//     if (error.code === "P2025") {
//       return NextResponse.json(
//         { error: "Class-subject assignment not found" },
//         { status: 404 }
//       );
//     }
//     return NextResponse.json(
//       { error: "Failed to remove subject from class", details: error.message },
//       { status: 500 }
//     );
//   }
// }

// export async function PATCH(
//   req: NextRequest,
//   { params }: { params: { id: string; subjectId: string } }
// ) {
//   try {
//     const classId = params.id;
//     const subjectId = params.subjectId;
//     const body = await req.json();

//     // Update the teacher for this class-subject assignment
//     const updated = await prisma.classSubject.update({
//       where: {
//         classId_subjectId: {
//           classId,
//           subjectId
//         }
//       },
//       data: {
//         teacherId: body.teacherId || null
//       },
//       include: {
//         subject: {
//           select: {
//             id: true,
//             name: true,
//             code: true
//           }
//         },
//         teacher: {
//           select: {
//             id: true,
//             username: true,
//             email: true
//           }
//         }
//       }
//     });

//     return NextResponse.json(updated);
//   } catch (error: any) {
//     console.error("[CLASS_SUBJECT_PATCH]", error);
//     if (error.code === "P2025") {
//       return NextResponse.json(
//         { error: "Class-subject assignment not found" },
//         { status: 404 }
//       );
//     }
//     return NextResponse.json(
//       { error: "Failed to update teacher assignment", details: error.message },
//       { status: 500 }
//     );
//   }
// }





import { NextRequest, NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; subjectId: string }> }
) {
  try {
    const { id: classId, subjectId } = await params;
    const deleted = await prisma.classSubject.delete({
      where: { classId_subjectId: { classId, subjectId } }
    });
    return NextResponse.json({ success: true, deleted });
  } catch (error: any) {
    console.error("[CLASS_SUBJECT_DELETE]", error);
    if (error.code === "P2025") return NextResponse.json({ error: "Class-subject assignment not found" }, { status: 404 });
    return NextResponse.json({ error: "Failed to remove subject from class", details: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; subjectId: string }> }
) {
  try {
    const { id: classId, subjectId } = await params;
    const body = await req.json();
    const updated = await prisma.classSubject.update({
      where: { classId_subjectId: { classId, subjectId } },
      data: { teacherId: body.teacherId || null },
      include: {
        subject: { select: { id: true, name: true, code: true } },
        teacher: { select: { id: true, username: true, email: true } }
      }
    });
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("[CLASS_SUBJECT_PATCH]", error);
    if (error.code === "P2025") return NextResponse.json({ error: "Class-subject assignment not found" }, { status: 404 });
    return NextResponse.json({ error: "Failed to update teacher assignment", details: error.message }, { status: 500 });
  }
}