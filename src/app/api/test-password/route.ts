import { NextRequest, NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";
import { compare } from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { parent: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.password) {
      return NextResponse.json({ error: "User has no password set" }, { status: 400 });
    }

    const isValid = await compare(password, user.password);

    return NextResponse.json({
      email: user.email,
      role: user.role,
      hasPassword: !!user.password,
      passwordHash: user.password.substring(0, 20) + "...",
      passwordValid: isValid,
      parentLinked: !!user.parent,
      parentId: user.parent?.id
    });
  } catch (error: any) {
    console.error("[TEST_PASSWORD]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
