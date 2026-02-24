import { NextResponse } from "next/server";
import db from "@/core/lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@/generated/prisma/client";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { username, email, password, role, isVerified } = body;

        const existingUser = await db.user.findUnique({
            where: { id },
        });

        if (!existingUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (email && email !== existingUser.email) {
            const emailExists = await db.user.findUnique({
                where: { email },
            });
            if (emailExists) {
                return NextResponse.json({ error: "Email already in use" }, { status: 409 });
            }
        }

        const updateData: any = {
            username,
            email,
            role: role as Role,
            isVerified,
        };

        if (password) {
            updateData.password = await bcrypt.hash(password, 12);
        }

        const user = await db.user.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error("[USER_PUT]", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Delete linked profiles first to avoid FK constraint
        await db.student.deleteMany({ where: { userId: id } });
        await db.teacher.deleteMany({ where: { userId: id } });
        await db.parent.deleteMany({ where: { userId: id } });
        await db.accountant.deleteMany({ where: { userId: id } });

        // Then delete the user
        await db.user.delete({ where: { id } });

        return NextResponse.json({ message: "User deleted" });
    } catch (error) {
        console.error("[USER_DELETE]", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}


// import { NextResponse } from "next/server";
// import db from "@/core/lib/prisma";
// import bcrypt from "bcryptjs";
// import { Role } from "@/generated/prisma/client";

// export async function PUT(
//   req: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params;
//     const body = await req.json();
//     const { username, email, password, role, isVerified } = body;

//     const existingUser = await db.user.findUnique({
//       where: { id },
//       include: {
//         student: true,
//         teacher: true,
//         parent: true,
//         accountant: true,
//       },
//     });

//     if (!existingUser) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     if (email && email !== existingUser.email) {
//       const emailExists = await db.user.findUnique({ where: { email } });
//       if (emailExists) {
//         return NextResponse.json({ error: "Email already in use" }, { status: 409 });
//       }
//     }

//     const updateData: any = {
//       username,
//       email,
//       role: role as Role,
//       isVerified,
//     };

//     if (password) {
//       updateData.password = await bcrypt.hash(password, 12);
//     }

//     // ✅ Sync linked profile username/email
//     if (existingUser.student) {
//       updateData.student = { update: { username, email } };
//     }
//     if (existingUser.teacher) {
//       updateData.teacher = { update: { username, email } };
//     }
//     if (existingUser.parent) {
//       updateData.parent = { update: { username, email } };
//     }
//     if (existingUser.accountant) {
//       updateData.accountant = { update: { username, email } };
//     }

//     const user = await db.user.update({
//       where: { id },
//       data: updateData,
//     });

//     return NextResponse.json(user);
//   } catch (error: any) {
//     console.error("[USER_PUT]", error.message);
//     if (error.code === "P2002") {
//       return NextResponse.json(
//         { error: `Already exists: ${error.meta?.target}` },
//         { status: 409 }
//       );
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

//     const existingUser = await db.user.findUnique({ where: { id } });
//     if (!existingUser) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     // ✅ Delete linked profiles first to avoid FK constraint
//     await db.student.deleteMany({ where: { userId: id } });
//     await db.teacher.deleteMany({ where: { userId: id } });
//     await db.parent.deleteMany({ where: { userId: id } });
//     await db.accountant.deleteMany({ where: { userId: id } });

//     await db.user.delete({ where: { id } });

//     return NextResponse.json({ message: "User deleted" });
//   } catch (error: any) {
//     console.error("[USER_DELETE]", error.message);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }