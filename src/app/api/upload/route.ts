import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string || "uploads";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 2MB" }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/\s+/g, "_");
    const filename = `${timestamp}-${originalName}`;

    // Create upload directory path - use existing structure
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
    
    console.log("[UPLOAD] Upload directory:", uploadDir);
    console.log("[UPLOAD] Folder parameter:", folder);
    
    // Ensure directory exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, ignore error
      console.log("[UPLOAD] Directory already exists or created");
    }

    // Write file
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);
    
    console.log("[UPLOAD] File saved to:", filepath);

    // Return public URL - should be /uploads/parents/filename.jpg
    const url = `/uploads/${folder}/${filename}`;
    
    console.log("[UPLOAD] Public URL:", url);

    return NextResponse.json({ url, filename }, { status: 200 });
  } catch (error: any) {
    console.error("[UPLOAD_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to upload file", details: error.message },
      { status: 500 }
    );
  }
}
