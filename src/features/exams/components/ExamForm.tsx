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
// import { Input } from "@/core/components/ui/input";
// import {
//   Select, SelectContent, SelectItem,
//   SelectTrigger, SelectValue,
// } from "@/core/components/ui/select";
// import { Loader2, Save, PlusCircle } from "lucide-react";
// import { Exam } from "../types/exam.types";

// const schema = z.object({
//   title: z.string().min(2, "Minimum 2 characters"),
//   subjectId: z.string().min(1, "Please select a subject"),
//   date: z.string().min(1, "Please select a date"),
// });

// type FormValues = z.infer<typeof schema>;

// export type SubmitMode = "create" | "put" | "patch";
// type ExamPayload = Partial<Exam> & { subjectId?: string };

// interface SubjectOption {
//   id: string;
//   name: string;
// }

// interface ExamFormProps {
//   initialValues?: Partial<Exam>;
//   onSubmit: (values: ExamPayload, mode: SubmitMode) => void;
//   loading?: boolean;
//   isEdit?: boolean;
//   onCancel?: () => void;
// }

// export function ExamForm({
//   initialValues,
//   onSubmit,
//   loading = false,
//   isEdit = false,
//   onCancel,
// }: ExamFormProps) {
//   const [subjects, setSubjects] = useState<SubjectOption[]>([]);

//   useEffect(() => {
//     fetch("/api/subjects")
//       .then((r) => r.json())
//       .then((data) => setSubjects(Array.isArray(data) ? data : []))
//       .catch(() => setSubjects([]));
//   }, []);

//   const form = useForm<FormValues>({
//     resolver: zodResolver(schema),
//     defaultValues: {
//       title: initialValues?.title ?? "",
//       subjectId: initialValues?.subjectId ?? "",
//       date: initialValues?.date
//         ? new Date(initialValues.date).toISOString().split("T")[0]
//         : "",
//     },
//   });

//   const handlePut = form.handleSubmit((values) => {
//     onSubmit(values as ExamPayload, isEdit ? "put" : "create");
//   });

//   return (
//     <Form {...form}>
//       <form className="space-y-4">
//         <FormField control={form.control} name="title" render={({ field }) => (
//           <FormItem>
//             <FormLabel>Exam Title</FormLabel>
//             <FormControl><Input placeholder="e.g. Mid Term Exam" {...field} /></FormControl>
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
//                   <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <FormMessage />
//           </FormItem>
//         )} />

//         <FormField control={form.control} name="date" render={({ field }) => (
//           <FormItem>
//             <FormLabel>Exam Date</FormLabel>
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
import { Loader2, Save, PlusCircle } from "lucide-react";
import { Exam, ExamType } from "../types/exam.types";

const EXAM_TYPES: ExamType[] = ["MIDTERM", "FINAL", "UNIT_TEST", "PRACTICAL"];

const schema = z.object({
  title:      z.string().min(2, "Minimum 2 characters"),
  type:       z.string().min(1, "Please select exam type"),
  subjectId:  z.string().min(1, "Please select a subject"),
  classId:    z.string().min(1, "Please select a class"),
  date:       z.string().min(1, "Please select a date"),
  totalMarks: z.coerce.number().min(1, "Total marks required"),
  passMarks:  z.coerce.number().min(0, "Pass marks required"),
});

type FormValues = z.infer<typeof schema>;
export type SubmitMode = "create" | "put" | "patch";
type ExamPayload = Partial<Exam>;

interface SubjectOption { id: string; name: string }
interface ClassOption   { id: string; name: string }

interface ExamFormProps {
  initialValues?: Partial<Exam>;
  onSubmit: (values: ExamPayload, mode: SubmitMode) => void;
  loading?: boolean;
  isEdit?: boolean;
  onCancel?: () => void;
}

export function ExamForm({ initialValues, onSubmit, loading = false, isEdit = false, onCancel }: ExamFormProps) {
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [classes,  setClasses]  = useState<ClassOption[]>([]);

  useEffect(() => {
    fetch("/api/subjects").then(r => r.json()).then(d => setSubjects(Array.isArray(d) ? d : [])).catch(() => setSubjects([]));
    fetch("/api/classes").then(r  => r.json()).then(d => setClasses(Array.isArray(d) ? d : [])).catch(() => setClasses([]));
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      title:      initialValues?.title      ?? "",
      type:       initialValues?.type       ?? "",
      subjectId:  initialValues?.subjectId  ?? "",
      classId:    initialValues?.classId    ?? "",
      date:       initialValues?.date
        ? new Date(initialValues.date).toISOString().split("T")[0]
        : "",
      totalMarks: initialValues?.totalMarks ?? 100,
      passMarks:  initialValues?.passMarks  ?? 40,
    },
  });

  useEffect(() => {
    form.reset({
      title:      initialValues?.title      ?? "",
      type:       initialValues?.type       ?? "",
      subjectId:  initialValues?.subjectId  ?? "",
      classId:    initialValues?.classId    ?? "",
      date:       initialValues?.date
        ? new Date(initialValues.date).toISOString().split("T")[0]
        : "",
      totalMarks: initialValues?.totalMarks ?? 100,
      passMarks:  initialValues?.passMarks  ?? 40,
    });
  }, [initialValues]);

  const handleSubmit = form.handleSubmit((values) => {
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField control={form.control} name="type" render={({ field }) => (
            <FormItem>
              <FormLabel>Exam Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                <SelectContent position="popper" className="z-[9999]">
                  {EXAM_TYPES.map(t => (
                    <SelectItem key={t} value={t}>
                      {t.replace("_", " ").charAt(0) + t.replace("_", " ").slice(1).toLowerCase()}
                    </SelectItem>
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

          <FormField control={form.control} name="totalMarks" render={({ field }) => (
            <FormItem>
              <FormLabel>Total Marks</FormLabel>
              <FormControl><Input type="number" placeholder="100" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="passMarks" render={({ field }) => (
            <FormItem>
              <FormLabel>Pass Marks</FormLabel>
              <FormControl><Input type="number" placeholder="40" {...field} /></FormControl>
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