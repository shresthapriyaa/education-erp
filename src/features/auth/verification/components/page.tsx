// "use client";

// import { useEffect } from "react";
// import { useSession, signOut } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { Clock, LogOut, Shield } from "lucide-react";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/core/components/ui/card";
// import { Alert, AlertDescription } from "@/core/components/ui/alert";
// import { Button } from "@/core/components/ui/button";

// export default function VerificationPage() {
//   const { data: session, status, update } = useSession();
//   const router = useRouter();

//   // Redirect when verified
//   useEffect(() => {
//     if (status !== "authenticated") return;

//     if (session.user.isVerified) {
//       const roleRedirect: Record<string, string> = {
//         STUDENT: "/student",
//         TEACHER: "/teacher",
//         PARENT: "/parent",
//         ADMIN: "/admin",
//         ACCOUNTANT: "/accountant",
//       };

//       router.replace(roleRedirect[session.user.role] ?? "/student");
//     }
//   }, [status, session, router]);

//   // Poll for verification update
//   useEffect(() => {
//     if (status !== "authenticated") return;
//     if (session.user.isVerified) return;

//     const interval = setInterval(async () => {
//       await update(); // refresh JWT/session
//     }, 5000);

//     return () => clearInterval(interval);
//   }, [status, session, update]);

//   // ✅ Only ONE loading source
//   if (status === "loading") {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         Loading...
//       </div>
//     );
//   }

//   // If not logged in
//   if (status !== "authenticated") {
//     router.replace("/auth/login");
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-background flex items-center justify-center p-4">
//       <Card className="w-full max-w-md">
//         <CardHeader className="text-center space-y-4">
//           <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
//             <Clock className="w-8 h-8 text-muted-foreground" />
//           </div>
//           <div>
//             <CardTitle className="text-2xl font-bold">
//               Verification Pending
//             </CardTitle>
//             <CardDescription className="mt-2">
//               Your account is currently under review
//             </CardDescription>
//           </div>
//         </CardHeader>

//         <CardContent className="space-y-6">
//           <Alert>
//             <Shield className="h-4 w-4" />
//             <AlertDescription>
//               Please contact your administrator to complete the verification
//               process. You will be redirected automatically once approved.
//             </AlertDescription>
//           </Alert>

//           <Button onClick={() => signOut()} className="w-full" size="lg">
//             <LogOut className="w-4 h-4 mr-2" />
//             Sign Out
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }






// // "use client";

// // import { useEffect, useRef } from "react";
// // import { useSession, signOut } from "next-auth/react";
// // import { useRouter } from "next/navigation";
// // import { Clock, LogOut, Shield } from "lucide-react";
// // import {
// //   Card,
// //   CardContent,
// //   CardDescription,
// //   CardHeader,
// //   CardTitle,
// // } from "@/core/components/ui/card";
// // import { Alert, AlertDescription } from "@/core/components/ui/alert";
// // import { Button } from "@/core/components/ui/button";
// // import { Badge } from "@/core/components/ui/badge";

// // const ROLE_REDIRECTS: Record<string, string> = {
// //   STUDENT: "/student",
// //   TEACHER: "/teacher",
// //   PARENT: "/parent",
// //   ADMIN: "/admin",
// //   ACCOUNTANT: "/accountant",
// // };

// // export default function VerificationPage() {
// //   const { data: session, status, update } = useSession();
// //   const router = useRouter();

// //   // Keep update in a ref so the polling effect never needs it as a dep
// //   const updateRef = useRef(update);
// //   useEffect(() => {
// //     updateRef.current = update;
// //   }, [update]);

// //   // Redirect to login if unauthenticated
// //   useEffect(() => {
// //     if (status === "unauthenticated") {
// //       router.replace("/auth/login");
// //     }
// //   }, [status, router]);

// //   // Redirect to dashboard once verified
// //   useEffect(() => {
// //     if (status !== "authenticated") return;
// //     if (!session.user.isVerified) return;

// //     const path = ROLE_REDIRECTS[session.user.role] ?? "/student";
// //     router.replace(path);
// //   }, [status, session, router]);

// //   // Poll every 5s — refresh JWT to pick up isVerified change
// //   useEffect(() => {
// //     if (status !== "authenticated") return;
// //     if (session?.user.isVerified) return;

// //     const interval = setInterval(() => {
// //       updateRef.current();
// //     }, 5000);

// //     return () => clearInterval(interval);
// //   }, [status, session?.user.isVerified]);

