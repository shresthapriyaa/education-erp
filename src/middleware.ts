// import { NextRequest, NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";

// // Map each role to its dashboard
// const ROLE_DASHBOARD: Record<string, string> = {
//   ADMIN: "/admin",
//   TEACHER: "/teacher",
//   STUDENT: "/student",
//   PARENT: "/parent",
//   ACCOUNTANT: "/accountant",
// };

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   // Get token from JWT
//   const token = await getToken({
//     req: request,
//     secret: process.env.NEXTAUTH_SECRET,
//   });

//   const isAuthenticated = !!(token && token.userId && token.email);

//   // --------------------------
//   // Unauthenticated users
//   // --------------------------
//   if (
//     !isAuthenticated &&
//     ["/admin", "/teacher", "/student", "/parent", "/accountant", "/verification"].some(path =>
//       pathname.startsWith(path)
//     )
//   ) {
//     return NextResponse.redirect(new URL("/", request.url));
//   }

//   // --------------------------
//   // 2 Authenticated users visiting auth or home page
//   // --------------------------
//   if (
//     isAuthenticated &&
//     (pathname === "/" || pathname.startsWith("/auth"))
//   ) {
//     const redirectUrl = token.isVerified
//       ? ROLE_DASHBOARD[token.role as string] ?? "/student"
//       : "/verification";

//     return NextResponse.redirect(new URL(redirectUrl, request.url));
//   }

//   // --------------------------
//   // 3️ Verified users on verification page
//   // --------------------------
//   if (token?.isVerified && pathname.startsWith("/verification")) {
//     const redirectUrl = ROLE_DASHBOARD[token.role as string] ?? "/student";
//     return NextResponse.redirect(new URL(redirectUrl, request.url));
//   }

//   // --------------------------
//   // 4️ Unverified users trying to access dashboards
//   // --------------------------
//   if (
//     isAuthenticated &&
//     !token.isVerified &&
//     ["/admin", "/teacher", "/student", "/parent", "/accountant"].some(path =>
//       pathname.startsWith(path)
//     )
//   ) {
//     return NextResponse.redirect(new URL
//       ("/verification", 
//         request.url
//       ));
//   }

//   // --------------------------
//   // 5️ Role-based access control
//   // --------------------------
//   if (isAuthenticated && token.isVerified) {
//     const allowedPath = ROLE_DASHBOARD[token.role as string];

//     // If user tries to access another role's page, redirect to their dashboard
//     const restrictedPaths = Object.values(ROLE_DASHBOARD).filter(path => path !== allowedPath);

//     if (restrictedPaths.some(path => pathname.startsWith(path))) {
//       return NextResponse.redirect(new URL(allowedPath, request.url));
//     }
//   }

//   // --------------------------
//   // ✅ Allow access
//   // --------------------------
//   return NextResponse.next();
// }




import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const ROLE_DASHBOARD: Record<string, string> = {
  ADMIN: "/admin",
  TEACHER: "/teacher",
  STUDENT: "/student",
  PARENT: "/parent",
  ACCOUNTANT: "/accountant",
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!(token && token.userId && token.email);
  const isVerified = !!(token?.isVerified);
  const onboarded = !!(token?.onboarded);
  const isAdmin = token?.role === "ADMIN";

  // 1 Unauthenticated users trying to access protected pages
  if (
    !isAuthenticated &&
    ["/admin", "/teacher", "/student", "/parent", "/accountant", "/verification", "/onboarding"].some(
      (path) => pathname.startsWith(path)
    )
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2 Authenticated users visiting auth or home page
  if (isAuthenticated && (pathname === "/" || pathname.startsWith("/auth"))) {
    // Admin always goes directly to /admin
    if (isAdmin) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    let redirectUrl = "/onboarding";
    if (onboarded && !isVerified) redirectUrl = "/verification";
    if (isVerified) redirectUrl = ROLE_DASHBOARD[token!.role as string] ?? "/student";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // 3 Verified users on verification or onboarding page
  if (
    isVerified &&
    (pathname.startsWith("/verification") || pathname.startsWith("/onboarding"))
  ) {
    const redirectUrl = ROLE_DASHBOARD[token!.role as string] ?? "/student";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // 4 Onboarded but unverified users on onboarding page
  if (isAuthenticated && !isAdmin && onboarded && pathname.startsWith("/onboarding")) {
    return NextResponse.redirect(new URL("/verification", request.url));
  }

  // 5 Not onboarded users trying to access verification or dashboards
  if (
    isAuthenticated &&
    !isAdmin &&
    !onboarded &&
    (pathname.startsWith("/verification") ||
      ["/admin", "/teacher", "/student", "/parent", "/accountant"].some((path) =>
        pathname.startsWith(path)
      ))
  ) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  // 6 Unverified users trying to access dashboards
  if (
    isAuthenticated &&
    !isAdmin &&
    !isVerified &&
    ["/admin", "/teacher", "/student", "/parent", "/accountant"].some((path) =>
      pathname.startsWith(path)
    )
  ) {
    return NextResponse.redirect(new URL("/verification", request.url));
  }

  // 7 Role-based access control for verified users
  if (isAuthenticated && isVerified) {
    const allowedPath = ROLE_DASHBOARD[token!.role as string];
    const restrictedPaths = Object.values(ROLE_DASHBOARD).filter(
      (path) => path !== allowedPath
    );

    if (restrictedPaths.some((path) => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL(allowedPath, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};