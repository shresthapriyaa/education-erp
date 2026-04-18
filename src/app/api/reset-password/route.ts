import { NextRequest, NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, newPassword } = await req.json();

    if (!email || !newPassword) {
      return NextResponse.json({ 
        error: "Email and newPassword required" 
      }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    return NextResponse.json({
      success: true,
      message: "Password reset successfully",
      email: user.email,
      newPasswordSet: newPassword,
      passwordHash: hashedPassword.substring(0, 30) + "..."
    });
  } catch (error: any) {
    console.error("[RESET_PASSWORD]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
