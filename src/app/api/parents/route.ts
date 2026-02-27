import { NextRequest, NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const parents = await prisma.parent.findMany({
      where: search ? {
        OR: [
          { username: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      } : undefined,
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        address: true,
        img: true,
        createdAt: true,
        students: { select: { id: true, username: true, email: true } },
      },
      orderBy: { username: "asc" },
    });
    return NextResponse.json(parents);
  } catch (error: any) {
    console.error("[PARENTS_GET]", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.username || !body.email) {
      return NextResponse.json({ error: "Missing: username, email" }, { status: 400 });
    }

    const rawPassword = body.password || "Parent@123";
    const hashedPassword = await bcrypt.hash(rawPassword, 12);

    const parent = await prisma.parent.create({
      data: {
        username: body.username,
        email: body.email,
        phone: body.phone || null,
        address: body.address || null,
        img: body.img || null,
        user: {
          create: {
            username: body.username,
            email: body.email,
            role: "PARENT",
            password: hashedPassword,
          },
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        address: true,
        img: true,
        createdAt: true,
        students: { select: { id: true, username: true, email: true } },
      },
    });

    return NextResponse.json(parent, { status: 201 });
  } catch (error: any) {
    console.error("[PARENTS_POST]", error.message);
    if (error.code === "P2002") {
      return NextResponse.json({ error: `Already exists: ${error.meta?.target}` }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}