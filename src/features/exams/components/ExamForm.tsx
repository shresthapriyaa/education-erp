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
import { Exam } from "../types/exam.types";

const schema = z.object({
  title: z.string().min(2, "Minimum 2 characters"),
  subjectId: z.string().min(1, "Please select a subject"),
  date: z.string().min(1, "Please select a date"),
});

type FormValues = z.infer<typeof schema>;

export type SubmitMode = "create" | "put" | "patch";
type ExamPayload = Partial<Exam> & { subjectId?: string };

interface SubjectOption {
  id: string;
  name: string;
}

interface ExamFormProps {
  initialValues?: Partial<Exam>;
  onSubmit: (values: ExamPayload, mode: SubmitMode) => void;
  loading?: boolean;
  isEdit?: boolean;
  onCancel?: () => void;
}

export function ExamForm({
  initialValues,
  onSubmit,
  loading = false,
  isEdit = false,
  onCancel,
}: ExamFormProps) {
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);

  useEffect(() => {
    fetch("/api/subjects")
      .then((r) => r.json())
      .then((data) => setSubjects(Array.isArray(data) ? data : []))
      .catch(() => setSubjects([]));
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialValues?.title ?? "",
      subjectId: initialValues?.subjectId ?? "",
      date: initialValues?.date
        ? new Date(initialValues.date).toISOString().split("T")[0]
        : "",
    },
  });

  const handlePut = form.handleSubmit((values) => {
    onSubmit(values as ExamPayload, isEdit ? "put" : "create");
  });

  return (
    <Form {...form}>
      <form className="space-y-4">
        <FormField control={form.control} name="title" render={({ field }) => (
          <FormItem>
            <FormLabel>Exam Title</FormLabel>
            <FormControl><Input placeholder="e.g. Mid Term Exam" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="subjectId" render={({ field }) => (
          <FormItem>
            <FormLabel>Subject</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger><SelectValue placeholder="Select a subject" /></SelectTrigger>
              </FormControl>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="date" render={({ field }) => (
          <FormItem>
            <FormLabel>Exam Date</FormLabel>
            <FormControl><Input type="date" {...field} /></FormControl>
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