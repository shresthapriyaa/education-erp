// import { NextResponse } from "next/server";
// import prisma from "@/core/lib/prisma";
// import bcrypt from "bcryptjs";

// export async function GET(
//   req: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params;

//     const student = await prisma.student.findUnique({
//       where: { id },
//       include: {
//         parent: { select: { id: true, username: true, email: true } },
//         user: {
//           select: { id: true, username: true, email: true, role: true, isVerified: true },
//         },
//       },
//     });

//     if (!student) {
//       return NextResponse.json
//       (
//         { 
//           error: "Student not found"
//          }, 
//         { 
//           status: 404
//          }
//       );
//     }

//     return NextResponse.json(student);
//   } catch (error: any) {
//     console.error("[STUDENT_GET_ID]", error.message);
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
//     const { username, email, password, phone, address, img, bloodGroup, sex, dateOfBirth, parentId } = body;

//     const existingStudent = await prisma.student.findUnique(
//       { where: { id } 
//     }
//   );
//     if (!existingStudent) {
//       return NextResponse.json(
//         {
//          error: "Student not found" },
//           { 
//             status: 404 
//           }
//         );
//     }

//     if (email && email !== existingStudent.email) {
//       const emailExists = await prisma.student.findUnique({ where: { email } });
//       if (emailExists) {
//         return NextResponse.json({ error: "Email already in use" }, { status: 409 });
//       }
//     }

//     const hashedPassword = password ? await bcrypt.hash(password, 12) : undefined;
//     const cleanParentId = parentId?.trim() || null;

//     const student = await prisma.student.update({
//       where: { id },
//       data: {
//         username,
//         email,
//         phone: phone?.trim() || null,
//         address: address?.trim() || null,
//         img: img?.trim() || null,
//         bloodGroup: bloodGroup?.trim() || null,
//         sex,
//         dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
//         parent: cleanParentId
//           ? { connect: { id: cleanParentId } }
//           : { disconnect: true },
//         user: {
//           update: {
//             username,
//             email,
//             ...(hashedPassword && { password: hashedPassword }),
//           },
//         },
//       },
//       include: {
//         parent: { select: { id: true, username: true, email: true } },
//         user: { select: { id: true, username: true, email: true, role: true, isVerified: true } },
//       },
//     });

//     return NextResponse.json(student);
//   } catch (error: any) {
//     console.error("[STUDENT_PUT]", error.message);
//     if (error.code === "P2002") {
//       return NextResponse.json({ error: `Already exists: ${error.meta?.target}` }, { status: 409 });
//     }
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

//     const existingStudent = await prisma.student.findUnique({ where: { id } });
//     if (!existingStudent) {
//       return NextResponse.json({ error: "Student not found" }, { status: 404 });
//     }

//     if (body.email && body.email !== existingStudent.email) {
//       const emailExists = await prisma.student.findUnique({ where: { email: body.email } });
//       if (emailExists) {
//         return NextResponse.json({ error: "Email already in use" }, { status: 409 });
//       }
//     }

//     const hashedPassword = body.password ? await bcrypt.hash(body.password, 12) : undefined;

//     const studentData: any = {};
//     if (body.username !== undefined) studentData.username = body.username;
//     if (body.email !== undefined) studentData.email = body.email;
//     if (body.phone !== undefined) studentData.phone = body.phone?.trim() || null;
//     if (body.address !== undefined) studentData.address = body.address?.trim() || null;
//     if (body.img !== undefined) studentData.img = body.img?.trim() || null;
//     if (body.bloodGroup !== undefined) studentData.bloodGroup = body.bloodGroup?.trim() || null;
//     if (body.sex !== undefined) studentData.sex = body.sex;
//     if (body.dateOfBirth !== undefined) studentData.dateOfBirth = body.dateOfBirth ? new Date(body.dateOfBirth) : null;
    
//     if (body.parentId !== undefined) {
//       const cleanParentId = body.parentId?.trim() || null;
//       studentData.parent = cleanParentId
//         ? { connect: { id: cleanParentId } }
//         : { disconnect: true };
//     }

//     const userUpdate: any = {};
//     if (body.username !== undefined) userUpdate.username = body.username;
//     if (body.email !== undefined) userUpdate.email = body.email;
//     if (hashedPassword) userUpdate.password = hashedPassword;

//     if (Object.keys(userUpdate).length > 0) {
//       studentData.user = { update: userUpdate };
//     }

//     const student = await prisma.student.update({
//       where: { id },
//       data: studentData,
//       include: {
//         parent: { select: { id: true, username: true, email: true } },
//         user: { select: { id: true, username: true, email: true, role: true, isVerified: true } },
//       },
//     });

//     return NextResponse.json(student);
//   } catch (error: any) {
//     console.error("[STUDENT_PATCH]", error.message);
//     if (error.code === "P2002") {
//       return NextResponse.json({ error: `Already exists: ${error.meta?.target}` }, { status: 409 });
//     }
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

// export async function DELETE(
//   req: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params;

//     const student = await prisma.student.findUnique({ where: { id } });
//     if (!student) {
//       return NextResponse.json({ error: "Student not found" }, { status: 404 });
//     }

