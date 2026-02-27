// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/core/lib/prisma";

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { userId, phone, address, sex, dateOfBirth, img } = body;

//     if (!userId) {
//       return NextResponse.json({ error: "userId is required" }, { status: 400 });
//     }

//     if (!phone || !address) {
//       return NextResponse.json(
//         { error: "Phone and address are required" },
//         { status: 400 }
//       );
//     }

//     const user = await prisma.user.findUnique({ where: { id: userId } });
//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     if (user.isVerified) {
//       return NextResponse.json({ error: "Already verified" }, { status: 400 });
//     }

//     const { role } = user;

//     if (role === "STUDENT" && (!sex || !dateOfBirth)) {
//       return NextResponse.json(
//         { error: "Sex and dateOfBirth are required for students" },
//         { status: 400 }
//       );
//     }

//     switch (role) {
//       case "STUDENT":
//         await prisma.student.update({
//           where: { userId },
//           data: {
//             phone,
//             address,
//             sex,
//             dateOfBirth: new Date(dateOfBirth),
//             img: img || null,
//           },
//         });
//         break;

//       case "TEACHER":
//         await prisma.teacher.update({
//           where: { userId },
//           data: {
//             phone,
//             address,
//             img: img || null,
//           },
//         });
//         break;

//       case "PARENT":
//         await prisma.parent.update({
//           where: { userId },
//           data: {
//             phone,
//             address,
//             img: img || null,
//           },
//         });
//         break;

//       case "ACCOUNTANT":
//         await prisma.accountant.update({
//           where: { userId },
//           data: {
//             phone,
//             address,
//             img: img || null,
//           },
//         });
//         break;

//       default:
//         return NextResponse.json({ error: "Invalid role" }, { status: 400 });
//     }

//     await prisma.user.update({
//       where: { id: userId },
//       data: { isVerified: true },
//     });

//     return NextResponse.json(
//       { message: "Onboarding completed successfully!", success: true },
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error("[ONBOARDING ERROR]", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }




import { NextRequest, NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;
    const body = await req.json();
    const { phone, address, sex, dateOfBirth, img, bloodGroup, parentName } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    if (!phone || !address) {
      return NextResponse.json({ error: "Phone and address are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json({ error: "Already verified" }, { status: 400 });
    }

    const { role } = user;

    if (role === "STUDENT" && (!sex || !dateOfBirth)) {
      return NextResponse.json(
        { error: "Sex and dateOfBirth are required for students" },
        { status: 400 }
      );
    }

    switch (role) {
      case "STUDENT":
        await prisma.student.update({
          where: { userId },
          data: {
            phone,
            address,
            sex,
            dateOfBirth: new Date(dateOfBirth),
            img: img || null,
            bloodGroup: bloodGroup || null,  // ← save bloodGroup
          },
        });
        break;

      case "TEACHER":
        await prisma.teacher.update({
          where: { userId },
          data: { phone, address, img: img || null },
        });
        break;

      case "PARENT":
        await prisma.parent.update({
          where: { userId },
          data: { phone, address, img: img || null },
        });
        break;

      case "ACCOUNTANT":
        await prisma.accountant.update({
          where: { userId },
          data: { phone, address, img: img || null },
        });
        break;

      default:
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { isVerified: true },
    });

    return NextResponse.json(
      { message: "Onboarding completed successfully!", success: true },
      { status: 200 }
    );

  } catch (error) {
    console.error("[ONBOARDING ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}