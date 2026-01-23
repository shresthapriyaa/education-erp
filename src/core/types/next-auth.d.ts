// import { DefaultSession, DefaultUser } from "next-auth";

// declare module "next-auth" {
//   interface Session {
//     user: {
//       userId: string;
//       username: string;
//       isVerified: boolean;
//       role: string;
//     } & DefaultSession["user"];
//   }
// }

// declare module "next-auth" {
//   interface JWT {
//     userId: string;
//     username: string;
//     isVerified: boolean;
//     role: string;
//   }
//   interface User extends DefaultUser {
//     userId: string;
//     username: string;
//     role?: string;
//     isVerified?: boolean;
//   }
// }
import { DefaultSession, DefaultUser } from "next-auth"
import { JWT as DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      userId: string
      username: string | null
      role: string
      isVerified: boolean
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    username?: string | null
    role?: string
    isVerified?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    userId: string
    username: string | null
    role: string
    isVerified: boolean
  }
}