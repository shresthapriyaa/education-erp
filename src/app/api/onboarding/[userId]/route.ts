// // import prisma from "@/core/lib/prisma";
// // import { NextRequest, NextResponse } from "next/server";
// // import { success } from "zod";

// // export async function POST(request:NextRequest, {params}:{params: Promise<{userId: string}>}) {

// //     try {
// //     const { phone, address, sex, dateOfBirth, img } = await request.json();
// //         const {userId} = await params;
// //         console.log(userId)

// //         const user = await prisma.user.findUnique({where:{
// //             id: userId
// //         }});
// //         if(!user)
// //         {
// //             return NextResponse.json({message:"User not found"},{status:400})
// //         }


// //     const student = await prisma.student.create({
// //          data:{
// //             userId,
// //             email: user.email, 
// //             sex, 
// //             username: user.username, 
// //             address,
// //             phone,
// //             dateOfBirth: new Date(dateOfBirth),
// //             img,

// //          }
// //     })
// //     if(!student)
// //     {
// //             return NextResponse.json({message:"Error Creating Student"},{status:400})
// //         }
        
// //     } catch (error) {
// //         console.log(error)
// //         return NextResponse.json({
// //             error:"Internal Server Error",
// //             success: false
// //         },{status: 500})
// //     }
    
// // }


// // import prisma from "@/core/lib/prisma";
// // import { NextRequest, NextResponse } from "next/server";

// // export async function POST(
// //   request: NextRequest,
// //   { params }: { params: Promise<{ userId: string }> }
// // ) {
// //   try {
// //     const { userId } = await params;
// //     const { phone, address, sex, bloodGroup,dateOfBirth, img } = await request.json();

// //     const user = await prisma.user.findUnique({ where: { id: userId } });
// //     if (!user) {
// //       return NextResponse.json({ message: "User not found" }, { status: 404 });
// //     }

// //     switch (user.role) {
// //       case "STUDENT":
// //         await prisma.student.upsert({
// //           where: { userId },
// //           update: {
// //             phone,
// //             address,
// //             sex,
// //             bloodGroup,
// //             dateOfBirth: new Date(dateOfBirth),
// //             img: img || null,
// //           },
// //           create: {
// //             userId,
// //             email: user.email,
// //             username: user.username,
// //             phone,
// //             address,
// //             sex,
// //             bloodGroup,
// //             dateOfBirth: new Date(dateOfBirth),
// //             img: img || null,
// //           },
// //         });
// //         break;

// //       case "TEACHER":
// //         await prisma.teacher.upsert({
// //           where: { userId },
// //           update: { phone, address, img: img || null },
// //           create: {
// //             userId,
// //             email: user.email,
// //             username: user.username,
// //             phone,
// //             address,
           
// //             img: img || null,
// //           },
// //         });
// //         break;

// //       case "PARENT":
// //         await prisma.parent.upsert({
// //           where: { userId },
// //           update: { phone, address, img: img || null },
// //           create: {
// //             userId,
// //             email: user.email,
// //             username: user.username,
// //             phone,
// //             address,
// //             img: img || null,
// //           },
// //         });
// //         break;

// //       case "ACCOUNTANT":
// //         await prisma.accountant.upsert({
// //           where: { userId },
// //           update: { phone, address, img: img || null },
// //           create: {
// //             userId,
// //             email: user.email,
// //             username: user.username,
// //             phone,
// //             address,
// //             img: img || null,
// //           },
// //         });
// //         break;

// //       default:
// //         return NextResponse.json({ message: "Invalid role" }, { status: 400 });
// //     }

// //     return NextResponse.json(
// //       { message: "Profile created successfully!" },
// //       { status: 201 }
// //     );
// //   } catch (error) {
// //     console.log(error);
// //     return NextResponse.json(
// //       { message: "Internal Server Error", success: false },
// //       { status: 500 }
// //     );
// //   }
// // }

