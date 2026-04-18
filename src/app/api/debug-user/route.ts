import { NextRequest, NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { 
        parent: {
          select: {
            id: true,
            username: true,
            email: true,
            userId: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      userId: user.id,
      userEmail: user.email,
      username: user.username,
      role: user.role,
      hasPassword: !!user.password,
      passwordHashPreview: user.password ? user.password.substring(0, 30) + "..." : null,
      parentLinked: !!user.parent,
      parentId: user.parent?.id,
      parentEmail: user.parent?.email,
      parentUserId: user.parent?.userId,
      userIdMatch: user.parent?.userId === user.id
    });
  } catch (error: any) {
    console.error("[DEBUG_USER]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
