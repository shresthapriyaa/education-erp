import { NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await prisma.message.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Message not found" }, { status: 404 });

    await prisma.message.delete({ where: { id } });
    return NextResponse.json({ message: "Message deleted successfully" });
  } catch (error: any) {
    console.error("[MESSAGE_DELETE]", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}