

// import { NextRequest, NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const token = await getToken({
//     req: request,
//     secret: process.env.NEXTAUTH_SECRET,
//   });

//   const isValidToken = token && token.userId && token.email;
  

//   console.log(token)

//   // Redirect unauthenticated users away from protected routes
//   if (
//     !isValidToken &&
//     (pathname.startsWith("/accountant") ||
//       pathname.startsWith("/admin") ||
//       pathname.startsWith("/student") ||
//       pathname.startsWith("/verification")||
//       pathname.startsWith("/parent") ||
//       pathname.startsWith("/teacher")

//     )
//   ) {
//     return NextResponse.redirect(new URL("/", request.url));
//   }

//   // Redirect authenticated users away from auth pages or home
//   if (
//     isValidToken &&
//     (pathname === "/" || pathname.startsWith("/auth")) &&
//     !pathname.startsWith("/accountant") &&
//     !pathname.startsWith("/admin") &&
//     !pathname.startsWith("/student") &&
//     !pathname.startsWith("/parent") &&
//     !pathname.startsWith("/teacher") &&
//     !pathname.startsWith("/verification")
//   ) {
//     const redirectUrl = token.isVerified
//       ? token.role === "ADMIN"
//         ? "/admin"
//         : token.role === "STUDENT"
//         ? "/student":
//         token.role === "TEACHER"
//         ? "/teacher"
//         : token.role === "PARENT"
//         ? "/parent"
//         : token.role === "ACCOUNTANT"
//         ? "/accountant"
//         : "/student"
//       : "/verification";
//     return NextResponse.redirect(new URL(redirectUrl, request.url));
//   }

//   // Prevent verified users from accessing verification page
//   if (token?.isVerified && pathname.startsWith("/verification")) {
//     const redirectUrl =
//       token.role === "ADMIN"
//         ? "/admin"
//         : token.role === "PARENT"
//         ? "/parent":
//         token.role === "ACCOUNTANT"?
//         "/staff":
//         token.role === "TEACHER"?
//         "/teacher":
//         "/student";
//     return NextResponse.redirect(new URL(redirectUrl, request.url));
//   }

//   // Prevent unverified users from accessing app and admin routes
//   if (
//     isValidToken &&
//     !token.isVerified &&
//     (pathname.startsWith("/admin") ||
//       pathname.startsWith("/teacher") ||
//       pathname.startsWith("/student") ||
//       pathname.startsWith("/parent") ||
//       pathname.startsWith("/accountant"))
//   ) {
//     return NextResponse.redirect(new URL("/verification", request.url));
//   }

//   // Role-based access control for verified users
//   if (isValidToken && token?.isVerified) {
    
//     if (
//       token.role === "ADMIN" &&
//       ( pathname.startsWith("/teacher") || pathname.startsWith("/student") || pathname.startsWith("/parent") || pathname.startsWith("/accountant"))
//     ) {
//       return NextResponse.redirect(new URL("/admin", request.url));
//     }
    
//     if (
//       token.role === "TEACHER" &&
//       (pathname.startsWith("/admin") || pathname.startsWith("/student") || pathname.startsWith("/parent") || pathname.startsWith("/accountant"))
//     ) {
//       return NextResponse.redirect(new URL("/teacher", request.url));
//     }

//     if (
//       token.role === "PARENT" &&
//       (pathname.startsWith("/admin") || pathname.startsWith("/teacher") || pathname.startsWith("/student") || pathname.startsWith("/parent") || pathname.startsWith("/accountant"))
//     ) {
//       return NextResponse.redirect(new URL("/parent", request.url));
//     }

//     if (
//       token.role === "STUDENT" &&
//       (pathname.startsWith("/admin") || pathname.startsWith("/teacher") || pathname.startsWith("/student") || pathname.startsWith("/parent") || pathname.startsWith("/accountant"))
//     ) {
//       return NextResponse.redirect(new URL("/student", request.url));
//     }

//     if (
//       token.role === "ACCOUNTANT" &&
//       (pathname.startsWith("/admin") || pathname.startsWith("/teacher") || pathname.startsWith("/student") || pathname.startsWith("/parent") || pathname.startsWith("/accountant"))
//     ) {
//       return NextResponse.redirect(new URL("/accountant", request.url));
//     }

//   }


// }




import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Map each role to its dashboard
const ROLE_DASHBOARD: Record<string, string> = {
  ADMIN: "/admin",
  TEACHER: "/teacher",
  STUDENT: "/student",
  PARENT: "/parent",
  ACCOUNTANT: "/accountant",
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from JWT
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!(token && token.userId && token.email);

  // --------------------------
  // 1️⃣ Unauthenticated users
  // --------------------------
  if (
    !isAuthenticated &&
    ["/admin", "/teacher", "/student", "/parent", "/accountant", "/verification"].some(path =>
      pathname.startsWith(path)
    )
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // --------------------------
  // 2️⃣ Authenticated users visiting auth or home page
  // --------------------------
  if (
    isAuthenticated &&
    (pathname === "/" || pathname.startsWith("/auth"))
  ) {
    const redirectUrl = token.isVerified
      ? ROLE_DASHBOARD[token.role as string] ?? "/student"
      : "/verification";

    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // --------------------------
  // 3️⃣ Verified users on verification page
  // --------------------------
  if (token?.isVerified && pathname.startsWith("/verification")) {
    const redirectUrl = ROLE_DASHBOARD[token.role as string] ?? "/student";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // --------------------------
  // 4️⃣ Unverified users trying to access dashboards
  // --------------------------
  if (
    isAuthenticated &&
    !token.isVerified &&
    ["/admin", "/teacher", "/student", "/parent", "/accountant"].some(path =>
      pathname.startsWith(path)
    )
  ) {
    return NextResponse.redirect(new URL("/verification", request.url));
  }

  // --------------------------
  // 5️⃣ Role-based access control
  // --------------------------
  if (isAuthenticated && token.isVerified) {
    const allowedPath = ROLE_DASHBOARD[token.role as string];

    // If user tries to access another role's page, redirect to their dashboard
    const restrictedPaths = Object.values(ROLE_DASHBOARD).filter(path => path !== allowedPath);

    if (restrictedPaths.some(path => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL(allowedPath, request.url));
    }
  }

  // --------------------------
  // ✅ Allow access
  // --------------------------
  return NextResponse.next();
}