// // export async function PUT(
// //   request: NextRequest,
// //   { params }: { params: Promise<{ userId: string }> }
// // ) {
// //   try {
// //     const { userId } = await params;
// //     const { phone, address, sex, dateOfBirth,bloodgroup, img } = await request.json();

// //     const user = await prisma.user.findUnique({ where: { id: userId } });
// //     if (!user) {
// //       return NextResponse.json({ message: "User not found" }, { status: 404 });
// //     }

// //     switch (user.role) {
// //       case "STUDENT":
// //         await prisma.student.update({
// //           where: { userId },
// //           data: { phone, address, sex, dateOfBirth: new Date(dateOfBirth), img: img || null },
// //         });
// //         break;
// //       case "TEACHER":
// //         await prisma.teacher.update({
// //           where: { userId },
// //           data: { phone, address, img: img || null },
// //         });
// //         break;
// //       case "PARENT":
// //         await prisma.parent.update({
// //           where: { userId },
// //           data: { phone, address, img: img || null },
// //         });
// //         break;
// //       case "ACCOUNTANT":
// //         await prisma.accountant.update({
// //           where: { userId },
// //           data: { phone, address, img: img || null },
// //         });
// //         break;
// //       default:
// //         return NextResponse.json({ message: "Invalid role" }, { status: 400 });
// //     }

// //     return NextResponse.json({ message: "Profile updated successfully!" }, { status: 200 });
// //   } catch (error) {
// //     console.log(error);
// //     return NextResponse.json({ message: "Internal Server Error", success: false }, { status: 500 });
// //   }
// // }

// // export async function PATCH(
// //   request: NextRequest,
// //   { params }: { params: Promise<{ userId: string }> }
// // ) {
// //   try {
// //     const { userId } = await params;
// //     const body = await request.json();

// //     const user = await prisma.user.findUnique({ where: { id: userId } });
// //     if (!user) {
// //       return NextResponse.json({ message: "User not found" }, { status: 404 });
// //     }

// //     switch (user.role) {
// //       case "STUDENT":
// //         await prisma.student.update({
// //           where: { userId },
// //           data: {
// //             ...(body.phone && { phone: body.phone }),
// //             ...(body.address && { address: body.address }),
// //             ...(body.sex && { sex: body.sex }),
// //             ...(body.bloodGroup && {bloodGroup: body.bloodGroup}),
// //             ...(body.dateOfBirth && { dateOfBirth: new Date(body.dateOfBirth) }),
// //             ...(body.img && { img: body.img }),
// //           },
// //         });
// //         break;
// //       case "TEACHER":
// //         await prisma.teacher.update({
// //           where: { userId },
// //           data: {
// //             ...(body.phone && { phone: body.phone }),
// //             ...(body.address && { address: body.address }),
// //             ...(body.img && { img: body.img }),
// //           },
// //         });
// //         break;
// //       case "PARENT":
// //         await prisma.parent.update({
// //           where: { userId },
// //           data: {
// //             ...(body.phone && { phone: body.phone }),
// //             ...(body.address && { address: body.address }),
// //             ...(body.img && { img: body.img }),
// //           },
// //         });
// //         break;
// //       case "ACCOUNTANT":
// //         await prisma.accountant.update({
// //           where: { userId },
// //           data: {
// //             ...(body.phone && { phone: body.phone }),
// //             ...(body.address && { address: body.address }),
// //             ...(body.img && { img: body.img }),
// //           },
// //         });
// //         break;
// //       default:
// //         return NextResponse.json({ message: "Invalid role" }, { status: 400 });
// //     }

// //     return NextResponse.json({ message: "Profile patched successfully!" }, { status: 200 });
// //   } catch (error) {
// //     console.log(error);
// //     return NextResponse.json({ message: "Internal Server Error", success: false }, { status: 500 });
// //   }
// // }

