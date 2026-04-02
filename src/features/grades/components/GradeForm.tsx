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
// import { Grade } from "../types/grade.types";

// const schema = z.object({
//   studentId:    z.string().min(1, "Please select a student"),
//   assignmentId: z.string().min(1, "Please select an assignment"),
//   score:        z.coerce.number().min(0, "Min 0").max(100, "Max 100"),
// });

// type FormValues = z.infer<typeof schema>;

// export type SubmitMode = "create" | "put" | "patch";
// type GradePayload = Partial<Grade> & { studentId?: string; assignmentId?: string };

// interface StudentOption    { id: string; username: string; email: string; }
// interface AssignmentOption { id: string; title: string; dueDate: string; }

// interface GradeFormProps {
//   initialValues?: Partial<Grade>;
//   onSubmit: (values: GradePayload, mode: SubmitMode) => void;
//   loading?: boolean;
//   isEdit?: boolean;
//   onCancel?: () => void;
// }

// export function GradeForm({
//   initialValues,
//   onSubmit,
//   loading = false,
//   isEdit = false,
//   onCancel,
// }: GradeFormProps) {
//   const [students,    setStudents]    = useState<StudentOption[]>([]);
//   const [assignments, setAssignments] = useState<AssignmentOption[]>([]);

//   useEffect(() => {
//     fetch("/api/students")
//       .then((r) => r.json())
//       .then((d) => setStudents(Array.isArray(d) ? d : []))
//       .catch(() => setStudents([]));

//     fetch("/api/assignments")
//       .then((r) => r.json())
//       .then((d) => setAssignments(Array.isArray(d) ? d : []))
//       .catch(() => setAssignments([]));
//   }, []);

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const form = useForm<FormValues>({
//     resolver: zodResolver(schema) as any,
//     defaultValues: {
//       studentId:    initialValues?.studentId    ?? "",
//       assignmentId: initialValues?.assignmentId ?? "",
//       score:        initialValues?.score        ?? 0,
//     },
//   });

//   const handleSubmit = form.handleSubmit((values) => {
//     onSubmit(values as GradePayload, isEdit ? "put" : "create");
//   });

//   return (
//     <Form {...form}>
//       <form className="space-y-4">

//         {/* Student */}
//         <FormField
//           control={form.control as any}
//           name="studentId"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Student</FormLabel>
//               <Select onValueChange={field.onChange} value={field.value}>
//                 <FormControl>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select a student" />
//                   </SelectTrigger>
//                 </FormControl>
//                 <SelectContent>
//                   {students.map((s) => (
//                     <SelectItem key={s.id} value={s.id}>
//                       {s.username} — {s.email}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* Assignment */}
//         <FormField
//           control={form.control as any}
//           name="assignmentId"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Assignment</FormLabel>
//               <Select onValueChange={field.onChange} value={field.value}>
//                 <FormControl>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select an assignment" />
//                   </SelectTrigger>
//                 </FormControl>
//                 <SelectContent>
//                   {assignments.map((a) => (
//                     <SelectItem key={a.id} value={a.id}>
//                       {a.title}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* Score */}
//         <FormField
//           control={form.control as any}
//           name="score"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Score (0 – 100)</FormLabel>
//               <FormControl>
//                 <Input
//                   type="number"
//                   min={0}
//                   max={100}
//                   placeholder="e.g. 85"
//                   {...field}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <div className="flex gap-2 pt-2 justify-end w-full">
//           {onCancel && (
//             <Button type="button" variant="outline" onClick={onCancel}>
//               Cancel
//             </Button>
//           )}
//           {isEdit ? (
//             <Button type="button" onClick={handleSubmit} disabled={loading}>
//               {loading ? <Loader2 className="animate-spin" /> : <Save />}
//               Save All
//             </Button>
//           ) : (
//             <Button type="button" onClick={handleSubmit} disabled={loading}>
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

/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import * as z from "zod";
import { Button } from "@/core/components/ui/button";
import {
  Form, FormControl, FormField, FormItem,
  FormLabel, FormMessage,
} from "@/core/components/ui/form";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/core/components/ui/select";
import { Input } from "@/core/components/ui/input";
import { Loader2, Save, PlusCircle } from "lucide-react";
import { Grade } from "../types/grade.types";

const schema = z.object({
  studentId:    z.string().min(1, "Please select a student"),
  assignmentId: z.string().min(1, "Please select an assignment"),
  score:        z.coerce.number().min(0, "Min 0").max(100, "Max 100"),
});

type FormValues = z.infer<typeof schema>;

export type SubmitMode = "create" | "put" | "patch";
export type GradePayload = Partial<Grade> & { studentId?: string; assignmentId?: string };

interface StudentOption    { id: string; username: string; email: string; }
interface AssignmentOption { id: string; title: string; dueDate: string; }

interface GradeFormProps {
  initialValues?: Partial<Grade>;
  onSubmit: (values: GradePayload, mode: SubmitMode) => void;
  loading?: boolean;
  isEdit?: boolean;
  onCancel?: () => void;
}

export function GradeForm({
  initialValues,
  onSubmit,
  loading = false,
  isEdit = false,
  onCancel,
}: GradeFormProps) {
  const [students,    setStudents]    = useState<StudentOption[]>([]);
  const [assignments, setAssignments] = useState<AssignmentOption[]>([]);

  useEffect(() => {
    fetch("/api/students")
      .then((r) => r.json())
      .then((d) => setStudents(Array.isArray(d) ? d : []))
      .catch(() => setStudents([]));

    fetch("/api/assignments")
      .then((r) => r.json())
      .then((d) => setAssignments(Array.isArray(d) ? d : []))
      .catch(() => setAssignments([]));
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      studentId:    initialValues?.studentId    ?? "",
      assignmentId: initialValues?.assignmentId ?? "",
      score:        initialValues?.score        ?? 0,
    },
  });

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit(values as GradePayload, isEdit ? "put" : "create");
  });

  return (
    <Form {...form}>
      <form className="space-y-4">

        {/* Student */}
        <FormField
          control={form.control as any}
          name="studentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Student</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a student" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {students.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.username} — {s.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Assignment */}
        <FormField
          control={form.control as any}
          name="assignmentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assignment</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an assignment" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {assignments.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Score */}
        <FormField
          control={form.control as any}
          name="score"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Score (0 – 100)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  placeholder="e.g. 85"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 pt-2 justify-end w-full">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          {isEdit ? (
            <Button type="button" onClick={handleSubmit} disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
              Save All
            </Button>
          ) : (
            <Button type="button" onClick={handleSubmit} disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
              Submit
              <PlusCircle className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}