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
import { Loader2, Save, PlusCircle } from "lucide-react";
import { Schedule, Day } from "../types/schedule.types";

const DAYS: Day[] = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

const schema = z.object({
  classId: z.string().min(1, "Please select a class"),
  subjectId: z.string().min(1, "Please select a subject"),
  day: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]),
  startTime: z.string().min(1, "Please select start time"),
  endTime: z.string().min(1, "Please select end time"),
});

type FormValues = z.infer<typeof schema>;
export type SubmitMode = "create" | "put" | "patch";
type SchedulePayload = Partial<Schedule> & { classId?: string; subjectId?: string };

interface ClassOption { id: string; name: string; }
interface SubjectOption { id: string; name: string; }

interface ScheduleFormProps {
  initialValues?: Partial<Schedule>;
  onSubmit: (values: SchedulePayload, mode: SubmitMode) => void;
  loading?: boolean;
  isEdit?: boolean;
  onCancel?: () => void;
}

export function ScheduleForm({
  initialValues, onSubmit, loading = false, isEdit = false, onCancel,
}: ScheduleFormProps) {
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);

  useEffect(() => {
    fetch("/api/classes").then((r) => r.json()).then((d) => setClasses(Array.isArray(d) ? d : [])).catch(() => setClasses([]));
    fetch("/api/subjects").then((r) => r.json()).then((d) => setSubjects(Array.isArray(d) ? d : [])).catch(() => setSubjects([]));
  }, []);

  const toTimeString = (val?: string) => {
    if (!val) return "";
    const d = new Date(val);
    return isNaN(d.getTime()) ? val : d.toTimeString().slice(0, 5);
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      classId: initialValues?.classId ?? "",
      subjectId: initialValues?.subjectId ?? "",
      day: (initialValues?.day as Day) ?? "MONDAY",
      startTime: toTimeString(initialValues?.startTime),
      endTime: toTimeString(initialValues?.endTime),
    },
  });

  useEffect(() => {
    form.reset({
      classId: initialValues?.classId ?? "",
      subjectId: initialValues?.subjectId ?? "",
      day: (initialValues?.day as Day) ?? "MONDAY",
      startTime: toTimeString(initialValues?.startTime),
      endTime: toTimeString(initialValues?.endTime),
    });
  }, [initialValues]);

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit(values as SchedulePayload, isEdit ? "put" : "create");
  });

  return (
    <Form {...form}>
      <form className="space-y-4">
        <FormField control={form.control} name="classId" render={({ field }) => (
          <FormItem>
            <FormLabel>Class</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl><SelectTrigger><SelectValue placeholder="Select a class" /></SelectTrigger></FormControl>
              <SelectContent>
                {classes.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="subjectId" render={({ field }) => (
          <FormItem>
            <FormLabel>Subject</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl><SelectTrigger><SelectValue placeholder="Select a subject" /></SelectTrigger></FormControl>
              <SelectContent>
                {subjects.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="day" render={({ field }) => (
          <FormItem>
            <FormLabel>Day</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl><SelectTrigger><SelectValue placeholder="Select a day" /></SelectTrigger></FormControl>
              <SelectContent>
                {DAYS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />

        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="startTime" render={({ field }) => (
            <FormItem>
              <FormLabel>Start Time</FormLabel>
              <FormControl><Input type="time" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="endTime" render={({ field }) => (
            <FormItem>
              <FormLabel>End Time</FormLabel>
              <FormControl><Input type="time" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

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