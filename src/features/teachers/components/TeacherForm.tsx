"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import * as z from "zod";
import { Button } from "@/core/components/ui/button";
import {
  Form, FormControl, FormField, FormItem,
  FormLabel, FormMessage, FormDescription,
} from "@/core/components/ui/form";
import { Input } from "@/core/components/ui/input";
import { Checkbox } from "@/core/components/ui/checkbox";
import { Loader2, Save, PlusCircle } from "lucide-react";
import { Teacher } from "../types/teacher.types";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const schema = z.object({
  username: z.string().min(3, "Minimum 3 characters"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  img: z.string().optional().or(z.literal("")),
  subjectIds: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof schema>;

export type SubmitMode = "create" | "put" | "patch";
type TeacherPayload = Partial<Teacher> & { subjectIds?: string[] };

interface Subject {
  id: string;
  name: string;
  code?: string | null;
}

interface TeacherFormProps {
  initialValues?: Partial<Teacher>;
  onSubmit: (values: TeacherPayload, mode: SubmitMode) => void;
  loading?: boolean;
  isEdit?: boolean;
  onCancel?: () => void;
}

export function TeacherForm({
  initialValues,
  onSubmit,
  loading = false,
  isEdit = false,
  onCancel,
}: TeacherFormProps) {
  const [imgTimestamp, setImgTimestamp] = useState<number>(Date.now());
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    fetch("/api/subjects")
      .then((r) => r.json())
      .then((data) => setSubjects(Array.isArray(data) ? data : []))
      .catch(() => setSubjects([]));
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: initialValues?.username ?? "",
      email: initialValues?.email ?? "",
      phone: initialValues?.phone ?? "",
      address: initialValues?.address ?? "",
      img: initialValues?.img ?? "",
      subjectIds: [],
    },
  });

  const getChangedFields = (values: FormValues): TeacherPayload => {
    const changed: TeacherPayload = {};
    if (values.username !== (initialValues?.username ?? "")) changed.username = values.username;
    if (values.email !== (initialValues?.email ?? "")) changed.email = values.email;
    if (values.phone !== (initialValues?.phone ?? "")) changed.phone = values.phone;
    if (values.address !== (initialValues?.address ?? "")) changed.address = values.address;
    if (values.img !== (initialValues?.img ?? "")) changed.img = values.img;
    return changed;
  };

  const handlePut = form.handleSubmit((values) => {
    onSubmit(values, isEdit ? "put" : "create");
  });

  return (
    <Form {...form}>
      <form className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField control={form.control} name="username" render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl><Input placeholder="john_doe" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input placeholder="example@gmail.com" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField control={form.control} name="phone" render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl><Input placeholder="+977 234 567 890" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="address" render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl><Input placeholder="123 Main St" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        {/* Image Upload */}
        <FormField control={form.control} name="img" render={({ field }) => (
          <FormItem>
            <FormLabel>Profile Image</FormLabel>
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
                      form.setError("img", { message: "Image must be 5MB or less" });
                      e.target.value = "";
                      return;
                    }
                    form.clearErrors("img");
                    const data = new FormData();
                    data.append("file", file);
                    const res = await fetch("/api/upload", { method: "POST", body: data });
                    const json = await res.json();
                    if (!res.ok) {
                      form.setError("img", { message: json.error ?? "Upload failed" });
                      return;
                    }
                    field.onChange(json.url);
                    setImgTimestamp(Date.now());
                  }}
                />
              </div>
            </FormControl>
            <FormDescription>Upload a profile photo. Max size: 5MB.</FormDescription>
            <FormMessage />
          </FormItem>
        )} />

        {/* Subjects Multi-Select */}
        <FormField control={form.control} name="subjectIds" render={({ field }) => (
          <FormItem>
            <FormLabel>Subjects (Optional)</FormLabel>
            <FormDescription>Select subjects this teacher can teach</FormDescription>
            <div className="border rounded-lg p-4 max-h-48 overflow-y-auto space-y-2">
              {subjects.length === 0 ? (
                <p className="text-sm text-muted-foreground">No subjects available. Add subjects first.</p>
              ) : (
                subjects.map((subject) => (
                  <div key={subject.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`subject-${subject.id}`}
                      checked={field.value?.includes(subject.id)}
                      onCheckedChange={(checked) => {
                        const current = field.value || [];
                        if (checked) {
                          field.onChange([...current, subject.id]);
                        } else {
                          field.onChange(current.filter((id) => id !== subject.id));
                        }
                      }}
                    />
                    <label
                      htmlFor={`subject-${subject.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {subject.name} {subject.code && `(${subject.code})`}
                    </label>
                  </div>
                ))
              )}
            </div>
            <FormMessage />
          </FormItem>
        )} />

        <div className="flex gap-2 pt-2 justify-end">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          )}
          {isEdit ? (
            <Button type="button" onClick={handlePut} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : <Save />}
              Save All
            </Button>
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