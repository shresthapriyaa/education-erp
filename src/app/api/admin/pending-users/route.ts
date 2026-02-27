import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/core/lib/auth";
import prisma from "@/core/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const unverifiedUsers = await prisma.user.findMany({
      where: { isVerified: false },
      include: {
        student:    { select: { phone: true, address: true, img: true, sex: true, dateOfBirth: true } },
        teacher:    { select: { phone: true, address: true, img: true } },
        parent:     { select: { phone: true, address: true, img: true } },
        accountant: { select: { phone: true, address: true, img: true } },
      },
    });

    const users = unverifiedUsers
      .map((user) => {
        const profile =
          user.student ?? user.teacher ?? user.parent ?? user.accountant ?? null;

        // Only show users who completed onboarding (phone is filled)
        if (!profile?.phone) return null;

        return {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          profile,
        };
      })
      .filter(Boolean);

    return NextResponse.json({ users });
  } catch (error) {
    console.error("[PENDING USERS ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch pending users" },
      { status: 500 }
    );
  }
}