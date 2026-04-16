import { NextRequest, NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/core/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current user from database
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    // Build where clause based on user role
    let whereClause: any = {
      OR: [
        { senderId: currentUser.id },    // Messages sent by user
        { receiverId: currentUser.id },  // Messages received by user
      ],
    };

    // Add search filter if provided
    if (search) {
      whereClause = {
        AND: [
          whereClause,
          {
            OR: [
              { sender: { username: { contains: search, mode: "insensitive" } } },
              { receiver: { username: { contains: search, mode: "insensitive" } } },
              { content: { contains: search, mode: "insensitive" } },
            ],
          },
        ],
      };
    }

    const messages = await prisma.message.findMany({
      where: whereClause,
      select: {
        id: true,
        senderId: true,
        receiverId: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        sender: { select: { id: true, username: true, email: true, role: true } },
        receiver: { select: { id: true, username: true, email: true, role: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(messages);
  } catch (error: any) {
    console.error("[MESSAGES_GET]", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// export async function POST(req: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session?.user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const body = await req.json();

//     if (!body.receiverId || !body.content) {
//       return NextResponse.json({ error: "Missing: receiverId, content" }, { status: 400 });
//     }

//     const receiverExists = await prisma.user.findUnique({ where: { id: body.receiverId } });
//     if (!receiverExists) {
//       return NextResponse.json({ error: "Receiver not found" }, { status: 404 });
//     }

//     const message = await prisma.message.create({
//       data: {
//         senderId: session.user.userId as string,
//         receiverId: body.receiverId,
//         content: body.content.trim(),
//       },
//       select: {
//         id: true,
//         senderId: true,
//         receiverId: true,
//         content: true,
//         createdAt: true,
//         updatedAt: true,
//         sender: { select: { id: true, username: true, email: true, role: true } },
//         receiver: { select: { id: true, username: true, email: true, role: true } },
//       },
//     });

//     return NextResponse.json(message, { status: 201 });
//   } catch (error: any) {
//     console.error("[MESSAGES_POST]", error.message);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }


export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    if (!body.receiverId || !body.content) {
      return NextResponse.json({ error: "Missing: receiverId, content" }, { status: 400 });
    }

    const receiverExists = await prisma.user.findUnique({ where: { id: body.receiverId } });
    if (!receiverExists) {
      return NextResponse.json({ error: "Receiver not found" }, { status: 404 });
    }

    // Get sender from database using email from session
    const sender = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (!sender) {
      return NextResponse.json({ error: "Sender not found" }, { status: 404 });
    }

    const message = await prisma.message.create({
      data: {
        senderId: sender.id, // ✅ use sender.id from DB
        receiverId: body.receiverId,
        content: body.content.trim(),
      },
      select: {
        id: true,
        senderId: true,
        receiverId: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        sender: { select: { id: true, username: true, email: true, role: true } },
        receiver: { select: { id: true, username: true, email: true, role: true } },
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error: any) {
    console.error("[MESSAGES_POST]", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}