// // export async function DELETE(
// //   request: NextRequest,
// //   { params }: { params: Promise<{ userId: string }> }
// // ) {
// //   try {
// //     const { userId } = await params;

// //     const user = await prisma.user.findUnique({ where: { id: userId } });
// //     if (!user) {
// //       return NextResponse.json({ message: "User not found" }, { status: 404 });
// //     }

// //     switch (user.role) {
// //       case "STUDENT":
// //         await prisma.student.delete({ where: { userId } });
// //         break;
// //       case "TEACHER":
// //         await prisma.teacher.delete({ where: { userId } });
// //         break;
// //       case "PARENT":
// //         await prisma.parent.delete({ where: { userId } });
// //         break;
// //       case "ACCOUNTANT":
// //         await prisma.accountant.delete({ where: { userId } });
// //         break;
// //       default:
// //         return NextResponse.json({ message: "Invalid role" }, { status: 400 });
// //     }

// //     return NextResponse.json({ message: "Profile deleted successfully!" }, { status: 200 });
// //   } catch (error) {
// //     console.log(error);
// //     return NextResponse.json({ message: "Internal Server Error", success: false }, { status: 500 });
// //   }
// // }

// import prisma from "@/core/lib/prisma";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(
//   request: NextRequest,
//   { params }: { params: Promise<{ userId: string }> }
// ) {
//   try {
//     const { userId } = await params;
//     const { phone, address, sex, bloodGroup, dateOfBirth, img } = await request.json();

//     const user = await prisma.user.findUnique({ where: { id: userId } });
//     if (!user) {
//       return NextResponse.json({ message: "User not found" }, { status: 404 });
//     }

//     switch (user.role) {
//       case "STUDENT":
//         await prisma.student.upsert({
//           where: { userId },
//           update: {
//             phone,
//             address,
//             sex,
//             bloodGroup,
//             dateOfBirth: new Date(dateOfBirth),
//             img: img || null,
//           },
//           create: {
//             userId,
//             email: user.email,
//             username: user.username,
//             phone,
//             address,
//             sex,
//             bloodGroup,
//             dateOfBirth: new Date(dateOfBirth),
//             img: img || null,
//           },
//         });
//         break;

//       case "TEACHER":
//         await prisma.teacher.upsert({
//           where: { userId },
//           update: { phone, address, img: img || null },
//           create: {
//             userId,
//             email: user.email,
//             username: user.username,
//             phone,
//             address,
//             img: img || null,
//           },
//         });
//         break;

//       case "PARENT":
//         await prisma.parent.upsert({
//           where: { userId },
//           update: { phone, address, img: img || null },
//           create: {
//             userId,
//             email: user.email,
//             username: user.username,
//             phone,
//             address,
//             img: img || null,
//           },
//         });
//         break;

//       case "ACCOUNTANT":
//         await prisma.accountant.upsert({
//           where: { userId },
//           update: { phone, address, img: img || null },
//           create: {
//             userId,
//             email: user.email,
//             username: user.username,
//             phone,
//             address,
//             img: img || null,
//           },
//         });
//         break;

//       default:
//         return NextResponse.json({ message: "Invalid role" }, { status: 400 });
//     }

//     // ✅ Mark user as verified after onboarding
//     await prisma.user.update({
//       where: { id: userId },
//       data: { isVerified: true },
//     });

//     return NextResponse.json(
//       { message: "Profile created successfully!" },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json(
//       { message: "Internal Server Error", success: false },
//       { status: 500 }
//     );
//   }
// }

// export async function PUT(
//   request: NextRequest,
//   { params }: { params: Promise<{ userId: string }> }
// ) {
//   try {
//     const { userId } = await params;
//     const { phone, address, sex, dateOfBirth, bloodGroup, img } = await request.json();

//     const user = await prisma.user.findUnique({ where: { id: userId } });
//     if (!user) {
//       return NextResponse.json({ message: "User not found" }, { status: 404 });
//     }

