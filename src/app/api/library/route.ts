import { NextRequest, NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const books = await prisma.libraryBook.findMany({
      where: search ? {
        OR: [
          { title:  { contains: search, mode: "insensitive" } },
          { author: { contains: search, mode: "insensitive" } },
          { isbn:   { contains: search, mode: "insensitive" } },
        ],
      } : undefined,
      orderBy: { title: "asc" },
    });

    return NextResponse.json(books);
  } catch (error: any) {
    console.error("[LIBRARY_GET]", error.message);
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 });
  }
}

// ── POST /api/library ─────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const missing = ["title", "author", "isbn", "publishedDate"].filter(f => !body[f]);
    if (missing.length) {
      return NextResponse.json({ error: `Missing: ${missing.join(", ")}` }, { status: 400 });
    }

    const book = await prisma.libraryBook.create({
      data: {
        title:         body.title.trim(),
        author:        body.author.trim(),
        isbn:          body.isbn.trim(),
        publishedDate: new Date(body.publishedDate),
      },
    });

    return NextResponse.json(book, { status: 201 });
  } catch (error: any) {
    console.error("[LIBRARY_POST]", error.message);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "A book with this ISBN already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}