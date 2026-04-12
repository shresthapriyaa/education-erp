// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { useEffect, useState } from "react";
// import * as z from "zod";
// import { Button } from "@/core/components/ui/button";
// import {
//   Form, FormControl, FormField, FormItem,
//   FormLabel, FormMessage,
// } from "@/core/components/ui/form";
// import {
//   Select, SelectContent, SelectItem,
//   SelectTrigger, SelectValue,
// } from "@/core/components/ui/select";
// import { Input } from "@/core/components/ui/input";
// import { Loader2, Save, PlusCircle } from "lucide-react";
// import { Result } from "../types/result.types";

// const GRADES = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"];

// const schema = z.object({
//   studentId: z.string().min(1, "Please select a student"),
//   subjectId: z.string().min(1, "Please select a subject"),
//   grade: z.string().min(1, "Please select a grade"),
// });

// type FormValues = z.infer<typeof schema>;

// export type SubmitMode = "create" | "put" | "patch";
// type ResultPayload = Partial<Result> & { studentId?: string; subjectId?: string };

// interface StudentOption {
//   id: string;
//   username: string;
//   email: string;
// }

// interface SubjectOption {
//   id: string;
//   name: string;
// }

// interface ResultFormProps {
//   initialValues?: Partial<Result>;
//   onSubmit: (values: ResultPayload, mode: SubmitMode) => void;
//   loading?: boolean;
//   isEdit?: boolean;
//   onCancel?: () => void;
// }

// export function ResultForm({
//   initialValues,
//   onSubmit,
//   loading = false,
//   isEdit = false,
//   onCancel,
// }: ResultFormProps) {
//   const [students, setStudents] = useState<StudentOption[]>([]);
//   const [subjects, setSubjects] = useState<SubjectOption[]>([]);

//   useEffect(() => {
//     fetch("/api/students")
//       .then((r) => r.json())
//       .then((data) => setStudents(Array.isArray(data) ? data : []))
//       .catch(() => setStudents([]));

//     fetch("/api/subjects")
//       .then((r) => r.json())
//       .then((data) => setSubjects(Array.isArray(data) ? data : []))
//       .catch(() => setSubjects([]));
//   }, []);

//   const form = useForm<FormValues>({
//     resolver: zodResolver(schema),
//     defaultValues: {
//       studentId: initialValues?.studentId ?? "",
//       subjectId: initialValues?.subjectId ?? "",
//       grade: initialValues?.grade ?? "",
//     },
//   });

//   const handlePut = form.handleSubmit((values) => {
//     onSubmit(values as ResultPayload, isEdit ? "put" : "create");
//   });

//   return (
//     <Form {...form}>
//       <form className="space-y-4">
//         <FormField control={form.control} name="studentId" render={({ field }) => (
//           <FormItem>
//             <FormLabel>Student</FormLabel>
//             <Select onValueChange={field.onChange} value={field.value}>
//               <FormControl>
//                 <SelectTrigger><SelectValue placeholder="Select a student" /></SelectTrigger>
//               </FormControl>
//               <SelectContent>
//                 {students.map((s) => (
//                   <SelectItem key={s.id} value={s.id}>
//                     {s.username} — {s.email}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <FormMessage />
//           </FormItem>
//         )} />

//         <FormField control={form.control} name="subjectId" render={({ field }) => (
//           <FormItem>
//             <FormLabel>Subject</FormLabel>
//             <Select onValueChange={field.onChange} value={field.value}>
//               <FormControl>
//                 <SelectTrigger><SelectValue placeholder="Select a subject" /></SelectTrigger>
//               </FormControl>
//               <SelectContent>
//                 {subjects.map((s) => (
//                   <SelectItem key={s.id} value={s.id}>
//                     {s.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <FormMessage />
//           </FormItem>
//         )} />

//         <FormField control={form.control} name="grade" render={({ field }) => (
//           <FormItem>
//             <FormLabel>Grade</FormLabel>
//             <Select onValueChange={field.onChange} value={field.value}>
//               <FormControl>
//                 <SelectTrigger><SelectValue placeholder="Select a grade" /></SelectTrigger>
//               </FormControl>
//               <SelectContent>
//                 {GRADES.map((g) => (
//                   <SelectItem key={g} value={g}>{g}</SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <FormMessage />
//           </FormItem>
//         )} />

//         <div className="flex gap-2 pt-2 justify-end ">
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
import { Switch } from "@/core/components/ui/switch";
import { Loader2, Save, PlusCircle } from "lucide-react";
import { Result } from "../types/result.types";

