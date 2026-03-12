import { NextRequest, NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

type Params = { params: Promise<{ id: string }> };

// ── GET /api/library/[id] ─────────────────────────────────────────────────────
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const book = await prisma.libraryBook.findUnique({ where: { id } });
    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }
    return NextResponse.json(book);
  } catch (error: any) {
    console.error("[LIBRARY_ID_GET]", error.message);
    return NextResponse.json({ error: "Failed to fetch book" }, { status: 500 });
  }
}

// ── PATCH /api/library/[id] ───────────────────────────────────────────────────
export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const body = await req.json();

    const book = await prisma.libraryBook.update({
      where: { id },
      data: {
        ...(body.title         !== undefined && { title:         body.title.trim() }),
        ...(body.author        !== undefined && { author:        body.author.trim() }),
        ...(body.isbn          !== undefined && { isbn:          body.isbn.trim() }),
        ...(body.publishedDate !== undefined && { publishedDate: new Date(body.publishedDate) }),
      },
    });

    return NextResponse.json(book);
  } catch (error: any) {
    console.error("[LIBRARY_ID_PATCH]", error.message);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }
    if (error.code === "P2002") {
      return NextResponse.json({ error: "A book with this ISBN already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    await prisma.libraryBook.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[LIBRARY_ID_DELETE]", error.message);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}