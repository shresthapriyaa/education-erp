
// "use client";

// import { useEffect, useState } from "react";
// import { useSession, signOut } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { Clock, LogOut, Shield } from "lucide-react";
// import {
//   Card, CardContent, CardDescription, CardHeader, CardTitle,
// } from "@/core/components/ui/card";
// import { Alert, AlertDescription } from "@/core/components/ui/alert";
// import { Button } from "@/core/components/ui/button";

// export default function VerificationPage() {
//   const { data: session, status, update } = useSession();
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (status === "loading") return; 
   
//     if (session?.user?.isVerified) {
//       switch (session.user.role) {
//         case "STUDENT":
//           router.push("/student");
//           break;
//         case "TEACHER":
//           router.push("/teacher");
//           break;
//         case "PARENT":
//           router.push("/parent");
//           break;
//         case "ADMIN":
//           router.push("/admin");
//           break;
//         case "ACCOUNTANT":
//           router.push("/accountant");
//           break;
//         default:
//           router.push("/student");
//       }
//     } else {
//       setLoading(false); 
//     }
//   }, [session, status, router]);

  
//   useEffect(() => {
//     if (!session?.user || session.user.isVerified) return;

//     const interval = setInterval(async () => {
      
//       await update();
//     }, 5000);

//     return () => clearInterval(interval);
//   }, [session, update]);

//   if (loading) return <div>Loading...</div>;

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
//               process. You&apos;ll receive an email notification once your account
//               has been approved.
//             </AlertDescription>
//           </Alert>

//           <div className="space-y-4">
//             <div className="text-center text-sm text-muted-foreground">
//               <p>Need help? Contact support at <span className="font-bold">support@example.com</span></p>
//             </div>

//             <Button onClick={() => signOut()} className="w-full" size="lg">
//               <LogOut className="w-4 h-4 mr-2" />
//               Sign Out
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
     
"use client";

import { useEffect } from "react";
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

export default function VerificationPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  // Redirect when verified
  useEffect(() => {
    if (status !== "authenticated") return;

    if (session.user.isVerified) {
      const roleRedirect: Record<string, string> = {
        STUDENT: "/student",
        TEACHER: "/teacher",
        PARENT: "/parent",
        ADMIN: "/admin",
        ACCOUNTANT: "/accountant",
      };

      router.replace(roleRedirect[session.user.role] ?? "/student");
    }
  }, [status, session, router]);

  // Poll for verification update
  useEffect(() => {
    if (status !== "authenticated") return;
    if (session.user.isVerified) return;

    const interval = setInterval(async () => {
      await update(); // refresh JWT/session
    }, 5000);

    return () => clearInterval(interval);
  }, [status, session, update]);

  // ✅ Only ONE loading source
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  // If not logged in
  if (status !== "authenticated") {
    router.replace("/auth/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <Clock className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">
              Verification Pending
            </CardTitle>
            <CardDescription className="mt-2">
              Your account is currently under review
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Please contact your administrator to complete the verification
              process. You will be redirected automatically once approved.
            </AlertDescription>
          </Alert>

          <Button onClick={() => signOut()} className="w-full" size="lg">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}


