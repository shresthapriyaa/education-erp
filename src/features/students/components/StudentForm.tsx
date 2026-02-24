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
import { Loader2, Save, RefreshCw, GitMerge, PlusCircle } from "lucide-react";
import { Student } from "../types/student.types";

const SEX_OPTIONS = ["MALE", "FEMALE"] as const;
const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const schema = z.object({
  username: z.string().min(3, "Minimum 3 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  img: z.string().optional().or(z.literal("")),
  bloodGroup: z.string().optional().or(z.literal("")),
  sex: z.enum(SEX_OPTIONS),
  dateOfBirth: z.string().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

export type SubmitMode = "create" | "put" | "patch";

type StudentPayload = Partial<Student> & { password?: string };

interface StudentFormProps {
  initialValues?: Partial<Student>;
  onSubmit: (values: StudentPayload, mode: SubmitMode) => void;
  loading?: boolean;
  isEdit?: boolean;
  onCancel?: () => void;
}

export function StudentForm({
  initialValues,
  onSubmit,
  loading = false,
  isEdit = false,
  onCancel,
}: StudentFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: initialValues?.username ?? "",
      email: initialValues?.email ?? "",
      password: "",
      phone: initialValues?.phone ?? "",
      address: initialValues?.address ?? "",
      img: initialValues?.img ?? "",
      bloodGroup: initialValues?.bloodGroup ?? "",
      sex: (initialValues?.sex as (typeof SEX_OPTIONS)[number]) ?? "MALE",
      dateOfBirth: initialValues?.dateOfBirth
        ? new Date(initialValues.dateOfBirth).toISOString().split("T")[0]
        : "",
    },
  });

  const getChangedFields = (values: FormValues): StudentPayload => {
    const changed: StudentPayload = {};
    if (values.username !== (initialValues?.username ?? ""))
      changed.username = values.username;
    if (values.email !== (initialValues?.email ?? ""))
      changed.email = values.email;
    if (values.phone !== (initialValues?.phone ?? ""))
      changed.phone = values.phone;
    if (values.address !== (initialValues?.address ?? ""))
      changed.address = values.address;
    if (values.img !== (initialValues?.img ?? "")) changed.img = values.img;
    if (values.bloodGroup !== (initialValues?.bloodGroup ?? ""))
      changed.bloodGroup = values.bloodGroup;
    if (values.sex !== (initialValues?.sex ?? "MALE")) changed.sex = values.sex;
    if (values.dateOfBirth !== (initialValues?.dateOfBirth ?? ""))
      changed.dateOfBirth = values.dateOfBirth ?? null;
    if (values.password?.trim()) changed.password = values.password;
    return changed;
  };

  const handlePut = form.handleSubmit((values) => {
    if (!isEdit && !values.password?.trim()) {
      form.setError("password", { message: "Password is required" });
      return;
    }
    const payload: StudentPayload =
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
      <form className="space-y-4">
        {/* Username + Email */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="john_doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="example@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
                <Input
                  type="password"
                  placeholder="Enter your password"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {isEdit
                  ? "Only fill to change password."
                  : "This is your password."}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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

        {/* Sex + Blood Group */}
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
                    {BLOOD_GROUPS.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Date of Birth */}
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

        {/* Image Upload */}
        <FormField
          control={form.control}
          name="img"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Image</FormLabel>
              <FormControl>
                <div className="flex flex-col gap-3">
                  {/* Preview */}
                  {field.value && (
                    <img
                      src={field.value}
                      alt="Preview"
                      className="h-20 w-20 rounded-full object-cover border border-border"
                    />
                  )}
                  {/* File input */}
                  <Input
                    type="file"
                    accept="image/*"
                    className="cursor-pointer"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      // Client-side 5MB guard
                      if (file.size > MAX_FILE_SIZE) {
                        form.setError("img", {
                          message: "Image must be 5MB or less",
                        });
                        e.target.value = ""; // reset input
                        return;
                      }

                      form.clearErrors("img");

                      const data = new FormData();
                      data.append("file", file);

                      const res = await fetch("/api/upload", {
                        method: "POST",
                        body: data,
                      });

                      const json = await res.json();

                      if (!res.ok) {
                        form.setError("img", {
                          message: json.error ?? "Upload failed",
                        });
                        return;
                      }

                      // Stores "/student-photos/filename.jpg" in the form
                      field.onChange(json.url);
                    }}
                  />
                </div>
              </FormControl>
              <FormDescription>
                Upload a profile photo. Max size: 5MB.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="flex gap-2 pt-2 justify-end">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          {isEdit ? (
            <>
              <Button type="button" onClick={handlePatch} disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : <GitMerge />}
                Save Changes
              </Button>
              <Button type="button" onClick={handlePut} disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : <Save />}
                Save All
              </Button>
            </>
          ) : (
            

            <Button type="button" onClick={handlePut} disabled={loading}>
              Submit
              {<PlusCircle className="ml-2" />}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