//     switch (user.role) {
//       case "STUDENT":
//         await prisma.student.update({
//           where: { userId },
//           data: {
//             phone,
//             address,
//             sex,
//             bloodGroup,
//             dateOfBirth: new Date(dateOfBirth),
//             img: img || null,
//           },
//         });
//         break;
//       case "TEACHER":
//         await prisma.teacher.update({
//           where: { userId },
//           data: { phone, address, img: img || null },
//         });
//         break;
//       case "PARENT":
//         await prisma.parent.update({
//           where: { userId },
//           data: { phone, address, img: img || null },
//         });
//         break;
//       case "ACCOUNTANT":
//         await prisma.accountant.update({
//           where: { userId },
//           data: { phone, address, img: img || null },
//         });
//         break;
//       default:
//         return NextResponse.json({ message: "Invalid role" }, { status: 400 });
//     }

//     return NextResponse.json({ message: "Profile updated successfully!" }, { status: 200 });
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json({ message: "Internal Server Error", success: false }, { status: 500 });
//   }
// }

// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: Promise<{ userId: string }> }
// ) {
//   try {
//     const { userId } = await params;
//     const body = await request.json();

//     const user = await prisma.user.findUnique({ where: { id: userId } });
//     if (!user) {
//       return NextResponse.json({ message: "User not found" }, { status: 404 });
//     }

//     switch (user.role) {
//       case "STUDENT":
//         await prisma.student.update({
//           where: { userId },
//           data: {
//             ...(body.phone && { phone: body.phone }),
//             ...(body.address && { address: body.address }),
//             ...(body.sex && { sex: body.sex }),
//             ...(body.bloodGroup && { bloodGroup: body.bloodGroup }),
//             ...(body.dateOfBirth && { dateOfBirth: new Date(body.dateOfBirth) }),
//             ...(body.img && { img: body.img }),
//           },
//         });
//         break;
//       case "TEACHER":
//         await prisma.teacher.update({
//           where: { userId },
//           data: {
//             ...(body.phone && { phone: body.phone }),
//             ...(body.address && { address: body.address }),
//             ...(body.img && { img: body.img }),
//           },
//         });
//         break;
//       case "PARENT":
//         await prisma.parent.update({
//           where: { userId },
//           data: {
//             ...(body.phone && { phone: body.phone }),
//             ...(body.address && { address: body.address }),
//             ...(body.img && { img: body.img }),
//           },
//         });
//         break;
//       case "ACCOUNTANT":
//         await prisma.accountant.update({
//           where: { userId },
//           data: {
//             ...(body.phone && { phone: body.phone }),
//             ...(body.address && { address: body.address }),
//             ...(body.img && { img: body.img }),
//           },
//         });
//         break;
//       default:
//         return NextResponse.json({ message: "Invalid role" }, { status: 400 });
//     }

//     return NextResponse.json({ message: "Profile patched successfully!" }, { status: 200 });
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json({ message: "Internal Server Error", success: false }, { status: 500 });
//   }
// }

// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: Promise<{ userId: string }> }
// ) {
//   try {
//     const { userId } = await params;

//     const user = await prisma.user.findUnique({ where: { id: userId } });
//     if (!user) {
//       return NextResponse.json({ message: "User not found" }, { status: 404 });
//     }

//     switch (user.role) {
//       case "STUDENT":
//         await prisma.student.delete({ where: { userId } });
//         break;
//       case "TEACHER":
//         await prisma.teacher.delete({ where: { userId } });
//         break;
//       case "PARENT":
//         await prisma.parent.delete({ where: { userId } });
//         break;
//       case "ACCOUNTANT":
//         await prisma.accountant.delete({ where: { userId } });
//         break;
//       default:
//         return NextResponse.json({ message: "Invalid role" }, { status: 400 });
//     }

