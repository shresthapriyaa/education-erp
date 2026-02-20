import { NextResponse } from "next/server";
import { db } from "@/core/lib/db";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

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

        await db.user.delete({
            where: { id },
        });

        return NextResponse.json({ message: "User deleted" });
    } catch (error) {
        console.error("[USER_DELETE]", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