const GRADES = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"];
const TERMS  = ["Term 1", "Term 2", "Term 3", "Final"];

const schema = z.object({
  studentId:     z.string().min(1, "Please select a student"),
  subjectId:     z.string().min(1, "Please select a subject"),
  classId:       z.string().min(1, "Please select a class"),
  academicYear:  z.string().min(1, "Academic year is required"),
  term:          z.string().min(1, "Please select a term"),
  totalMarks:    z.coerce.number().min(1, "Total marks required"),
  obtainedMarks: z.coerce.number().min(0, "Obtained marks required"),
  grade:         z.string().min(1, "Please select a grade"),
  isPassed:      z.boolean(),
});

type FormValues = z.infer<typeof schema>;
export type SubmitMode = "create" | "put" | "patch";
type ResultPayload = Partial<Result>;

interface StudentOption { id: string; username: string; email: string }
interface SubjectOption { id: string; name: string }
interface ClassOption   { id: string; name: string }

interface ResultFormProps {
  initialValues?: Partial<Result>;
  onSubmit: (values: ResultPayload, mode: SubmitMode) => void;
  loading?: boolean;
  isEdit?: boolean;
  onCancel?: () => void;
}

export function ResultForm({ initialValues, onSubmit, loading = false, isEdit = false, onCancel }: ResultFormProps) {
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [classes,  setClasses]  = useState<ClassOption[]>([]);

  useEffect(() => {
    fetch("/api/students").then(r => r.json()).then(d => setStudents(Array.isArray(d) ? d : (d.students ?? []))).catch(() => setStudents([]));
    fetch("/api/subjects").then(r => r.json()).then(d => setSubjects(Array.isArray(d) ? d : [])).catch(() => setSubjects([]));
    fetch("/api/classes").then(r  => r.json()).then(d => setClasses(Array.isArray(d) ? d : [])).catch(() => setClasses([]));
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      studentId:     initialValues?.studentId     ?? "",
      subjectId:     initialValues?.subjectId     ?? "",
      classId:       initialValues?.classId       ?? "",
      academicYear:  initialValues?.academicYear  ?? "",
      term:          initialValues?.term          ?? "",
      totalMarks:    initialValues?.totalMarks    ?? 100,
      obtainedMarks: initialValues?.obtainedMarks ?? 0,
      grade:         initialValues?.grade         ?? "",
      isPassed:      initialValues?.isPassed      ?? false,
    },
  });

  useEffect(() => {
    form.reset({
      studentId:     initialValues?.studentId     ?? "",
      subjectId:     initialValues?.subjectId     ?? "",
      classId:       initialValues?.classId       ?? "",
      academicYear:  initialValues?.academicYear  ?? "",
      term:          initialValues?.term          ?? "",
      totalMarks:    initialValues?.totalMarks    ?? 100,
      obtainedMarks: initialValues?.obtainedMarks ?? 0,
      grade:         initialValues?.grade         ?? "",
      isPassed:      initialValues?.isPassed      ?? false,
    });
  }, [initialValues]);

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit(values as ResultPayload, isEdit ? "put" : "create");
  });

  return (
    <Form {...form}>
      <form className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField control={form.control} name="studentId" render={({ field }) => (
            <FormItem>
              <FormLabel>Student</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger></FormControl>
                <SelectContent position="popper" className="z-[9999]">
                  {students.map(s => <SelectItem key={s.id} value={s.id}>{s.username} — {s.email}</SelectItem>)}
                </SelectContent>
              </Select>
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

          <FormField control={form.control} name="term" render={({ field }) => (
            <FormItem>
              <FormLabel>Term</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select term" /></SelectTrigger></FormControl>
                <SelectContent position="popper" className="z-[9999]">
                  {TERMS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="academicYear" render={({ field }) => (
            <FormItem>
              <FormLabel>Academic Year</FormLabel>
              <FormControl><Input placeholder="e.g. 2025-2026" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="grade" render={({ field }) => (
            <FormItem>
              <FormLabel>Grade</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger></FormControl>
                <SelectContent position="popper" className="z-[9999]">
                  {GRADES.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
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

          <FormField control={form.control} name="obtainedMarks" render={({ field }) => (
            <FormItem>
              <FormLabel>Obtained Marks</FormLabel>
              <FormControl><Input type="number" placeholder="0" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="isPassed" render={({ field }) => (
          <FormItem className="flex items-center gap-3">
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <FormLabel className="mt-0">Mark as Passed</FormLabel>
          </FormItem>
        )} />

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