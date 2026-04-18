import { NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ error: "Email parameter required" }, { status: 400 });
    }

    const parent = await prisma.parent.findUnique({
      where: { email },
      include: {
        user: true,
        students: { select: { id: true, username: true, email: true } }
      }
    });

    if (!parent) {
      return NextResponse.json({ error: "Parent not found" }, { status: 404 });
    }

    console.log("[DEBUG_PARENT] Parent data:", {
      id: parent.id,
      email: parent.email,
      img: parent.img,
      imgLength: parent.img?.length || 0,
      userId: parent.userId,
      userEmail: parent.user?.email
    });

    return NextResponse.json({
      parent: {
        id: parent.id,
        username: parent.username,
        email: parent.email,
        phone: parent.phone,
        img: parent.img,
        imgLength: parent.img?.length || 0,
        userId: parent.userId,
        createdAt: parent.createdAt,
        updatedAt: parent.updatedAt
      },
      user: parent.user ? {
        id: parent.user.id,
        username: parent.user.username,
        email: parent.user.email,
        role: parent.user.role
      } : null,
      students: parent.students
    });
  } catch (error: any) {
    console.error("[DEBUG_PARENT] Error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}