//     return NextResponse.json({ message: "Profile deleted successfully!" }, { status: 200 });
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json({ message: "Internal Server Error", success: false }, { status: 500 });
//   }
// }




import prisma from "@/core/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const { phone, address, sex, bloodGroup, dateOfBirth, img } = await request.json();

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    switch (user.role) {
      case "STUDENT":
        await prisma.student.upsert({
          where: { userId },
          update: {
            phone,
            address,
            sex,
            bloodGroup,
            dateOfBirth: new Date(dateOfBirth),
            img: img || null,
          },
          create: {
            userId,
            email: user.email,
            username: user.username,
            phone,
            address,
            sex,
            bloodGroup,
            dateOfBirth: new Date(dateOfBirth),
            img: img || null,
          },
        });
        break;

      case "TEACHER":
        await prisma.teacher.upsert({
          where: { userId },
          update: { phone, address, img: img || null },
          create: {
            userId,
            email: user.email,
            username: user.username,
            phone,
            address,
            img: img || null,
          },
        });
        break;

      case "PARENT":
        await prisma.parent.upsert({
          where: { userId },
          update: { phone, address, img: img || null },
          create: {
            userId,
            email: user.email,
            username: user.username,
            phone,
            address,
            img: img || null,
          },
        });
        break;

      case "ACCOUNTANT":
        await prisma.accountant.upsert({
          where: { userId },
          update: { phone, address, img: img || null },
          create: {
            userId,
            email: user.email,
            username: user.username,
            phone,
            address,
            img: img || null,
          },
        });
        break;

      default:
        return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Profile created successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const { phone, address, sex, dateOfBirth, bloodGroup, img } = await request.json();

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    switch (user.role) {
      case "STUDENT":
        await prisma.student.update({
          where: { userId },
          data: {
            phone,
            address,
            sex,
            bloodGroup,
            dateOfBirth: new Date(dateOfBirth),
            img: img || null,
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
        return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    return NextResponse.json({ message: "Profile updated successfully!" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Internal Server Error", success: false }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const body = await request.json();

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    switch (user.role) {
      case "STUDENT":
        await prisma.student.update({
          where: { userId },
          data: {
            ...(body.phone && { phone: body.phone }),
            ...(body.address && { address: body.address }),
            ...(body.sex && { sex: body.sex }),
            ...(body.bloodGroup && { bloodGroup: body.bloodGroup }),
            ...(body.dateOfBirth && { dateOfBirth: new Date(body.dateOfBirth) }),
            ...(body.img && { img: body.img }),
          },
        });
        break;
      case "TEACHER":
        await prisma.teacher.update({
          where: { userId },
          data: {
            ...(body.phone && { phone: body.phone }),
            ...(body.address && { address: body.address }),
            ...(body.img && { img: body.img }),
          },
        });
        break;
      case "PARENT":
        await prisma.parent.update({
          where: { userId },
          data: {
            ...(body.phone && { phone: body.phone }),
            ...(body.address && { address: body.address }),
            ...(body.img && { img: body.img }),
          },
        });
        break;
      case "ACCOUNTANT":
        await prisma.accountant.update({
          where: { userId },
          data: {
            ...(body.phone && { phone: body.phone }),
            ...(body.address && { address: body.address }),
            ...(body.img && { img: body.img }),
          },
        });
        break;
      default:
        return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    return NextResponse.json({ message: "Profile patched successfully!" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Internal Server Error", success: false }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    switch (user.role) {
      case "STUDENT":
        await prisma.student.delete({ where: { userId } });
        break;
      case "TEACHER":
        await prisma.teacher.delete({ where: { userId } });
        break;
      case "PARENT":
        await prisma.parent.delete({ where: { userId } });
        break;
      case "ACCOUNTANT":
        await prisma.accountant.delete({ where: { userId } });
        break;
      default:
        return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    return NextResponse.json({ message: "Profile deleted successfully!" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Internal Server Error", success: false }, { status: 500 });
  }
}

