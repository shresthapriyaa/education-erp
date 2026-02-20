
import { NextResponse } from "next/server";
import { db } from "@/core/lib/db";
import bcrypt from "bcryptjs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") ?? "";
    const sex = searchParams.get("sex");
    const bloodGroup = searchParams.get("bloodGroup");
    const students = await db.student.findMany({
      where: {
        AND: [
          search ? { OR: [{ username: { contains: search, mode: "insensitive" } }, { email: { contains: search, mode: "insensitive" } }] } : {},
          sex && sex !== "all" ? { sex: sex as any } : {},
          bloodGroup && bloodGroup !== "all" ? { bloodGroup } : {},
        ],
      },
      include: {
        parent: { select: { id: true, username: true, email: true } },
        user: { select: { id: true, username: true, email: true, role: true, isVerified: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(students);
  } catch (error) {
    console.error("[STUDENT_GET]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("[STUDENT_POST] body received:", JSON.stringify(body));
    const { username, email, password, phone, address, img, bloodGroup, sex, dateOfBirth, parentId } = body;
    if (!username || !email || !sex) {
      return NextResponse.json({ error: "username, email, and sex are required" }, { status: 400 });
    }
    const existingUser = await db.user.findFirst({ where: { OR: [{ email }, { username }] } });
    if (existingUser) {
      return NextResponse.json({ error: "A user with this email or username already exists" }, { status: 409 });
    }
    const existingStudent = await db.student.findFirst({ where: { OR: [{ email }, { username }] } });
    if (existingStudent) {
      return NextResponse.json({ error: "A student with this email or username already exists" }, { status: 409 });
    }
    const student = await db.$transaction(async (tx) => {
      const userData: any = { username, email, role: "STUDENT", isVerified: false };
      if (password) userData.password = await bcrypt.hash(password, 12);
      const user = await tx.user.create({ data: userData });
      const resolvedParentId = parentId && typeof parentId === "string" && parentId.trim() !== "" ? parentId.trim() : null;
      return tx.student.create({
        data: {
          username,
          email,
          phone: phone?.trim() || null,
          address: address?.trim() || null,
          img: img?.trim() || null,
          bloodGroup: bloodGroup?.trim() || null,
          sex,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          parentId: resolvedParentId,
          userId: user.id,
        },
        include: {
          parent: { select: { id: true, username: true, email: true } },
          user: { select: { id: true, username: true, email: true, role: true, isVerified: true } },
        },
      });
    });
    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error("[STUDENT_POST]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
