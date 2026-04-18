import { NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const parent = await prisma.parent.findUnique({
      where: { id },
      include: {
        students: { select: { id: true, username: true, email: true } },
        user: { select: { id: true, username: true, email: true, role: true, isVerified: true } },
      },
    });
    if (!parent) return NextResponse.json({ error: "Parent not found" }, { status: 404 });
    return NextResponse.json(parent);
  } catch (error: any) {
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
    const { username, email, password, phone, address, img } = body;

    const existing = await prisma.parent.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Parent not found" }, { status: 404 });

    if (email && email !== existing.email) {
      const emailExists = await prisma.parent.findUnique({ where: { email } });
      if (emailExists) return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 12) : undefined;

    const parent = await prisma.parent.update({
      where: { id },
      data: {
        username,
        email,
        phone: phone?.trim() || null,
        address: address?.trim() || null,
        img: img?.trim() || null,
        user: {
          update: {
            username,
            email,
            ...(hashedPassword && { password: hashedPassword }),
          },
        },
      },
      include: {
        students: { select: { id: true, username: true, email: true } },
        user: { select: { id: true, username: true, email: true, role: true, isVerified: true } },
      },
    });

    return NextResponse.json(parent);
  } catch (error: any) {
    console.error("[PARENT_PUT]", error.message);
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

    const existing = await prisma.parent.findUnique({ 
      where: { id },
      include: { user: true }
    });
    
    if (!existing) {
      return NextResponse.json({ error: "Parent not found" }, { status: 404 });
    }

    if (!existing.userId) {
      return NextResponse.json({ 
        error: "Parent account is not linked to a user. Please contact administrator." 
      }, { status: 400 });
    }

    console.log("[PARENT_PATCH] Parent found:", {
      parentId: existing.id,
      parentEmail: existing.email,
      userId: existing.userId,
      userEmail: existing.user?.email
    });

    // Handle password update separately and directly on User table
    if (body.password) {
      const hashedPassword = await bcrypt.hash(body.password, 12);
      console.log("[PARENT_PATCH] Updating password directly on User table");
      console.log("[PARENT_PATCH] User ID:", existing.userId);
      
      await prisma.user.update({
        where: { id: existing.userId },
        data: { password: hashedPassword }
      });
      
      console.log("[PARENT_PATCH] Password updated successfully");
    }

    // Update parent data (excluding password)
    const data: any = {};
    if (body.username !== undefined) {
      data.username = body.username;
      // Also update user username
      await prisma.user.update({
        where: { id: existing.userId },
        data: { username: body.username }
      });
    }
    if (body.email !== undefined) {
      data.email = body.email;
      // Also update user email
      await prisma.user.update({
        where: { id: existing.userId },
        data: { email: body.email }
      });
    }
    if (body.phone !== undefined) data.phone = body.phone?.trim() || null;
    if (body.address !== undefined) data.address = body.address?.trim() || null;
    if (body.img !== undefined) {
      data.img = body.img?.trim() || null;
      console.log("[PARENT_PATCH] Updating image to:", data.img);
      console.log("[PARENT_PATCH] Image URL length:", data.img?.length || 0);
    }

    console.log("[PARENT_PATCH] Data to update:", data);

    // Update parent record only if there's data to update
    let parent;
    if (Object.keys(data).length > 0) {
      parent = await prisma.parent.update({
        where: { id },
        data,
        include: {
          students: { select: { id: true, username: true, email: true } },
          user: { select: { id: true, username: true, email: true, role: true, isVerified: true } },
        },
      });

      console.log("[PARENT_PATCH] Update successful, new img:", parent.img);
    } else {
      // If only password was updated, fetch and return the parent
      parent = await prisma.parent.findUnique({
        where: { id },
        include: {
          students: { select: { id: true, username: true, email: true } },
          user: { select: { id: true, username: true, email: true, role: true, isVerified: true } },
        },
      });
      console.log("[PARENT_PATCH] Password update successful");
    }

    return NextResponse.json(parent);
  } catch (error: any) {
    console.error("[PARENT_PATCH] Error:", error.message);
    console.error("[PARENT_PATCH] Stack:", error.stack);
    if (error.code === "P2002") {
      return NextResponse.json({ error: `Already exists: ${error.meta?.target}` }, { status: 409 });
    }
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const parent = await prisma.parent.findUnique({ where: { id } });
    if (!parent) return NextResponse.json({ error: "Parent not found" }, { status: 404 });

    await prisma.parent.delete({ where: { id } });
    if (parent.userId) await prisma.user.delete({ where: { id: parent.userId } });

    return NextResponse.json({ message: "Parent deleted successfully" });
  } catch (error: any) {
    console.error("[PARENT_DELETE]", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}