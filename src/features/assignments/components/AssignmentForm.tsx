// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import { Button } from "@/core/components/ui/button";
// import {
//   Form, FormControl, FormField, FormItem,
//   FormLabel, FormMessage,
// } from "@/core/components/ui/form";
// import { Input } from "@/core/components/ui/input";
// import { Textarea } from "@/core/components/ui/textarea";
// import { Loader2, Save, PlusCircle } from "lucide-react";
// import { Assignment } from "../types/assignment.types";

// const schema = z.object({
//   title: z.string().min(2, "Minimum 2 characters"),
//   description: z.string().min(5, "Minimum 5 characters"),
//   dueDate: z.string().min(1, "Please select a due date"),
// });

// type FormValues = z.infer<typeof schema>;

// export type SubmitMode = "create" | "put" | "patch";
// type AssignmentPayload = Partial<Assignment>;

// interface AssignmentFormProps {
//   initialValues?: Partial<Assignment>;
//   onSubmit: (values: AssignmentPayload, mode: SubmitMode) => void;
//   loading?: boolean;
//   isEdit?: boolean;
//   onCancel?: () => void;
// }

// export function AssignmentForm({
//   initialValues,
//   onSubmit,
//   loading = false,
//   isEdit = false,
//   onCancel,
// }: AssignmentFormProps) {
//   const form = useForm<FormValues>({
//     resolver: zodResolver(schema),
//     defaultValues: {
//       title: initialValues?.title ?? "",
//       description: initialValues?.description ?? "",
//       dueDate: initialValues?.dueDate
//         ? new Date(initialValues.dueDate).toISOString().split("T")[0]
//         : "",
//     },
//   });

//   const handlePut = form.handleSubmit((values) => {
//     onSubmit(values as AssignmentPayload, isEdit ? "put" : "create");
//   });

//   return (
//     <Form {...form}>
//       <form className="space-y-4">
//         <FormField control={form.control} name="title" render={({ field }) => (
//           <FormItem>
//             <FormLabel>Title</FormLabel>
//             <FormControl><Input placeholder="e.g. Chapter 5 Exercise" {...field} /></FormControl>
//             <FormMessage />
//           </FormItem>
//         )} />

//         <FormField control={form.control} name="description" render={({ field }) => (
//           <FormItem>
//             <FormLabel>Description</FormLabel>
//             <FormControl>
//               <Textarea
//                 placeholder="Write assignment instructions here..."
//                 className="resize-none"
//                 rows={4}
//                 {...field}
//               />
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )} />

//         <FormField control={form.control} name="dueDate" render={({ field }) => (
//           <FormItem>
//             <FormLabel>Due Date</FormLabel>
//             <FormControl><Input type="date" {...field} /></FormControl>
//             <FormMessage />
//           </FormItem>
//         )} />

//         <div className="flex gap-2 pt-2 justify-end">
//           {onCancel && (
//             <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
//           )}
//           {isEdit ? (
//             <Button type="button" onClick={handlePut} disabled={loading}>
//               {loading ? <Loader2 className="animate-spin" /> : <Save />}
//               Save All
//             </Button>
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
import { Textarea } from "@/core/components/ui/textarea";
import { Loader2, Save, PlusCircle } from "lucide-react";
import { Assignment } from "../types/assignment.types";

const schema = z.object({
  title:       z.string().min(2, "Minimum 2 characters"),
  description: z.string().min(5, "Minimum 5 characters"),
  dueDate:     z.string().min(1, "Please select a due date"),
  totalMarks:  z.coerce.number().min(1, "Total marks required"),
  classId:     z.string().min(1, "Please select a class"),
  subjectId:   z.string().min(1, "Please select a subject"),
  teacherId:   z.string().min(1, "Please select a teacher"),
});

type FormValues = z.infer<typeof schema>;
export type SubmitMode = "create" | "put" | "patch";
type AssignmentPayload = Partial<Assignment>;

interface ClassOption   { id: string; name: string }
interface SubjectOption { id: string; name: string }
interface TeacherOption { id: string; username: string }

interface AssignmentFormProps {
  initialValues?: Partial<Assignment>;
  onSubmit: (values: AssignmentPayload, mode: SubmitMode) => void;
  loading?: boolean;
  isEdit?: boolean;
  onCancel?: () => void;
}

export function AssignmentForm({
  initialValues, onSubmit, loading = false, isEdit = false, onCancel,
}: AssignmentFormProps) {
  const [classes,  setClasses]  = useState<ClassOption[]>([]);
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [teachers, setTeachers] = useState<TeacherOption[]>([]);

  useEffect(() => {
    fetch("/api/classes").then(r => r.json()).then(d => setClasses(Array.isArray(d) ? d : (d.classes ?? []))).catch(() => setClasses([]));
    fetch("/api/subjects").then(r => r.json()).then(d => setSubjects(Array.isArray(d) ? d : (d.subjects ?? []))).catch(() => setSubjects([]));
    fetch("/api/teachers").then(r => r.json()).then(d => setTeachers(Array.isArray(d) ? d : (d.teachers ?? []))).catch(() => setTeachers([]));
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      title:       initialValues?.title       ?? "",
      description: initialValues?.description ?? "",
      dueDate:     initialValues?.dueDate
        ? new Date(initialValues.dueDate).toISOString().split("T")[0]
        : "",
      totalMarks:  initialValues?.totalMarks  ?? 100,
      classId:     initialValues?.classId     ?? "",
      subjectId:   initialValues?.subjectId   ?? "",
      teacherId:   initialValues?.teacherId   ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      title:       initialValues?.title       ?? "",
      description: initialValues?.description ?? "",
      dueDate:     initialValues?.dueDate
        ? new Date(initialValues.dueDate).toISOString().split("T")[0]
        : "",
      totalMarks:  initialValues?.totalMarks  ?? 100,
      classId:     initialValues?.classId     ?? "",
      subjectId:   initialValues?.subjectId   ?? "",
      teacherId:   initialValues?.teacherId   ?? "",
    });
  }, [initialValues]);

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit(values as AssignmentPayload, isEdit ? "put" : "create");
  });

  return (
    <Form {...form}>
      <form className="space-y-4">
        <FormField control={form.control} name="title" render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl><Input placeholder="e.g. Chapter 5 Exercise" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea placeholder="Write assignment instructions here..." className="resize-none" rows={4} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField control={form.control} name="dueDate" render={({ field }) => (
            <FormItem>
              <FormLabel>Due Date</FormLabel>
              <FormControl><Input type="date" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="totalMarks" render={({ field }) => (
            <FormItem>
              <FormLabel>Total Marks</FormLabel>
              <FormControl><Input type="number" placeholder="100" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="classId" render={({ field }) => (
            <FormItem>
              <FormLabel>Class</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger></FormControl>
                <SelectContent position="popper" className="z-[9999]">
                  {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="subjectId" render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger></FormControl>
                <SelectContent position="popper" className="z-[9999]">
                  {subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="teacherId" render={({ field }) => (
            <FormItem>
              <FormLabel>Teacher</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select teacher" /></SelectTrigger></FormControl>
                <SelectContent position="popper" className="z-[9999]">
                  {teachers.map(t => <SelectItem key={t.id} value={t.id}>{t.username}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
        </div>

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