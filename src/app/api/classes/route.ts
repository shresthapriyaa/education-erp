// import { NextResponse } from "next/server";
// import prisma from "@/core/lib/prisma";

// export async function GET() {
//   try {
//     const classes = await prisma.class.findMany({
//       select: {
//         id: true,
//         name: true,
//         grade: true,
//         section: true,
//         academicYear: true,
//         classTeacher: {
//           select: {
//             id: true,
//             username: true,
//             email: true
//           }
//         }
//       },
//       orderBy: [
//         { grade: 'asc' },
//         { section: 'asc' }
//       ]
//     });

//     return NextResponse.json(classes);
//   } catch (error: any) {
//     console.error("[CLASSES_API] Error:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch classes", details: error.message },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     if (!body.grade || !body.section || !body.academicYear) {
//       return NextResponse.json(
//         { error: "Missing required fields: grade, section, academicYear" },
//         { status: 400 }
//       );
//     }

//     // Generate class name from grade and section
//     const name = `${body.grade} - ${body.section}`;

//     // Create the class first
//     const classData = await prisma.class.create({
//       data: {
//         name: name.trim(),
//         grade: body.grade.trim(),
//         section: body.section.trim(),
//         academicYear: body.academicYear.trim(),
//         classTeacherId: body.classTeacherId || null,
//         schoolId: body.schoolId || null,
//       },
//       include: {
//         classTeacher: {
//           select: {
//             id: true,
//             username: true,
//             email: true
//           }
//         }
//       }
//     });

//     // If subjects are provided, create ClassSubject records
//     console.log('[CLASSES_POST] body.subjects:', body.subjects);
//     if (body.subjects && Array.isArray(body.subjects) && body.subjects.length > 0) {
//       console.log('[CLASSES_POST] Creating ClassSubject records for', body.subjects.length, 'subjects');
//       await Promise.all(
//         body.subjects.map((subject: { subjectId: string; teacherId: string | null }) => {
//           console.log('[CLASSES_POST] Creating ClassSubject:', { classId: classData.id, subjectId: subject.subjectId, teacherId: subject.teacherId });
//           return prisma.classSubject.create({
//             data: {
//               classId: classData.id,
//               subjectId: subject.subjectId,
//               teacherId: subject.teacherId,
//             },
//           });
//         })
//       );
//       console.log('[CLASSES_POST] ClassSubject records created successfully');
//     } else {
//       console.log('[CLASSES_POST] No subjects provided or invalid subjects array');
//     }

//     return NextResponse.json(classData, { status: 201 });
//   } catch (error: any) {
//     console.error("[CLASSES_POST] Error:", error);
//     if (error.code === "P2002") {
//       return NextResponse.json(
//         { error: "A class with this grade, section, and academic year already exists" },
//         { status: 409 }
//       );
//     }
//     return NextResponse.json(
//       { error: "Failed to create class", details: error.message },
//       { status: 500 }
//     );
//   }
// }





import { NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

export async function GET() {
  try {
    const classes = await prisma.class.findMany({
      select: {
        id: true,
        name: true,
        grade: true,
        section: true,
        academicYear: true,
        classTeacher: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        _count: {
          select: {
            students: true,
            subjects: true,
          },
        },
      },
      orderBy: [{ grade: "asc" }, { section: "asc" }],
    });

    return NextResponse.json(classes);
  } catch (error: any) {
    console.error("[CLASSES_API] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch classes", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.grade || !body.section || !body.academicYear) {
      return NextResponse.json(
        { error: "Missing required fields: grade, section, academicYear" },
        { status: 400 }
      );
    }

    const name = `${body.grade} - ${body.section}`;

    const classData = await prisma.class.create({
      data: {
        name: name.trim(),
        grade: body.grade.trim(),
        section: body.section.trim(),
        academicYear: body.academicYear.trim(),
        classTeacherId: body.classTeacherId || null,
        schoolId: body.schoolId || null,
      },
      include: {
        classTeacher: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    if (body.subjects && Array.isArray(body.subjects) && body.subjects.length > 0) {
      await Promise.all(
        body.subjects.map(
          (subject: { subjectId: string; teacherId: string | null }) =>
            prisma.classSubject.create({
              data: {
                classId: classData.id,
                subjectId: subject.subjectId,
                teacherId: subject.teacherId,
              },
            })
        )
      );
    }

    return NextResponse.json(classData, { status: 201 });
  } catch (error: any) {
    console.error("[CLASSES_POST] Error:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        {
          error:
            "A class with this grade, section, and academic year already exists",
        },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create class", details: error.message },
      { status: 500 }
    );
  }
}