//     await prisma.student.delete({ where: { id } });

//     if (student.userId) {
//       await prisma.user.delete({ where: { id: student.userId } });
//     }

//     return NextResponse.json({ message: "Student deleted successfully" });
//   } catch (error: any) {
//     console.error("[STUDENT_DELETE]", error.message);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }





import { NextRequest, NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

type Params = { params: Promise<{ id: string }> };

// ── GET /api/students/[id] ────────────────────────────────────────────────────
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const student = await prisma.student.findUnique({
      where: { id },
      select: {
        id:          true,
        username:    true,
        email:       true,
        phone:       true,
        address:     true,
        img:         true,
        bloodGroup:  true,
        sex:         true,
        dateOfBirth: true,
        createdAt:   true,
        parent: {
          select: { id: true, username: true, email: true },
        },
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error: any) {
    console.error("[STUDENT_ID_GET]", error.message);
    return NextResponse.json({ error: "Failed to fetch student" }, { status: 500 });
  }
}

// ── PUT /api/students/[id] — replace all fields ───────────────────────────────
export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const body = await req.json();

    if (!body.username || !body.email || !body.sex) {
      const missing = ["username", "email", "sex"].filter((f) => !body[f]);
      return NextResponse.json({ error: `Missing: ${missing.join(", ")}` }, { status: 400 });
    }

    const cleanParentId = body.parentId?.trim() || null;

    if (cleanParentId) {
      const parentExists = await prisma.parent.findUnique({
        where:  { id: cleanParentId },
        select: { id: true },
      });
      if (!parentExists) {
        return NextResponse.json(
          { error: `Parent with id "${cleanParentId}" not found.` },
          { status: 404 }
        );
      }
    }

    const student = await prisma.student.update({
      where: { id },
      data: {
        username:    body.username,
        email:       body.email,
        phone:       body.phone      || null,
        address:     body.address    || null,
        img:         body.img        || null,
        bloodGroup:  body.bloodGroup || null,
        sex:         body.sex,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
        parent: cleanParentId
          ? { connect: { id: cleanParentId } }
          : { disconnect: true },
      },
      select: {
        id:          true,
        username:    true,
        email:       true,
        phone:       true,
        address:     true,
        img:         true,
        bloodGroup:  true,
        sex:         true,
        dateOfBirth: true,
        parent: {
          select: { id: true, username: true, email: true },
        },
      },
    });

    // Keep user table in sync
    await prisma.user.update({
      where: { email: body.email },
      data:  { username: body.username, email: body.email },
    }).catch(() => {}); // non-fatal

    return NextResponse.json(student);
  } catch (error: any) {
    console.error("[STUDENT_ID_PUT]", error.message);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: `Already exists: ${error.meta?.target}` },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ── PATCH /api/students/[id] — update only provided fields ───────────────────
export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const body = await req.json();

    if (Object.keys(body).length === 0) {
      return NextResponse.json({ error: "No fields provided" }, { status: 400 });
    }

    const cleanParentId =
      "parentId" in body ? (body.parentId?.trim() || null) : undefined;

    if (cleanParentId) {
      const parentExists = await prisma.parent.findUnique({
        where:  { id: cleanParentId },
        select: { id: true },
      });
      if (!parentExists) {
        return NextResponse.json(
          { error: `Parent with id "${cleanParentId}" not found.` },
          { status: 404 }
        );
      }
    }

    const student = await prisma.student.update({
      where: { id },
      data: {
        ...(body.username    !== undefined && { username:    body.username }),
        ...(body.email       !== undefined && { email:       body.email }),
        ...(body.phone       !== undefined && { phone:       body.phone       || null }),
        ...(body.address     !== undefined && { address:     body.address     || null }),
        ...(body.img         !== undefined && { img:         body.img         || null }),
        ...(body.bloodGroup  !== undefined && { bloodGroup:  body.bloodGroup  || null }),
        ...(body.sex         !== undefined && { sex:         body.sex }),
        ...(body.dateOfBirth !== undefined && {
          dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
        }),
        ...("parentId" in body && {
          parent: cleanParentId
            ? { connect: { id: cleanParentId } }
            : { disconnect: true },
        }),
      },
      select: {
        id:          true,
        username:    true,
        email:       true,
        phone:       true,
        address:     true,
        img:         true,
        bloodGroup:  true,
        sex:         true,
        dateOfBirth: true,
        parent: {
          select: { id: true, username: true, email: true },
        },
      },
    });

    // Keep user table in sync for username/email changes
    if (body.username !== undefined || body.email !== undefined) {
      await prisma.user.update({
        where: { email: body.email ?? student.email },
        data: {
          ...(body.username !== undefined && { username: body.username }),
          ...(body.email    !== undefined && { email:    body.email }),
        },
      }).catch(() => {}); // non-fatal
    }

    return NextResponse.json(student);
  } catch (error: any) {
    console.error("[STUDENT_ID_PATCH]", error.message);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: `Already exists: ${error.meta?.target}` },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ── DELETE /api/students/[id] ─────────────────────────────────────────────────
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    await prisma.student.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[STUDENT_ID_DELETE]", error.message);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}