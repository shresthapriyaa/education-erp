import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import prisma  from "@/core/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, email, password, role } = body;

   
    if (!username || !email || !password) {
      return NextResponse.json(
        {
           message: "Missing fields" 
          },
           { 
            status: 400 
          })
          ;
    }

   
    const hashedPassword = await hash(password, 10);
   
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: role || "STUDENT", 
        isVerified: false, 
      },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
   
    if (error.code === "P2002") {
      return NextResponse.json(
        {
           error: "Username or email already exists"

         },
        {
           status: 409 
          }
      );
    }
 
    return NextResponse.json(
      { 
        error: "Failed to create user"
       },
      { 
        status: 500
       }
    );
  }
 
}





