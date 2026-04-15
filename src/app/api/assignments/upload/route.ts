import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// Map mime type → subfolder under public/uploads/assignments/
function getFolderFromMime(mimeType: string): string {
  if (mimeType === "application/pdf") return "assignments/pdfs";
  if (mimeType.startsWith("application/vnd.openxmlformats-officedocument")) return "assignments/docs";
  if (mimeType.startsWith("application/msword")) return "assignments/docs";
  if (mimeType.startsWith("application/vnd.ms-")) return "assignments/docs";
  return "assignments/files";
}

// Size limit: 20MB for documents
function getSizeLimit(mimeType: string): number {
  return 20 * 1024 * 1024; // 20MB
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const sizeLimit = getSizeLimit(file.type);
    if (file.size > sizeLimit) {
      const limitMB = sizeLimit / (1024 * 1024);
      return NextResponse.json(
        { error: `File exceeds ${limitMB}MB limit` },
        { status: 400 }
      );
    }

    const bytes  = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const folder    = getFolderFromMime(file.type);
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
    await mkdir(uploadDir, { recursive: true });

    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    return NextResponse.json({ url: `/uploads/${folder}/${filename}` });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Upload failed" },
      { status: 500 }
    );
  }
}
