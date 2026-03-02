"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import * as z from "zod";
import { Button } from "@/core/components/ui/button";
import {
  Form, FormControl, FormField, FormItem,
  FormLabel, FormMessage,
} from "@/core/components/ui/form";
import { Input } from "@/core/components/ui/input";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/core/components/ui/select";
import { Loader2, Save, PlusCircle } from "lucide-react";
import { Class } from "../types/class.types";

const schema = z.object({
  name: z.string().min(2, "Minimum 2 characters"),
  teacherId: z.string().min(1, "Please select a teacher"),
});

type FormValues = z.infer<typeof schema>;

export type SubmitMode = "create" | "put" | "patch";
type ClassPayload = Partial<Class> & { teacherId?: string };

interface TeacherOption {
  id: string;
  username: string;
  email: string;
}

interface ClassFormProps {
  initialValues?: Partial<Class>;
  onSubmit: (values: ClassPayload, mode: SubmitMode) => void;
  loading?: boolean;
  isEdit?: boolean;
  onCancel?: () => void;
}

export function ClassForm({
  initialValues,
  onSubmit,
  loading = false,
  isEdit = false,
  onCancel,
}: ClassFormProps) {
  const [teachers, setTeachers] = useState<TeacherOption[]>([]);

  useEffect(() => {
    fetch("/api/teachers")
      .then((r) => r.json())
      .then((data) => setTeachers(Array.isArray(data) ? data : []))
      .catch(() => setTeachers([]));
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialValues?.name ?? "",
      teacherId: initialValues?.teacherId ?? "",
    },
  });

  const handlePut = form.handleSubmit((values) => {
    onSubmit(values, isEdit ? "put" : "create");
  });

  return (
    <Form {...form}>
      <form className="space-y-4">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel>Class Name</FormLabel>
            <FormControl><Input placeholder="e.g. Grade 10A" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="teacherId" render={({ field }) => (
          <FormItem>
            <FormLabel>Assigned Teacher</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger><SelectValue placeholder="Select a teacher" /></SelectTrigger>
              </FormControl>
              <SelectContent>
                {teachers.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.username} — {t.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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