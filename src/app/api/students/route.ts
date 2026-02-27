// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/core/lib/prisma";

// export async function GET() {
//   try {
//     const students = await prisma.student.findMany({
//       select: {
//         id: true,
//         username: true,
//         email: true,
//         phone: true,
//         address: true,
//         img: true,
//         bloodGroup: true,
//         sex: true,
//         dateOfBirth: true,
//         createdAt: true,
//       },
//     });
//     return NextResponse.json(students);
//   } catch (error: any) {
//     console.error("[STUDENT_GET]", error.message);
//     return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();

//     if (!body.username || !body.email || !body.sex) {
//       const missing = ["username", "email", "sex"].filter((f) => !body[f]);
//       return NextResponse.json({ error: `Missing: ${missing.join(", ")}` }, { status: 400 });
//     }

//     const student = await prisma.student.create({
//       data: {
//         username: body.username,
//         email: body.email,
//         phone: body.phone || null,
//         address: body.address || null,
//         img: body.img || null,
//         bloodGroup: body.bloodGroup || null,
//         sex: body.sex,
//         dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
//         user: {
//           create: {
//             username: body.username,
//             email: body.email,
//             role: "STUDENT",
//           },
//         },
//       },
//       select: {
//         id: true,
//         username: true,
//         email: true,
//         phone: true,
//         address: true,
//         img: true,
//         bloodGroup: true,
//         sex: true,
//         dateOfBirth: true,
//       },
//     });

//     return NextResponse.json(student, { status: 201 });
//   } catch (error: any) {
//     console.error("[STUDENT_POST]", error.message);

//     if (error.code === "P2002") {
//       return NextResponse.json(
//         { error: `Already exists: ${error.meta?.target}` },
//         { status: 409 }
//       );
//     }

//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }




// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/core/lib/prisma";

// export async function GET() {
//   try {
//     const students = await prisma.student.findMany({
//       select: {
//         id: true,
//         username: true,
//         email: true,
//         phone: true,
//         address: true,
//         img: true,
//         bloodGroup: true,
//         sex: true,
//         dateOfBirth: true,
//         createdAt: true,
//         parent: {
//           select: {
//             id: true,
//             username: true,
//             email: true,
//           },
//         },
//       },
//     });
//     return NextResponse.json(students);
//   } catch (error: any) {
//     console.error("[STUDENT_GET]", error.message);
//     return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();

//     if (!body.username || !body.email || !body.sex) {
//       const missing = ["username", "email", "sex"].filter((f) => !body[f]);
//       return NextResponse.json({ error: `Missing: ${missing.join(", ")}` }, { status: 400 });
//     }

//     const student = await prisma.student.create({
//       data: {
//         username: body.username,
//         email: body.email,
//         phone: body.phone || null,
//         address: body.address || null,
//         img: body.img || null,
//         bloodGroup: body.bloodGroup || null,
//         sex: body.sex,
//         dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
//         user: {
//           create: {
//             username: body.username,
//             email: body.email,
//             role: "STUDENT",
//           },
//         },
//       },
//       select: {
//         id: true,
//         username: true,
//         email: true,
//         phone: true,
//         address: true,
//         img: true,
//         bloodGroup: true,
//         sex: true,
//         dateOfBirth: true,
//         parent: {
//           select: {
//             id: true,
//             username: true,
//             email: true,
//           },
//         },
//       },
//     });

//     return NextResponse.json(student, { status: 201 });
//   } catch (error: any) {
//     console.error("[STUDENT_POST]", error.message);

//     if (error.code === "P2002") {
//       return NextResponse.json(
//         { error: `Already exists: ${error.meta?.target}` },
//         { status: 409 }
//       );
//     }

//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }




import { NextRequest, NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const sex = searchParams.get("sex") || "";
    const bloodGroup = searchParams.get("bloodGroup") || "";

    const students = await prisma.student.findMany({
      where: {
        ...(search && {
          OR: [
            { username: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }),
        ...(sex && sex !== "all" && { sex: sex as any }),
        ...(bloodGroup && bloodGroup !== "all" && { bloodGroup }),
      },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        address: true,
        img: true,
        bloodGroup: true,
        sex: true,
        dateOfBirth: true,
        createdAt: true,
        parent: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });
    return NextResponse.json(students);
  } catch (error: any) {
    console.error("[STUDENT_GET]", error.message);
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.username || !body.email || !body.sex) {
      const missing = ["username", "email", "sex"].filter((f) => !body[f]);
      return NextResponse.json({ error: `Missing: ${missing.join(", ")}` }, { status: 400 });
    }

    // Generate a default password if none provided
    const rawPassword = body.password || "Student@123";
    const hashedPassword = await bcrypt.hash(rawPassword, 12);

    const student = await prisma.student.create({
      data: {
        username: body.username,
        email: body.email,
        phone: body.phone || null,
        address: body.address || null,
        img: body.img || null,
        bloodGroup: body.bloodGroup || null,
        sex: body.sex,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
        ...(body.parentId && {
          parent: { connect: { id: body.parentId } },
        }),
        user: {
          create: {
            username: body.username,
            email: body.email,
            role: "STUDENT",
            password: hashedPassword, // ✅ password now saved
          },
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        address: true,
        img: true,
        bloodGroup: true,
        sex: true,
        dateOfBirth: true,
        parent: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error: any) {
    console.error("[STUDENT_POST]", error.message);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: `Already exists: ${error.meta?.target}` },
        { status: 409 }
      );
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}