// "use client";

// import { useState } from "react";
// import { useSession, signOut } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import axios from "axios";
// import { Loader2, LogOut, CheckCircle2 } from "lucide-react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/core/components/ui/card";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
//   FormDescription,
// } from "@/core/components/ui/form";
// import { Input } from "@/core/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/core/components/ui/select";
// import { Button } from "@/core/components/ui/button";

// const SEX_OPTIONS = ["MALE", "FEMALE"] as const;
// const BLOOD_GROUP_OPTIONS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
// const MAX_FILE_SIZE = 5 * 1024 * 1024;

// const schema = z.object({
//   phone: z.string().min(7, "Enter a valid phone number"),
//   address: z.string().min(3, "Enter your address"),
//   sex: z.enum(SEX_OPTIONS),
//   dateOfBirth: z.string().min(1, "Date of birth is required"),
//   bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
//   parentName: z.string().min(2, "Enter parent/guardian name"),
//   img: z.string().optional().or(z.literal("")),
// });

// type FormValues = z.infer<typeof schema>;

// export function OnboardingForm() {
//   // ✅ FIX 1: Added `update` to refresh the JWT token after onboarding
//   const { data: session, status, update } = useSession();
//   const router = useRouter();
//   const [submitting, setSubmitting] = useState(false);
//   const [imgTimestamp, setImgTimestamp] = useState(Date.now());
//   const [successMsg, setSuccessMsg] = useState<string | null>(null);

//   const form = useForm<FormValues>({
//     resolver: zodResolver(schema),
//     defaultValues: {
//       phone: "",
//       address: "",
//       sex: "MALE",
//       dateOfBirth: "",
//       bloodGroup: "A+",
//       parentName: "",
//       img: "",
//     },
//   });

//   if (status === "loading") {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <Loader2 className="animate-spin w-8 h-8 text-muted-foreground" />
//       </div>
//     );
//   }

//   if (status !== "authenticated") {
//     router.replace("/auth/login");
//     return null;
//   }

//   const onSubmit = async (values: FormValues) => {
//     setSubmitting(true);
//     setSuccessMsg(null);
//     try {
//       const { data } = await axios.post(
//         `/api/onboarding/${session.user.id}`,
//         values
//       );

//       setSuccessMsg(data.message ?? "Profile created successfully!");

//       // ✅ FIX 2: Refresh JWT so middleware sees onboarded: true before redirect
//       await update();

