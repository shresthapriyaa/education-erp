 "use client";

 import { useState } from "react";
 import { useForm } from "react-hook-form";
 import { zodResolver } from "@hookform/resolvers/zod";
 import { signIn } from "next-auth/react";
 import { useRouter } from "next/navigation";
 import * as z from "zod";

import { toast } from "sonner";
 import { LoginForm } from "../types/types";
 import { loginSchema } from "../types/types";




 export function useLogin(){
const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

   const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
   },
  });

  const onSubmit = async (data: LoginForm) => {
   setLoading(true);

    const res = await signIn("credentials", {
     email: data.email,
       password: data.password,
       redirect: false,
    });

    setLoading(false);
     if (res?.error) {
      toast.error("Invalid email or password");
      return;
     }
     toast.success("Login successful!");
      router.push("/verification");
    
      
       

  };

   return {form, onSubmit,loading, showPassword, setShowPassword};


 }


// src/features/auth/login/hooks/useLogin.tsx
// "use client";

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import { LoginForm, loginSchema } from "../types/types";

// export function useLogin() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const form = useForm<LoginForm>({
//     resolver: zodResolver(loginSchema),
//     mode: "onChange",
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   const onSubmit = async (data: LoginForm) => {
//     try {
//       setLoading(true);

//       console.log("Attempting login with:", data.email);

//       // Sign in with NextAuth
//       const result = await signIn("credentials", {
//         email: data.email,
//         password: data.password,
//         redirect: false,
//       });

//       console.log("SignIn result:", result);

//       if (result?.error) {
//         toast.error(result.error);
//         setLoading(false);
//         return;
//       }

//       if (result?.ok) {
//         toast.success("Login successful! Redirecting...");

//         // Fetch the session to get user role
//         const sessionResponse = await fetch("/api/auth/session");
//         const session = await sessionResponse.json();

//         console.log("Session data:", session);

//         const userRole = session?.user?.role;
//         console.log("User role:", userRole);

//         // Role-based redirect with switch statement
//         switch (userRole) {
//           case "ADMIN":
//             console.log("→ Redirecting to /admin");
//             router.push("/admin");
//             break;
//           case "TEACHER":
//             console.log("→ Redirecting to /teacher");
//             router.push("/teacher");
//             break;
//           case "STUDENT":
//             console.log("→ Redirecting to /student");
//             router.push("/student");
//             break;
//           case "PARENT":
//             console.log("→ Redirecting to /parent");
//             router.push("/parent");
//             break;
//           case "ACCOUNTANT":
//             console.log("→ Redirecting to /accountant");
//             router.push("/accountant");
//             break;
//           default:
//             console.log("→ Redirecting to default /dashboard");
//             router.push("/dashboard");
//         }

//         // Don't set loading to false here - let the redirect happen
//         form.reset();
//       } else {
//         setLoading(false);
//       }
//     } catch (error: any) {
//       console.error("Login error:", error);
//       toast.error("An unexpected error occurred. Please try again.");
//       setLoading(false);
//     }
//   };

//   return { form, onSubmit, loading, showPassword, setShowPassword };
// }