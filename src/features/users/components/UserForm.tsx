

// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import { Button } from "@/core/components/ui/button";
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
// import { Loader2, Save, RefreshCw, GitMerge, PlusCircle } from "lucide-react";
// import type { User } from "../types/user.types";
// import { Switch } from "@/core/components/ui/switch"; // ✅ correct import

// const ROLES = ["ADMIN", "TEACHER", "STUDENT", "PARENT", "ACCOUNTANT"] as const;

// const schema = z.object({
//   username: z.string().min(3, "Minimum 3 characters"),
//   email: z.string().email("Invalid email"),
//   password: z.string().optional().or(z.literal("")),
//   role: z.enum(ROLES),
//   isVerified: z.boolean(),
// });

// type FormValues = z.infer<typeof schema>;

// export type SubmitMode = "create" | "put" | "patch";

// type UserPayload = Partial<User> & { password?: string };

// interface UserFormProps {
//   initialValues?: Partial<User>;
//   onSubmit: (values: UserPayload, mode: SubmitMode) => void;
//   loading?: boolean;
//   isEdit?: boolean;
//   onCancel?: () => void;
// }

// export function UserForm({
//   initialValues,
//   onSubmit,
//   loading = false,
//   isEdit = false,
//   onCancel,
// }: UserFormProps) {
//   const form = useForm<FormValues>({
//     resolver: zodResolver(schema),
//     defaultValues: {
//       username: initialValues?.username ?? "",
//       email: initialValues?.email ?? "",
//       password: "",
//       role: (initialValues?.role as (typeof ROLES)[number]) ?? "STUDENT",
//       isVerified: initialValues?.isVerified ?? false,
//     },
//   });

//   const getChangedFields = (values: FormValues): UserPayload => {
//     const changed: UserPayload = {};
//     if (values.username !== (initialValues?.username ?? ""))
//       changed.username = values.username;
//     if (values.email !== (initialValues?.email ?? ""))
//       changed.email = values.email;
//     if (values.role !== (initialValues?.role ?? "STUDENT"))
//       changed.role = values.role;
//     if (values.isVerified !== (initialValues?.isVerified ?? false))
//       changed.isVerified = values.isVerified;
//     if (values.password?.trim()) changed.password = values.password;
//     return changed;
//   };

//   const handlePut = form.handleSubmit((values) => {
//     if (!isEdit && !values.password?.trim()) {
//       form.setError("password", { message: "Password is required" });
//       return;
//     }
//     const payload: UserPayload =
//       isEdit && !values.password?.trim()
//         ? (({ password, ...rest }) => rest)(values)
//         : values;
//     onSubmit(payload, isEdit ? "put" : "create");
//   });

//   const handlePatch = form.handleSubmit((values) => {
//     onSubmit(getChangedFields(values), "patch");
//   });

//   return (
//     <Form {...form}>
//       <form className="space-y-6">
//         {/* Username */}
//         <FormField
//           control={form.control}
//           name="username"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Username</FormLabel>
//               <FormControl>
//                 <Input placeholder="Username" {...field} />
//               </FormControl>
//               <FormDescription>
//                 This is your public display name.
//               </FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* Email */}
//         <FormField
//           control={form.control}
//           name="email"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Email</FormLabel>
//               <FormControl>
//                 <Input placeholder="Email" {...field} />
//               </FormControl>
//               <FormDescription>This is your email.</FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* Role */}
//         <FormField
//           control={form.control}
//           name="role"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Role</FormLabel>
//               <Select onValueChange={field.onChange} defaultValue={field.value}>
//                 <FormControl>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select a role" />
//                   </SelectTrigger>
//                 </FormControl>
//                 <SelectContent>
//                   {ROLES.map((r) => (
//                     <SelectItem key={r} value={r}>
//                       {r.charAt(0) + r.slice(1).toLowerCase()}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* Is Verified */}
//         <FormField
//           control={form.control}
//           name="isVerified"
//           render={({ field }) => (
//             <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
//               <div>
//                 <FormLabel className="text-base">Is Verified</FormLabel>
//                 <FormDescription>Mark this user as verified.</FormDescription>
//               </div>
//               <FormControl>
//                 <Switch
//                   checked={field.value}
//                   onCheckedChange={field.onChange}
//                   aria-label="Is Verified"
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* Password */}
//         <FormField
//           control={form.control}
//           name="password"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>
//                 Password {!isEdit && <span className="text-red-500">*</span>}
//               </FormLabel>
//               <FormControl>
//                 <Input type="password" placeholder="Password" {...field} />
//               </FormControl>
//               <FormDescription>
//                 {isEdit
//                   ? "Only fill to change password."
//                   : "This is your password."}
//               </FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* Actions */}
//         <div className="flex gap-2 justify-end">
//           {onCancel && (
//             <Button type="button" variant="outline" onClick={onCancel}>
//               Cancel
//             </Button>
//           )}
//           {isEdit ? (
//             <>
//               <Button type="button" onClick={handlePatch} disabled={loading}>
//                 {loading ? <Loader2 className="animate-spin" /> : <GitMerge />}
//                 Save Changes
//               </Button>
//               <Button type="button" onClick={handlePut} disabled={loading}>
//                 {loading ? <Loader2 className="animate-spin" /> : <Save />}
//                 Save All
//               </Button>
//             </>
//           ) : (
            