//       setTimeout(() => {
//         router.replace("/verification");
//       }, 1500);
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         form.setError("root", {
//           message: error.response?.data?.message ?? "Submission failed",
//         });
//       } else {
//         form.setError("root", { message: "Something went wrong. Try again." });
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background flex items-center justify-center p-4">
//       <Card className="w-full max-w-lg">
//         <CardHeader>
//           <CardTitle className="text-2xl font-bold">
//             Complete Your Profile
//           </CardTitle>
//           <CardDescription>
//             Fill in your details below to submit your account for admin
//             verification.
//           </CardDescription>
//         </CardHeader>

//         <CardContent>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

//               {/* Phone + Address */}
//               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                 <FormField
//                   control={form.control}
//                   name="phone"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Phone</FormLabel>
//                       <FormControl>
//                         <Input placeholder="+977 234 567 890" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="address"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Address</FormLabel>
//                       <FormControl>
//                         <Input placeholder="123 Main St" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               {/* Sex + Date of Birth */}
//               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                 <FormField
//                   control={form.control}
//                   name="sex"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Sex</FormLabel>
//                       <Select
//                         onValueChange={field.onChange}
//                         defaultValue={field.value}
//                       >
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select sex" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           {SEX_OPTIONS.map((s) => (
//                             <SelectItem key={s} value={s}>
//                               {s.charAt(0) + s.slice(1).toLowerCase()}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="dateOfBirth"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Date of Birth</FormLabel>
//                       <FormControl>
//                         <Input type="date" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               {/* Blood Group + Parent Name */}
//               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                 <FormField
//                   control={form.control}
//                   name="bloodGroup"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Blood Group</FormLabel>
//                       <Select
//                         onValueChange={field.onChange}
//                         defaultValue={field.value}
//                       >
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select blood group" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           {BLOOD_GROUP_OPTIONS.map((bg) => (
//                             <SelectItem key={bg} value={bg}>
//                               {bg}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="parentName"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Parent / Guardian Name</FormLabel>
//                       <FormControl>
//                         <Input placeholder="John Doe" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               {/* Photo Upload */}
//               <FormField
//                 control={form.control}
//                 name="img"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Profile Photo</FormLabel>
//                     <FormControl>
//                       <div className="flex flex-col gap-3">
//                         {field.value && (
//                           <img
//                             src={`${field.value}?t=${imgTimestamp}`}
//                             alt="Preview"
//                             className="h-20 w-20 rounded-full object-cover border border-border"
//                           />
//                         )}
//                         <Input
//                           type="file"
//                           accept="image/*"
//                           className="cursor-pointer"
//                           onChange={async (e) => {
//                             const file = e.target.files?.[0];
//                             if (!file) return;

//                             if (file.size > MAX_FILE_SIZE) {
//                               form.setError("img", {
//                                 message: "Image must be 5MB or less",
//                               });
//                               e.target.value = "";
//                               return;
//                             }

//                             form.clearErrors("img");

//                             const data = new FormData();
//                             data.append("file", file);

//                             try {
//                               const { data: json } = await axios.post(
//                                 "/api/upload",
//                                 data
//                               );
//                               field.onChange(json.url);
//                               setImgTimestamp(Date.now());
//                             } catch (error) {
//                               if (axios.isAxiosError(error)) {
//                                 form.setError("img", {
//                                   message:
//                                     error.response?.data?.error ??
//                                     "Upload failed",
//                                 });
//                               } else {
//                                 form.setError("img", {
//                                   message: "Upload failed",
//                                 });
//                               }
//                             }
//                           }}
//                         />
//                       </div>
//                     </FormControl>
//                     <FormDescription>
//                       Upload a clear photo of yourself. Max size: 5MB.
//                     </FormDescription>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               {/* Success message */}
//               {successMsg && (
//                 <div className="flex items-center gap-2 rounded-md bg-green-50 border border-green-200 px-4 py-3">
//                   <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
//                   <p className="text-sm text-green-700 font-medium">{successMsg}</p>
//                 </div>
//               )}

//               {/* Root error */}
//               {form.formState.errors.root && (
//                 <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3">
//                   <p className="text-sm text-red-600">
//                     {form.formState.errors.root.message}
//                   </p>
//                 </div>
//               )}

//               {/* Actions */}
//               <div className="flex gap-2 pt-2">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   className="flex-1"
//                   onClick={() => signOut()}
//                   disabled={submitting}
//                 >
//                   <LogOut className="w-4 h-4 mr-2" />
//                   Sign Out
//                 </Button>
//                 <Button type="submit" className="flex-1" disabled={submitting || !!successMsg}>
//                   {submitting && (
//                     <Loader2 className="animate-spin w-4 h-4 mr-2" />
//                   )}
//                   {successMsg ? "Redirecting..." : "Submit for Verification"}
//                 </Button>
//               </div>

//             </form>
//           </Form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }



"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { Loader2, LogOut, CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/core/components/ui/form";
import { Input } from "@/core/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import { Button } from "@/core/components/ui/button";

const SEX_OPTIONS = ["MALE", "FEMALE"] as const;
const BLOOD_GROUP_OPTIONS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const schema = z.object({
  phone: z.string().min(7, "Enter a valid phone number"),
  address: z.string().min(3, "Enter your address"),
  sex: z.enum(SEX_OPTIONS),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  parentName: z.string().min(2, "Enter parent/guardian name"),
  img: z.string().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

export function OnboardingForm() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [imgTimestamp, setImgTimestamp] = useState(Date.now());
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      phone: "",
      address: "",
      sex: "MALE",
      dateOfBirth: "",
      bloodGroup: "A+",
      parentName: "",
      img: "",
    },
  });

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-muted-foreground" />
      </div>
    );
  }

  if (status !== "authenticated") {
    router.replace("/auth/login");
    return null;
  }

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    setSuccessMsg(null);
    try {
      const { data } = await axios.post(
        `/api/onboarding/${session.user.id}`,
        values
      );

      setSuccessMsg(data.message ?? "Profile created successfully!");

      // Force refresh JWT so middleware sees onboarded: true
      await update();
      await new Promise((resolve) => setTimeout(resolve, 2000));

      router.replace("/verification");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        form.setError("root", {
          message: error.response?.data?.message ?? "Submission failed",
        });
      } else {
        form.setError("root", { message: "Something went wrong. Try again." });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Complete Your Profile
          </CardTitle>
          <CardDescription>
            Fill in your details below to submit your account for admin
            verification.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

              {/* Phone + Address */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+977 234 567 890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Sex + Date of Birth */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="sex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sex</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sex" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SEX_OPTIONS.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s.charAt(0) + s.slice(1).toLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Blood Group + Parent Name */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="bloodGroup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Group</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select blood group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {BLOOD_GROUP_OPTIONS.map((bg) => (
                            <SelectItem key={bg} value={bg}>
                              {bg}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="parentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent / Guardian Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Photo Upload */}
              <FormField
                control={form.control}
                name="img"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Photo</FormLabel>
                    <FormControl>
                      <div className="flex flex-col gap-3">
                        {field.value && (
                          <img
                            src={`${field.value}?t=${imgTimestamp}`}
                            alt="Preview"
                            className="h-20 w-20 rounded-full object-cover border border-border"
                          />
                        )}
                        <Input
                          type="file"
                          accept="image/*"
                          className="cursor-pointer"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            if (file.size > MAX_FILE_SIZE) {
                              form.setError("img", {
                                message: "Image must be 5MB or less",
                              });
                              e.target.value = "";
                              return;
                            }

                            form.clearErrors("img");

                            const data = new FormData();
                            data.append("file", file);

                            try {
                              const { data: json } = await axios.post(
                                "/api/upload",
                                data
                              );
                              field.onChange(json.url);
                              setImgTimestamp(Date.now());
                            } catch (error) {
                              if (axios.isAxiosError(error)) {
                                form.setError("img", {
                                  message:
                                    error.response?.data?.error ??
                                    "Upload failed",
                                });
                              } else {
                                form.setError("img", {
                                  message: "Upload failed",
                                });
                              }
                            }
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload a clear photo of yourself. Max size: 5MB.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Success message */}
              {successMsg && (
                <div className="flex items-center gap-2 rounded-md bg-green-50 border border-green-200 px-4 py-3">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                  <p className="text-sm text-green-700 font-medium">{successMsg}</p>
                </div>
              )}

              {/* Root error */}
              {form.formState.errors.root && (
                <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3">
                  <p className="text-sm text-red-600">
                    {form.formState.errors.root.message}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => signOut()}
                  disabled={submitting}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
                <Button type="submit" className="flex-1" disabled={submitting || !!successMsg}>
                  {submitting && (
                    <Loader2 className="animate-spin w-4 h-4 mr-2" />
                  )}
                  {successMsg ? "Redirecting..." : "Submit for Verification"}
                </Button>
              </div>

            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}