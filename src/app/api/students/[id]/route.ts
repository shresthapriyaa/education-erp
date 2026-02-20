// // import { NextResponse } from "next/server";
// // import { db } from "@/core/lib/db";
// // import bcrypt from "bcryptjs";

// // export async function GET(
// //   req: Request,
// //   { params }: { params: Promise<{ id: string }> }
// // ) {
// //   try {
// //     const { id } = await params;

// //     const student = await db.student.findUnique({
// //       where: { id },
// //       include: {
// //         parent: { select: { id: true, username: true, email: true } },
// //         user: {
// //           select: {
// //             id: true,
// //             username: true,
// //             email: true,
// //             role: true,
// //             isVerified: true,
// //           },
// //         },
// //       },
// //     });

// //     if (!student) {
// //       return NextResponse.json({ error: "Student not found" }, { status: 404 });
// //     }

// //     return NextResponse.json(student);
// //   } catch (error) {
// //     console.error("[STUDENT_GET_ID]", error);
// //     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
// //   }
// // }

// // export async function PUT(
// //   req: Request,
// //   { params }: { params: Promise<{ id: string }> }
// // ) {
// //   try {
// //     const { id } = await params;
// //     const body = await req.json();
// //     const { username, email, password, phone, address, img, bloodGroup, sex, dateOfBirth, parentId } = body;

// //     const existingStudent = await db.student.findUnique({ where: { id } });
// //     if (!existingStudent) {
// //       return NextResponse.json({ error: "Student not found" }, { status: 404 });
// //     }

// //     if (email && email !== existingStudent.email) {
// //       const emailExists = await db.student.findUnique({ where: { email } });
// //       if (emailExists) {
// //         return NextResponse.json({ error: "Email already in use" }, { status: 409 });
// //       }
// //     }

// //     const updateData: any = {
// //       username,
// //       email,
// //       phone: phone || null,
// //       address: address || null,
// //       img: img || null,
// //       bloodGroup: bloodGroup || null,
// //       sex,
// //       dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
// //       parentId: parentId || null,
// //     };

// //     if (password) {
// //       updateData.password = await bcrypt.hash(password, 12);
// //     }

// //     const student = await db.student.update({
// //       where: { id },
// //       data: updateData,
// //       include: {
// //         parent: { select: { id: true, username: true, email: true } },
// //         user: {
// //           select: {
// //             id: true,
// //             username: true,
// //             email: true,
// //             role: true,
// //             isVerified: true,
// //           },
// //         },
// //       },
// //     });

// //     return NextResponse.json(student);
// //   } catch (error) {
// //     console.error("[STUDENT_PUT]", error);
// //     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
// //   }
// // }

// // export async function PATCH(
// //   req: Request,
// //   { params }: { params: Promise<{ id: string }> }
// // ) {
// //   try {
// //     const { id } = await params;
// //     const body = await req.json();

// //     const existingStudent = await db.student.findUnique({ where: { id } });
// //     if (!existingStudent) {
// //       return NextResponse.json({ error: "Student not found" }, { status: 404 });
// //     }

// //     if (body.email && body.email !== existingStudent.email) {
// //       const emailExists = await db.student.findUnique({ where: { email: body.email } });
// //       if (emailExists) {
// //         return NextResponse.json({ error: "Email already in use" }, { status: 409 });
// //       }
// //     }

// //     const updateData: any = {};
// //     if (body.username !== undefined) updateData.username = body.username;
// //     if (body.email !== undefined) updateData.email = body.email;
// //     if (body.phone !== undefined) updateData.phone = body.phone || null;
// //     if (body.address !== undefined) updateData.address = body.address || null;
// //     if (body.img !== undefined) updateData.img = body.img || null;
// //     if (body.bloodGroup !== undefined) updateData.bloodGroup = body.bloodGroup || null;
// //     if (body.sex !== undefined) updateData.sex = body.sex;
// //     if (body.dateOfBirth !== undefined) updateData.dateOfBirth = body.dateOfBirth ? new Date(body.dateOfBirth) : null;
// //     if (body.parentId !== undefined) updateData.parentId = body.parentId || null;
// //     if (body.password) updateData.password = await bcrypt.hash(body.password, 12);

// //     const student = await db.student.update({
// //       where: { id },
// //       data: updateData,
// //       include: {
// //         parent: { select: { id: true, username: true, email: true } },
// //         user: {
// //           select: {
// //             id: true,
// //             username: true,
// //             email: true,
// //             role: true,
// //             isVerified: true,
// //           },
// //         },
// //       },
// //     });

// //     return NextResponse.json(student);
// //   } catch (error) {
// //     console.error("[STUDENT_PATCH]", error);
// //     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
// //   }
// // }

// // export async function DELETE(
// //   req: Request,
// //   { params }: { params: Promise<{ id: string }> }
// // ) {
// //   try {
// //     const { id } = await params;

// //     await db.student.delete({ where: { id } });

// //     return NextResponse.json({ message: "Student deleted" });
// //   } catch (error) {
// //     console.error("[STUDENT_DELETE]", error);
// //     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
// //   }
// // }




// import { NextResponse } from "next/server";
// import { db } from "@/core/lib/db";
// import bcrypt from "bcryptjs";

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const search = searchParams.get("search") ?? "";
//     const sex = searchParams.get("sex");
//     const bloodGroup = searchParams.get("bloodGroup");