//             <Button type="button" onClick={handlePut} disabled={loading}>
//               Submit
//               <PlusCircle className="ml-2" />
//             </Button>
//           )}
//         </div>
//       </form>
//     </Form>
//   );
// }



"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/core/components/ui/button";
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
import { Loader2, Save, GitMerge, PlusCircle } from "lucide-react";
import type { User } from "../types/user.types";
import { Switch } from "@/core/components/ui/switch";

const ROLES = ["ADMIN", "TEACHER", "STUDENT", "PARENT", "ACCOUNTANT"] as const;
const SEX_OPTIONS = ["MALE", "FEMALE"] as const;

const schema = z.object({
  username: z.string().min(3, "Minimum 3 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().optional().or(z.literal("")),
  role: z.enum(ROLES),
  isVerified: z.boolean(),
  sex: z.enum(SEX_OPTIONS).optional(),
});

type FormValues = z.infer<typeof schema>;

export type SubmitMode = "create" | "put" | "patch";

type UserPayload = Partial<User> & { password?: string; sex?: string };

interface UserFormProps {
  initialValues?: Partial<User>;
  onSubmit: (values: UserPayload, mode: SubmitMode) => void;
  loading?: boolean;
  isEdit?: boolean;
  onCancel?: () => void;
}

export function UserForm({
  initialValues,
  onSubmit,
  loading = false,
  isEdit = false,
  onCancel,
}: UserFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: initialValues?.username ?? "",
      email: initialValues?.email ?? "",
      password: "",
      role: (initialValues?.role as (typeof ROLES)[number]) ?? "ADMIN",
      isVerified: initialValues?.isVerified ?? false,
      sex: undefined,
    },
  });

  const selectedRole = form.watch("role");

  const getChangedFields = (values: FormValues): UserPayload => {
    const changed: UserPayload = {};
    if (values.username !== (initialValues?.username ?? "")) changed.username = values.username;
    if (values.email !== (initialValues?.email ?? "")) changed.email = values.email;
    if (values.role !== (initialValues?.role ?? "ADMIN")) changed.role = values.role;
    if (values.isVerified !== (initialValues?.isVerified ?? false)) changed.isVerified = values.isVerified;
    if (values.password?.trim()) changed.password = values.password;
    if (values.sex) changed.sex = values.sex;
    return changed;
  };

  const handlePut = form.handleSubmit((values) => {
    if (!isEdit && !values.password?.trim()) {
      form.setError("password", { message: "Password is required" });
      return;
    }

    // Require sex when creating a student
    if (!isEdit && values.role === "STUDENT" && !values.sex) {
      form.setError("sex", { message: "Sex is required for students" });
      return;
    }

    const payload: UserPayload =
      isEdit && !values.password?.trim()
        ? (({ password, ...rest }) => rest)(values)
        : values;

    onSubmit(payload, isEdit ? "put" : "create");
  });

  const handlePatch = form.handleSubmit((values) => {
    onSubmit(getChangedFields(values), "patch");
  });

  return (
    <Form {...form}>
      <form className="space-y-6">

        {/* Username */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormDescription>This is your email.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Role */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r.charAt(0) + r.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Sex — only shown when role is STUDENT */}
        {selectedRole === "STUDENT" && (
          <FormField
            control={form.control}
            name="sex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Sex <span className="text-red-500">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                <FormDescription>Required for student profiles.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Is Verified */}
        <FormField
          control={form.control}
          name="isVerified"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div>
                <FormLabel className="text-base">Is Verified</FormLabel>
                <FormDescription>Mark this user as verified.</FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-label="Is Verified"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Password {!isEdit && <span className="text-red-500">*</span>}
              </FormLabel>
              <FormControl>
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>
              <FormDescription>
                {isEdit ? "Only fill to change password." : "This is your password."}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="flex gap-2 justify-end">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          {isEdit ? (
            <>
              
              <Button type="button" onClick={handlePut} disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : <Save />}
                Save All
              </Button>
            </>
          ) : (
            <Button type="button" onClick={handlePut} disabled={loading}>
              Submit
              <PlusCircle className="ml-2" />
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}