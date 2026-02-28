import "dotenv/config"; // ← add this
import prisma from "@/core/lib/prisma";
import fs from "fs";
import path from "path";

async function main() {
  const students = await prisma.student.findMany({
    where: { img: { not: null } },
    select: { id: true, img: true },
  });

  for (const student of students) {
    if (!student.img) continue;

    const filePath = path.join(process.cwd(), "public", student.img);
    if (!fs.existsSync(filePath)) {
      await prisma.student.update({
        where: { id: student.id },
        data: { img: null },
      });
      console.log(`Cleared missing image for student ${student.id}: ${student.img}`);
    }
  }

  console.log("Done.");
}

main().catch(console.error).finally(() => prisma.$disconnect());