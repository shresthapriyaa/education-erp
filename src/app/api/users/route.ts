



// import { NextResponse } from "next/server";
// import { db } from "@/core/lib/db";
// import bcrypt from "bcryptjs";
// import { Role } from "@prisma/client";

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const search = searchParams.get("search");
//     const role = searchParams.get("role");
//     const isVerified = searchParams.get("isVerified");

//     const where: any = {};

//     if (search) {
//       where.OR = [
//         { username: { contains: search, mode: "insensitive" } },
//         { email: { contains: search, mode: "insensitive" } },
//       ];
//     }

//     if (role && role !== "all") {
//       where.role = role as Role;
//     }

//     if (isVerified && isVerified !== "all") {
//       where.isVerified = isVerified === "true";
//     }

//     const users = await db.user.findMany({
//       where,
//       orderBy: { createdAt: "desc" },
//       select: {
//         id: true,
//         username: true,
//         email: true,
//         role: true,
//         isVerified: true,
//         createdAt: true,
//       },
//     });

//     return NextResponse.json(users);
//   } catch (error) {
//     console.error("[USERS_GET]", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { username, email, password, role, isVerified } = body; 

//     if (!username || !email || !password || !role) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//     }

//     const existingUser = await db.user.findUnique({ where: { email } });
//     if (existingUser) {
//       return NextResponse.json({ error: "Email already in use" }, { status: 409 });
//     }

//     const hashedPassword = await bcrypt.hash(password, 12);

//     let relatedData = {};
//     if (role === "TEACHER") {
//       relatedData = {
//         teacher: { create: { username, email } },
//       };
//     } else if (role === "PARENT") {
//       relatedData = {
//         parent: { create: { username, email } },
//       };
//     } else if (role === "ACCOUNTANT") {
//       relatedData = {
//         accountant: { create: { username, email } },
//       };
//     }

//     const user = await db.user.create({
//       data: {
//         username,
//         email,
//         password: hashedPassword,
//         role: role as Role,
//         isVerified: isVerified ?? false, 
//       },
//     });

//     return NextResponse.json(user);
//   } catch (error: any) {
//     console.error("[USERS_POST]", {
//       message: error.message,
//       code: error.code,
//       meta: error.meta,
//     });
//     return NextResponse.json(
//       { error: "Internal Server Error", details: error.message },
//       { status: 500 }
//     );
//   }
// }




import { NextResponse } from "next/server";
import { db } from "@/core/lib/db";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const role = searchParams.get("role");
    const isVerified = searchParams.get("isVerified");

    const where: any = {};

    if (search) {
      where.OR = [
        { username: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (role && role !== "all") {
      where.role = role as Role;
    }

    if (isVerified && isVerified !== "all") {
      where.isVerified = isVerified === "true";
    }

    const users = await db.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("[USERS_GET]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, password, role, isVerified } = body;

    if (!username || !email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate sex for students
    if (role === "STUDENT" && !body.sex) {
      return NextResponse.json(
        { error: "Sex is required for students" },
        { status: 400 }
      );
    }

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // ✅ Build related profile data per role
    let relatedData = {};
    if (role === "TEACHER") {
      relatedData = {
        teacher: { create: { username, email } },
      };
    } else if (role === "PARENT") {
      relatedData = {
        parent: { create: { username, email } },
      };
    } else if (role === "ACCOUNTANT") {
      relatedData = {
        accountant: { create: { username, email } },
      };
    } else if (role === "STUDENT") {
      relatedData = {
        student: {
          create: {
            username,
            email,
            sex: body.sex, // ✅ MALE or FEMALE
          },
        },
      };
    }

    const user = await db.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: role as Role,
        isVerified: isVerified ?? false,
        ...relatedData, // ✅ was missing before!
      },
    });

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("[USERS_POST]", {
      message: error.message,
      code: error.code,
      meta: error.meta,
    });
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: `Already exists: ${error.meta?.target}` },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}