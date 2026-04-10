import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/core/lib/auth";
import prisma from "@/core/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const teacher = await prisma.teacher.findUnique({
      where: { email: session.user.email },
      include: { classTeacherFor: true },
    });

    if (!teacher || teacher.classTeacherFor.length === 0) {
      return NextResponse.json(
        { error: "You are not a class teacher" },
        { status: 403 }
      );
    }

    const classId = teacher.classTeacherFor[0].id;
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const text = await file.text();
    const lines = text.split("\n").filter((line) => line.trim());
    
    if (lines.length < 2) {
      return NextResponse.json(
        { error: "File must contain header and at least one student" },
        { status: 400 }
      );
    }

    const header = lines[0].split(",").map((h) => h.trim());
    const expectedHeaders = ["username", "email", "sex", "phone", "address", "bloodGroup", "dateOfBirth"];
    
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(",").map((v) => v.trim());
        const row: any = {};
        header.forEach((h, idx) => {
          row[h] = values[idx] || null;
        });

        if (!row.username || !row.email || !row.sex) {
          results.failed++;
          results.errors.push(`Row ${i + 1}: Missing required fields`);
          continue;
        }

        const defaultPassword = "student123";
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        const user = await prisma.user.create({
          data: {
            username: row.username,
            email: row.email,
            password: hashedPassword,
            role: "STUDENT",
            isVerified: true,
          },
        });

        await prisma.student.create({
          data: {
            username: row.username,
            email: row.email,
            userId: user.id,
            sex: row.sex.toUpperCase(),
            phone: row.phone || null,
            address: row.address || null,
            bloodGroup: row.bloodGroup || null,
            dateOfBirth: row.dateOfBirth ? new Date(row.dateOfBirth) : null,
            classId,
          },
        });

        results.success++;
      } catch (error: any) {
        results.failed++;
        results.errors.push(`Row ${i + 1}: ${error.message}`);
      }
    }

    return NextResponse.json(results);
  } catch (error: any) {
    console.error("Error bulk importing students:", error);
    return NextResponse.json(
      { error: error.message || "Failed to import students" },
      { status: 500 }
    );
  }
}