// //   if (status === "loading") {
// //     return (
// //       <div className="flex min-h-screen items-center justify-center">
// //         <Clock className="animate-spin w-6 h-6 text-muted-foreground" />
// //       </div>
// //     );
// //   }

// //   if (status !== "authenticated") return null;

// //   const { username, email, role } = session.user;

// //   return (
// //     <div className="min-h-screen bg-background flex items-center justify-center p-4">
// //       <Card className="w-full max-w-md">
// //         <CardHeader className="text-center space-y-4">
// //           <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
// //             <Clock className="w-8 h-8 text-muted-foreground" />
// //           </div>
// //           <div className="space-y-1">
// //             <CardTitle className="text-2xl font-bold">
// //               Verification Pending
// //             </CardTitle>
// //             <CardDescription>
// //               Your account is currently under review
// //             </CardDescription>
// //           </div>
// //         </CardHeader>

// //         <CardContent className="space-y-6">
// //           {/* Show who is logged in */}
// //           <div className="rounded-lg border bg-muted/40 px-4 py-3 space-y-1">
// //             <div className="flex items-center justify-between">
// //               <span className="text-sm text-muted-foreground">Signed in as</span>
// //               <Badge variant="secondary" className="text-xs capitalize">
// //                 {role.toLowerCase()}
// //               </Badge>
// //             </div>
// //             <p className="font-medium text-sm">{username}</p>
// //             <p className="text-xs text-muted-foreground">{email}</p>
// //           </div>

// //           <Alert>
// //             <Shield className="h-4 w-4" />
// //             <AlertDescription>
// //               Please contact your administrator to complete the verification
// //               process. You will be redirected automatically once approved.
// //             </AlertDescription>
// //           </Alert>

// //           <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
// //             <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
// //             Checking for approval every 5 seconds…
// //           </div>

// //           <Button
// //             variant="outline"
// //             onClick={() => signOut({ callbackUrl: "/auth/login" })}
// //             className="w-full"
// //             size="lg"
// //           >
// //             <LogOut className="w-4 h-4 mr-2" />
// //             Sign Out
// //           </Button>
// //         </CardContent>
// //       </Card>
// //     </div>
// //   );
// // }






"use client";

import { useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Clock, LogOut, Shield } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Alert, AlertDescription } from "@/core/components/ui/alert";
import { Button } from "@/core/components/ui/button";
import { Badge } from "@/core/components/ui/badge";

const ROLE_REDIRECTS: Record<string, string> = {
  STUDENT: "/student",
  TEACHER: "/teacher",
  PARENT: "/parent",
  ADMIN: "/admin",
  ACCOUNTANT: "/accountant",
};

export default function VerificationPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  // Keep update in a ref so the polling effect never needs it as a dep
  const updateRef = useRef(update);
  useEffect(() => {
    updateRef.current = update;
  }, [update]);

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/login");
    }
  }, [status, router]);

  // Redirect to dashboard once verified
  useEffect(() => {
    if (status !== "authenticated") return;
    if (!session.user.isVerified) return;

    const path = ROLE_REDIRECTS[session.user.role] ?? "/student";
    router.replace(path);
  }, [status, session, router]);

  // Poll every 5s — refresh JWT to pick up isVerified change
  useEffect(() => {
    if (status !== "authenticated") return;
    if (session?.user.isVerified) return;

    const interval = setInterval(() => {
      updateRef.current();
    }, 5000);

    return () => clearInterval(interval);
  }, [status, session?.user.isVerified]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Clock className="animate-spin w-6 h-6 text-muted-foreground" />
      </div>
    );
  }

  if (status !== "authenticated") return null;

  const { username, email, role } = session.user;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <Clock className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              Verification Pending
            </CardTitle>
            <CardDescription>
              Your account is currently under review
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Show who is logged in */}
          <div className="rounded-lg border bg-muted/40 px-4 py-3 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Signed in as</span>
              <Badge variant="secondary" className="text-xs capitalize">
                {role.toLowerCase()}
              </Badge>
            </div>
            <p className="font-medium text-sm">{username}</p>
            <p className="text-xs text-muted-foreground">{email}</p>
          </div>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Please contact your administrator to complete the verification
              process. You will be redirected automatically once approved.
            </AlertDescription>
          </Alert>

          <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Checking for approval every 5 seconds…
          </div>

          <Button
            variant="outline"
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="w-full"
            size="lg"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}