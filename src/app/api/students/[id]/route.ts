import { NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        parent: { select: { id: true, username: true, email: true } },
        user: {
          select: { id: true, username: true, email: true, role: true, isVerified: true },
        },
      },
    });

    if (!student) {
      return NextResponse.json
      (
        { 
          error: "Student not found"
         }, 
        { 
          status: 404
         }
      );
    }

    return NextResponse.json(student);
  } catch (error: any) {
    console.error("[STUDENT_GET_ID]", error.message);
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

    const existingStudent = await prisma.student.findUnique(
      { where: { id } 
    }
  );
    if (!existingStudent) {
      return NextResponse.json(
        {
         error: "Student not found" },
          { 
            status: 404 
          }
        );
    }

    if (email && email !== existingStudent.email) {
      const emailExists = await prisma.student.findUnique({ where: { email } });
      if (emailExists) {
        return NextResponse.json({ error: "Email already in use" }, { status: 409 });
      }
    }

    const hashedPassword = password ? await bcrypt.hash(password, 12) : undefined;
    const cleanParentId = parentId?.trim() || null;

    const student = await prisma.student.update({
      where: { id },
      data: {
        username,
        email,
        phone: phone?.trim() || null,
        address: address?.trim() || null,
        img: img?.trim() || null,
        bloodGroup: bloodGroup?.trim() || null,
        sex,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        parent: cleanParentId
          ? { connect: { id: cleanParentId } }
          : { disconnect: true },
        user: {
          update: {
            username,
            email,
            ...(hashedPassword && { password: hashedPassword }),
          },
        },
      },
      include: {
        parent: { select: { id: true, username: true, email: true } },
        user: { select: { id: true, username: true, email: true, role: true, isVerified: true } },
      },
    });

    return NextResponse.json(student);
  } catch (error: any) {
    console.error("[STUDENT_PUT]", error.message);
    if (error.code === "P2002") {
      return NextResponse.json({ error: `Already exists: ${error.meta?.target}` }, { status: 409 });
    }
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

    const existingStudent = await prisma.student.findUnique({ where: { id } });
    if (!existingStudent) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    if (body.email && body.email !== existingStudent.email) {
      const emailExists = await prisma.student.findUnique({ where: { email: body.email } });
      if (emailExists) {
        return NextResponse.json({ error: "Email already in use" }, { status: 409 });
      }
    }

    const hashedPassword = body.password ? await bcrypt.hash(body.password, 12) : undefined;

    const studentData: any = {};
    if (body.username !== undefined) studentData.username = body.username;
    if (body.email !== undefined) studentData.email = body.email;
    if (body.phone !== undefined) studentData.phone = body.phone?.trim() || null;
    if (body.address !== undefined) studentData.address = body.address?.trim() || null;
    if (body.img !== undefined) studentData.img = body.img?.trim() || null;
    if (body.bloodGroup !== undefined) studentData.bloodGroup = body.bloodGroup?.trim() || null;
    if (body.sex !== undefined) studentData.sex = body.sex;
    if (body.dateOfBirth !== undefined) studentData.dateOfBirth = body.dateOfBirth ? new Date(body.dateOfBirth) : null;
    
    if (body.parentId !== undefined) {
      const cleanParentId = body.parentId?.trim() || null;
      studentData.parent = cleanParentId
        ? { connect: { id: cleanParentId } }
        : { disconnect: true };
    }

    const userUpdate: any = {};
    if (body.username !== undefined) userUpdate.username = body.username;
    if (body.email !== undefined) userUpdate.email = body.email;
    if (hashedPassword) userUpdate.password = hashedPassword;

    if (Object.keys(userUpdate).length > 0) {
      studentData.user = { update: userUpdate };
    }

    const student = await prisma.student.update({
      where: { id },
      data: studentData,
      include: {
        parent: { select: { id: true, username: true, email: true } },
        user: { select: { id: true, username: true, email: true, role: true, isVerified: true } },
      },
    });

    return NextResponse.json(student);
  } catch (error: any) {
    console.error("[STUDENT_PATCH]", error.message);
    if (error.code === "P2002") {
      return NextResponse.json({ error: `Already exists: ${error.meta?.target}` }, { status: 409 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const student = await prisma.student.findUnique({ where: { id } });
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    await prisma.student.delete({ where: { id } });

    if (student.userId) {
      await prisma.user.delete({ where: { id: student.userId } });
    }

    return NextResponse.json({ message: "Student deleted successfully" });
  } catch (error: any) {
    console.error("[STUDENT_DELETE]", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}




