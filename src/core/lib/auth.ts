
import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import prisma from "./prisma"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) throw new Error("No user found")
        if (!user.password) throw new Error("Use Google Sign In")

        const isValid = await compare(credentials.password, user.password)
        if (!isValid) throw new Error("Invalid password")

        return {
          id: user.id,
          email: user.email,
          name: user.username,
        }
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      })

      if (!existingUser && account?.provider === "google") {
        await prisma.user.create({
          data: {
            email: user.email,
            username: user.name || user.email.split("@")[0],
            role: "STUDENT",
            isVerified: true,
          },
        })
      }

      return true
    },

    // ✅ FIXED JWT CALLBACK (CRITICAL)
    async jwt({ token, user }) {
      // 1️⃣ Always persist email
      if (user?.email) {
        token.email = user.email
      }

      if (!token.email) return token

      // 2️⃣ ALWAYS sync token with DB
      const dbUser = await prisma.user.findUnique({
        where: { email: token.email },
      })

      if (dbUser) {
        token.userId = dbUser.id
        token.username = dbUser.username
        token.role = dbUser.role
        token.isVerified = dbUser.isVerified
      }

      return token
    },

    // ✅ SIMPLE session (NO DB HIT)
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string
        session.user.username = token.username as string
        session.user.role = token.role as string
        session.user.isVerified = token.isVerified as boolean
        session.user.email = token.email as string
      }
      return session
    },
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
}













