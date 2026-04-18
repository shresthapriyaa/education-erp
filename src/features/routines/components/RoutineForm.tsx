"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import * as z from "zod";
import { Button } from "@/core/components/ui/button";
import { ScrollArea } from "@/core/components/ui/scroll-area";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/core/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/core/components/ui/select";
import { Input } from "@/core/components/ui/input";
import { Loader2, Save, PlusCircle } from "lucide-react";
import { Routine, DayOfWeek } from "../types/routine.types";
import { ClassSubjectSelector } from "@/core/components/ClassSubjectSelector";

const DAYS: DayOfWeek[] = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

const schema = z.object({
  classSubjectId: z.string().min(1, "Please select class and subject"),
  day:            z.string().min(1, "Please select a day"),
  startTime:      z.string().min(1, "Start time required"),
  endTime:        z.string().min(1, "End time required"),
  room:           z.string().optional(),
});

type FormValues = z.infer<typeof schema>;
export type SubmitMode = "create" | "put";
type RoutinePayload = Partial<Routine>;

interface ClassOption   { id: string; name: string }
interface SubjectOption { id: string; name: string }
interface TeacherOption { id: string; username: string }

interface RoutineFormProps {
  initialValues?: Partial<Routine>;
  onSubmit: (values: RoutinePayload, mode: SubmitMode) => void;
  loading?: boolean;
  isEdit?: boolean;
  onCancel?: () => void;
}

export function RoutineForm({ initialValues, onSubmit, loading = false, isEdit = false, onCancel }: RoutineFormProps) {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      classSubjectId: initialValues?.classSubjectId ?? "",
      day:            initialValues?.day            ?? "",
      startTime:      initialValues?.startTime      ?? "",
      endTime:        initialValues?.endTime        ?? "",
      room:           initialValues?.room           ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      classSubjectId: initialValues?.classSubjectId ?? "",
      day:            initialValues?.day            ?? "",
      startTime:      initialValues?.startTime      ?? "",
      endTime:        initialValues?.endTime        ?? "",
      room:           initialValues?.room           ?? "",
    });
    
    // Reset class/subject selection when initialValues change
    if (initialValues?.classSubject) {
      setSelectedClass(initialValues.classSubject.class.id);
      setSelectedSubject(initialValues.classSubject.subject.id);
    }
  }, [initialValues]);

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit(values as RoutinePayload, isEdit ? "put" : "create");
  });

  return (
    <Form {...form}>
      <form className="space-y-4">
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            <ClassSubjectSelector
              selectedClass={selectedClass}
              selectedSubject={selectedSubject}
              onClassChange={setSelectedClass}
              onSubjectChange={setSelectedSubject}
              onClassSubjectChange={(classSubjectId) => {
                if (classSubjectId) {
                  form.setValue("classSubjectId", classSubjectId, { shouldValidate: true });
                }
              }}
              required
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField control={form.control} name="day" render={({ field }) => (
                <FormItem>
                  <FormLabel>Day</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select day" /></SelectTrigger></FormControl>
                    <SelectContent position="popper" className="z-[9999]">
                      {DAYS.map(d => (
                        <SelectItem key={d} value={d}>
                          {d.charAt(0) + d.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="room" render={({ field }) => (
                <FormItem>
                  <FormLabel>Room <span className="text-muted-foreground text-xs">(optional)</span></FormLabel>
                  <FormControl><Input placeholder="e.g. Room 101" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

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
          </div>
        </ScrollArea>

        <div className="flex gap-2 pt-2 justify-end">
          {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>}
          <Button type="button" onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : isEdit ? <Save className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
            {isEdit ? "Save All" : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}