//     const students = await db.student.findMany({
//       where: {
//         AND: [
//           search
//             ? {
//                 OR: [
//                   { username: { contains: search, mode: "insensitive" } },
//                   { email: { contains: search, mode: "insensitive" } },
//                   { phone: { contains: search, mode: "insensitive" } },
//                   { address: { contains: search, mode: "insensitive" } },
//                 ],
//               }
//             : {},
//           sex && sex !== "all" ? { sex: sex as any } : {},
//           bloodGroup && bloodGroup !== "all" ? { bloodGroup } : {},
//         ],
//       },
//       include: {
//         parent: { select: { id: true, username: true, email: true } },
//         user: {
//           select: {
//             id: true,
//             username: true,
//             email: true,
//             role: true,
//             isVerified: true,
//           },
//         },
//       },
//       orderBy: { createdAt: "desc" },
//     });

//     return NextResponse.json(students);
//   } catch (error) {
//     console.error("[STUDENT_GET]", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const {
//       username,
//       email,
//       password,
//       phone,
//       address,
//       img,
//       bloodGroup,
//       sex,
//       dateOfBirth,
//       parentId,
//     } = body;

//     if (!username || !email || !sex) {
//       return NextResponse.json(
//         { error: "username, email, and sex are required" },
//         { status: 400 }
//       );
//     }

//     // Check duplicates in both User and Student
//     const existingUser = await db.user.findFirst({
//       where: { OR: [{ email }, { username }] },
//     });
//     if (existingUser) {
//       return NextResponse.json(
//         { error: "A user with this email or username already exists" },
//         { status: 409 }
//       );
//     }

//     const existingStudent = await db.student.findFirst({
//       where: { OR: [{ email }, { username }] },
//     });
//     if (existingStudent) {
//       return NextResponse.json(
//         { error: "A student with this email or username already exists" },
//         { status: 409 }
//       );
//     }

//     // Create User + Student in one transaction
//     const student = await db.$transaction(async (tx) => {
//       const userData: any = {
//         username,
//         email,
//         role: "STUDENT",
//         isVerified: false,
//       };

//       if (password) {
//         userData.password = await bcrypt.hash(password, 12);
//       }

//       const user = await tx.user.create({ data: userData });

//       return tx.student.create({
//         data: {
//           username,
//           email,
//           phone: phone || null,
//           address: address || null,
//           img: img || null,
//           bloodGroup: bloodGroup || null,
//           sex,
//           dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
//           parentId: parentId || null,
//           userId: user.id,
//         },
//         include: {
//           parent: { select: { id: true, username: true, email: true } },
//           user: {
//             select: {
//               id: true,
//               username: true,
//               email: true,
//               role: true,
//               isVerified: true,
//             },
//           },
//         },
//       });
//     });

//     return NextResponse.json(student, { status: 201 });
//   } catch (error) {
//     console.error("[STUDENT_POST]", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }






import { NextResponse } from "next/server";
import { db } from "@/core/lib/db";
import bcrypt from "bcryptjs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const student = await db.student.findUnique({
      where: { id },
      include: {
        parent: { select: { id: true, username: true, email: true } },
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
            isVerified: true,
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error("[STUDENT_GET_ID]", error);
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
    const { username, email, password, phone, address, img, bloodGroup, sex, dateOfBirth, parentId } = body;

    const existingStudent = await db.student.findUnique({ where: { id } });
    if (!existingStudent) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    if (email && email !== existingStudent.email) {
      const emailExists = await db.student.findUnique({ where: { email } });
      if (emailExists) {
        return NextResponse.json({ error: "Email already in use" }, { status: 409 });
      }
    }

    const updateData: any = {
      username,
      email,
      phone: phone?.trim() || null,
      address: address?.trim() || null,
      img: img?.trim() || null,
      bloodGroup: bloodGroup?.trim() || null,
      sex,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      parentId: parentId && parentId.trim() !== "" ? parentId : null,
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 12);
    }

    const student = await db.student.update({
      where: { id },
      data: updateData,
      include: {
        parent: { select: { id: true, username: true, email: true } },
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
            isVerified: true,
          },
        },
      },
    });

    return NextResponse.json(student);
  } catch (error) {
    console.error("[STUDENT_PUT]", error);
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

    const existingStudent = await db.student.findUnique({ where: { id } });
    if (!existingStudent) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    if (body.email && body.email !== existingStudent.email) {
      const emailExists = await db.student.findUnique({ where: { email: body.email } });
      if (emailExists) {
        return NextResponse.json({ error: "Email already in use" }, { status: 409 });
      }
    }

    const updateData: any = {};
    if (body.username !== undefined) updateData.username = body.username;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.phone !== undefined) updateData.phone = body.phone?.trim() || null;
    if (body.address !== undefined) updateData.address = body.address?.trim() || null;
    if (body.img !== undefined) updateData.img = body.img?.trim() || null;
    if (body.bloodGroup !== undefined) updateData.bloodGroup = body.bloodGroup?.trim() || null;
    if (body.sex !== undefined) updateData.sex = body.sex;
    if (body.dateOfBirth !== undefined) updateData.dateOfBirth = body.dateOfBirth ? new Date(body.dateOfBirth) : null;
    if (body.parentId !== undefined) updateData.parentId = body.parentId && body.parentId.trim() !== "" ? body.parentId : null;
    if (body.password) updateData.password = await bcrypt.hash(body.password, 12);

    const student = await db.student.update({
      where: { id },
      data: updateData,
      include: {
        parent: { select: { id: true, username: true, email: true } },
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
            isVerified: true,
          },
        },
      },
    });

    return NextResponse.json(student);
  } catch (error) {
    console.error("[STUDENT_PATCH]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.student.delete({ where: { id } });

    return NextResponse.json({ message: "Student deleted" });
  } catch (error) {
    console.error("[STUDENT_DELETE]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}