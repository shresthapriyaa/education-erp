"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import * as z from "zod";
import { Button } from "@/core/components/ui/button";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/core/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/core/components/ui/select";
import { Input } from "@/core/components/ui/input";
import { Checkbox } from "@/core/components/ui/checkbox";
import { Loader2, Save, PlusCircle } from "lucide-react";
import { Fee } from "../types/fee.types";

const schema = z.object({
  studentId: z.string().min(1, "Please select a student"),
  amount: z.coerce.number().min(1, "Amount must be greater than 0"),
  dueDate: z.string().min(1, "Please select a due date"),
  paid: z.boolean(),
});

type FormValues = z.infer<typeof schema>;
export type SubmitMode = "create" | "put" | "patch";
type FeePayload = Partial<Fee> & { studentId?: string };

interface StudentOption { id: string; username: string; email: string; }

interface FeeFormProps {
  initialValues?: Partial<Fee>;
  onSubmit: (values: FeePayload, mode: SubmitMode) => void;
  loading?: boolean;
  isEdit?: boolean;
  onCancel?: () => void;
}

export function FeeForm({
  initialValues, onSubmit, loading = false, isEdit = false, onCancel,
}: FeeFormProps) {
  const [students, setStudents] = useState<StudentOption[]>([]);

  useEffect(() => {
    fetch("/api/students")
      .then((r) => r.json())
      .then((d) => setStudents(Array.isArray(d) ? d : []))
      .catch(() => setStudents([]));
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      studentId: initialValues?.studentId ?? "",
      amount: initialValues?.amount ?? 0,
      dueDate: initialValues?.dueDate
        ? new Date(initialValues.dueDate).toISOString().split("T")[0]
        : "",
      paid: initialValues?.paid ?? false,
    },
  });

  useEffect(() => {
    form.reset({
      studentId: initialValues?.studentId ?? "",
      amount: initialValues?.amount ?? 0,
      dueDate: initialValues?.dueDate
        ? new Date(initialValues.dueDate).toISOString().split("T")[0]
        : "",
      paid: initialValues?.paid ?? false,
    });
  }, [initialValues]);

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit(values as FeePayload, isEdit ? "put" : "create");
  });

  return (
    <Form {...form}>
      <form className="space-y-4">
        <FormField control={form.control} name="studentId" render={({ field }) => (
          <FormItem>
            <FormLabel>Student</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger><SelectValue placeholder="Select a student" /></SelectTrigger>
              </FormControl>
              <SelectContent>
                {students.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.username} — {s.email}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="amount" render={({ field }) => (
          <FormItem>
            <FormLabel>Amount (Rs.)</FormLabel>
            <FormControl><Input type="number" placeholder="e.g. 5000" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="dueDate" render={({ field }) => (
          <FormItem>
            <FormLabel>Due Date</FormLabel>
            <FormControl><Input type="date" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="paid" render={({ field }) => (
          <FormItem className="flex items-center gap-3">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
              />
            </FormControl>
            <FormLabel className="mt-0">Mark as Paid</FormLabel>
            <FormMessage />
          </FormItem>
        )} />

        <div className="flex gap-2 pt-2 justify-end">
          {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>}
          {isEdit ? (
            <Button type="button" onClick={handleSubmit} disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
              Save All
            </Button>
          ) : (
            <Button type="button" onClick={handleSubmit} disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
              Submit
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}