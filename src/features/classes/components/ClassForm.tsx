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
// import { Loader2, Save, PlusCircle, Trash2, Plus } from "lucide-react";
// import { Class } from "../types/class.types";
// import { toast } from "sonner";

// const schema = z.object({
//   grade: z.string().min(1, "Grade is required"),
//   section: z.string().min(1, "Section is required"),
//   academicYear: z.string().min(1, "Academic year is required"),
//   classTeacherId: z.string().optional(),
// });

// type FormValues = z.infer<typeof schema>;

// export type SubmitMode = "create" | "put" | "patch";

// type ClassPayload = Omit<Partial<Class>, "subjects"> & { 
//   grade?: string; 
//   section?: string; 
//   academicYear?: string;
//   classTeacherId?: string;
//   subjects?: Array<{
//     subjectId: string;
//     teacherId: string | null;
//   }>;
// };
// interface TeacherOption {
//   id: string;
//   username: string;
//   email: string;
// }

// interface Subject {
//   id: string;
//   name: string;
//   code?: string | null;
// }

// interface ClassSubject {
//   id: string;
//   subject: { id: string; name: string; code?: string | null };
//   teacher?: { id: string; username: string } | null;
// }

// interface ClassFormProps {
//   initialValues?: Partial<Class>;
//   onSubmit: (values: ClassPayload, mode: SubmitMode) => Promise<void>;
//   loading?: boolean;
//   isEdit?: boolean;
//   onCancel?: () => void;
// }

// export function ClassForm({
//   initialValues,
//   onSubmit,
//   loading = false,
//   isEdit = false,
//   onCancel,
// }: ClassFormProps) {
//   const [teachers, setTeachers] = useState<TeacherOption[]>([]);
//   const [subjects, setSubjects] = useState<Subject[]>([]);
//   const [classSubjects, setClassSubjects] = useState<ClassSubject[]>([]);
//   const [originalClassSubjects, setOriginalClassSubjects] = useState<ClassSubject[]>([]);
//   const [selectedSubject, setSelectedSubject] = useState<string>("");
//   const [selectedTeacher, setSelectedTeacher] = useState<string>("none");

//   useEffect(() => {
//     fetch("/api/teachers")
//       .then((r) => r.json())
//       .then((data) => setTeachers(Array.isArray(data) ? data : []))
//       .catch(() => setTeachers([]));
    
//     fetch("/api/subjects")
//       .then((r) => r.json())
//       .then((data) => setSubjects(Array.isArray(data) ? data : []))
//       .catch(() => setSubjects([]));
//   }, []);

//   // Reload class subjects whenever the form opens in edit mode
//   useEffect(() => {
//     if (isEdit && initialValues?.id) {
//       fetch(`/api/classes/${initialValues.id}/subjects`)
//         .then((r) => r.json())
//         .then((data) => {
//           const subjects = Array.isArray(data) ? data : [];
//           setClassSubjects(subjects);
//           setOriginalClassSubjects(subjects);
//         })
//         .catch(() => {
//           setClassSubjects([]);
//           setOriginalClassSubjects([]);
//         });
//     } else {
//       setClassSubjects([]);
//       setOriginalClassSubjects([]);
//     }
//     // Reset selections when dialog opens
//     setSelectedSubject("");
//     setSelectedTeacher("none");
//   }, [isEdit, initialValues?.id]);

//   const form = useForm<FormValues>({
//     resolver: zodResolver(schema),
//     defaultValues: {
//       grade: initialValues?.grade ?? "",
//       section: initialValues?.section ?? "",
//       academicYear: initialValues?.academicYear ?? new Date().getFullYear() + "-" + (new Date().getFullYear() + 1),
//       classTeacherId: initialValues?.classTeacherId ?? undefined,
//     },
//   });

//   const handlePut = form.handleSubmit(async (values) => {
//     try {
//       if (isEdit) {
//         // Edit mode: save class details first, then subjects
//         await onSubmit(values, "put");
//         if (initialValues?.id) {
//           await saveSubjectChanges();
//         }
//       } else {
//         // Create mode: pass subjects along with class data
//         const classData = {
//           ...values,
//           subjects: classSubjects.map(cs => ({
//             subjectId: cs.subject.id,
//             teacherId: cs.teacher?.id || null,
//           })),
//         };
//         await onSubmit(classData, "create");
//       }
//     } catch (error: any) {
//       console.error('Error in handlePut:', error);
//       toast.error("Failed to save changes");
//     }
//   });

//   async function saveSubjectChanges() {
//     if (!initialValues?.id) return;

//     try {
//       // Find subjects to add (in classSubjects but not in originalClassSubjects)
//       const toAdd = classSubjects.filter(
//         cs => !cs.id || cs.id.startsWith('temp-')
//       );

//       // Find subjects to remove (in originalClassSubjects but not in classSubjects)
//       const toRemove = originalClassSubjects.filter(
//         orig => !classSubjects.some(cs => cs.subject.id === orig.subject.id)
//       );

//       // Find subjects with teacher changes
//       const toUpdate = classSubjects.filter(cs => {
//         if (!cs.id || cs.id.startsWith('temp-')) return false;
//         const orig = originalClassSubjects.find(o => o.subject.id === cs.subject.id);
//         return orig && orig.teacher?.id !== cs.teacher?.id;
//       });

//       // Execute all changes and wait for completion
//       const results = await Promise.allSettled([
//         ...toAdd.map(cs =>
//           fetch(`/api/classes/${initialValues.id}/subjects`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               subjectId: cs.subject.id,
//               teacherId: cs.teacher?.id || null,
//             }),
//           }).then(res => {
//             if (!res.ok) throw new Error('Failed to add subject');
//             return res.json();
//           })
//         ),
//         ...toRemove.map(cs =>
//           fetch(`/api/classes/${initialValues.id}/subjects/${cs.subject.id}`, {
//             method: "DELETE",
//           }).then(res => {
//             if (!res.ok) throw new Error('Failed to remove subject');
//             return res.json();
//           })
//         ),
//         ...toUpdate.map(cs =>
//           fetch(`/api/classes/${initialValues.id}/subjects/${cs.subject.id}`, {
//             method: "PATCH",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               teacherId: cs.teacher?.id || null,
//             }),
//           }).then(res => {
//             if (!res.ok) throw new Error('Failed to update teacher');
//             return res.json();
//           })
//         ),
//       ]);

//       // Check if any failed
//       const failed = results.filter(r => r.status === 'rejected');
//       if (failed.length > 0) {
//         console.error('Some subject changes failed:', failed);
//         toast.error(`${failed.length} subject change(s) failed`);
//       } else {
//         toast.success("Class and subjects saved successfully");
//       }
//     } catch (error: any) {
//       console.error('Error saving subject changes:', error);
//       toast.error("Failed to save subject changes");
//       throw error;
//     }
//   }

//   function handleAddSubject() {
//     if (!selectedSubject) return;

//     const subject = subjects.find(s => s.id === selectedSubject);
//     if (!subject) return;

//     const teacher = selectedTeacher !== "none" 
//       ? teachers.find(t => t.id === selectedTeacher)
//       : null;

//     // Add to local state with temporary ID
//     const newSubject: ClassSubject = {
//       id: `temp-${Date.now()}`,
//       subject: { id: subject.id, name: subject.name, code: subject.code },
//       teacher: teacher ? { id: teacher.id, username: teacher.username } : null,
//     };

//     setClassSubjects([...classSubjects, newSubject]);
//     setSelectedSubject("");
//     setSelectedTeacher("none");
//   }

//   function handleUpdateTeacher(subjectId: string, teacherId: string) {
//     const teacher = teacherId !== "none" 
//       ? teachers.find(t => t.id === teacherId)
//       : null;

//     setClassSubjects(classSubjects.map(cs =>
//       cs.subject.id === subjectId
//         ? { ...cs, teacher: teacher ? { id: teacher.id, username: teacher.username } : null }
//         : cs
//     ));
//   }

//   function handleRemoveSubject(subjectId: string) {
//     setClassSubjects(classSubjects.filter(cs => cs.subject.id !== subjectId));
//   }

//   const availableSubjects = subjects.filter(
//     (s) => !classSubjects.some((cs) => cs.subject.id === s.id)
//   );

//   return (
//     <Form {...form}>
//       <form className="space-y-4">
//         <div className="grid grid-cols-2 gap-4">
//           <FormField control={form.control} name="grade" render={({ field }) => (
//             <FormItem>
//               <FormLabel>Grade</FormLabel>
//               <FormControl><Input placeholder="e.g. Grade 10" {...field} /></FormControl>
//               <FormMessage />
//             </FormItem>
//           )} />

//           <FormField control={form.control} name="section" render={({ field }) => (
//             <FormItem>
//               <FormLabel>Section</FormLabel>
//               <FormControl><Input placeholder="e.g. A, B, C" {...field} /></FormControl>
//               <FormMessage />
//             </FormItem>
//           )} />
//         </div>

//         <FormField control={form.control} name="academicYear" render={({ field }) => (
//           <FormItem>
//             <FormLabel>Academic Year</FormLabel>
//             <FormControl><Input placeholder="e.g. 2025-2026" {...field} /></FormControl>
//             <FormMessage />
//           </FormItem>
//         )} />

//         <FormField control={form.control} name="classTeacherId" render={({ field }) => (
//           <FormItem>
//             <FormLabel>Class Teacher (Optional)</FormLabel>
//             <Select onValueChange={(value) => field.onChange(value === "none" ? undefined : value)} value={field.value || "none"}>
//               <FormControl>
//                 <SelectTrigger><SelectValue placeholder="Select class teacher" /></SelectTrigger>
//               </FormControl>
//               <SelectContent>
//                 <SelectItem value="none">None</SelectItem>
//                 {teachers.map((t) => (
//                   <SelectItem key={t.id} value={t.id}>
//                     {t.username} — {t.email}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <FormMessage />
//           </FormItem>
//         )} />

//         {/* Subjects Section - Show in both add and edit mode */}
//         <div className="space-y-4 pt-4 border-t">
//           <div>
//             <h3 className="text-sm font-semibold mb-2">Class Subjects</h3>
//             <p className="text-xs text-muted-foreground mb-4">
//               {isEdit ? "Manage subjects and assign teachers for this class" : "Add subjects for this class (optional)"}
//             </p>
//           </div>

//           {/* Add Subject */}
//           <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
//             <h4 className="text-xs font-semibold">Add Subject</h4>
//             <div className="grid grid-cols-2 gap-3">
//               <Select value={selectedSubject} onValueChange={setSelectedSubject}>
//                 <SelectTrigger className="h-9">
//                   <SelectValue placeholder="Select subject" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {availableSubjects.map((s) => (
//                     <SelectItem key={s.id} value={s.id}>
//                       {s.name} {s.code && `(${s.code})`}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>

//               <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
//                 <SelectTrigger className="h-9">
//                   <SelectValue placeholder="Teacher (optional)" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="none">None</SelectItem>
//                   {teachers.map((t) => (
//                     <SelectItem key={t.id} value={t.id}>
//                       {t.username}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <Button
//               type="button"
//               onClick={handleAddSubject}
//               disabled={!selectedSubject}
//               size="sm"
//               className="w-full"
//               variant="outline"
//             >
//               <Plus className="mr-2 h-4 w-4" />
//               Add Subject
//             </Button>
//           </div>

//           {/* Current Subjects */}
//           <div className="space-y-2">
//             <h4 className="text-xs font-semibold">
//               Current Subjects ({classSubjects.length})
//             </h4>
//             {classSubjects.length === 0 ? (
//               <p className="text-xs text-muted-foreground text-center py-4 border rounded-lg">
//                 No subjects added yet
//               </p>
//             ) : (
//               <div className="space-y-2">
//                 {classSubjects.map((cs) => (
//                   <div
//                     key={cs.id}
//                     className="flex items-center gap-3 p-3 border rounded-lg bg-card"
//                   >
//                     <div className="flex-1">
//                       <p className="text-sm font-medium">
//                         {cs.subject.name}
//                         {cs.subject.code && (
//                           <span className="ml-2 text-xs text-muted-foreground">
//                             ({cs.subject.code})
//                           </span>
//                         )}
//                       </p>
//                     </div>
//                     <div className="w-40">
//                       <Select
//                         value={cs.teacher?.id || "none"}
//                         onValueChange={(val) =>
//                           handleUpdateTeacher(cs.subject.id, val)
//                         }
//                       >
//                         <SelectTrigger className="h-8 text-xs">
//                           <SelectValue placeholder="Assign teacher" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="none">No teacher</SelectItem>
//                           {teachers.map((t) => (
//                             <SelectItem key={t.id} value={t.id}>
//                               {t.username}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="icon"
//                       className="h-8 w-8 text-destructive hover:bg-red-50"
//                       onClick={() => handleRemoveSubject(cs.subject.id)}
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

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
  Form, FormControl, FormField, FormItem,
  FormLabel, FormMessage,
} from "@/core/components/ui/form";
import { Input } from "@/core/components/ui/input";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/core/components/ui/select";
import { Loader2, Save, PlusCircle, Trash2, Plus } from "lucide-react";
import { Class } from "../types/class.types";
import { toast } from "sonner";

const schema = z.object({
  grade: z.string().min(1, "Grade is required"),
  section: z.string().min(1, "Section is required"),
  academicYear: z.string().min(1, "Academic year is required"),
  classTeacherId: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export type SubmitMode = "create" | "put" | "patch";

type ClassPayload = Omit<Partial<Class>, "subjects"> & {
  grade?: string;
  section?: string;
  academicYear?: string;
  classTeacherId?: string;
  subjects?: Array<{
    subjectId: string;
    teacherId: string | null;
  }>;
};

interface TeacherOption {
  id: string;
  username: string;
  email: string;
}

interface Subject {
  id: string;
  name: string;
  code?: string | null;
}

interface ClassSubject {
  id: string;
  subject: { id: string; name: string; code?: string | null };
  teacher?: { id: string; username: string } | null;
}

interface ClassFormProps {
  initialValues?: Partial<Class>;
  onSubmit: (values: ClassPayload, mode: SubmitMode) => Promise<void>;
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
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classSubjects, setClassSubjects] = useState<ClassSubject[]>([]);
  const [originalClassSubjects, setOriginalClassSubjects] = useState<ClassSubject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedTeacher, setSelectedTeacher] = useState<string>("none");

  useEffect(() => {
    fetch("/api/teachers")
      .then((r) => r.json())
      .then((data) => setTeachers(Array.isArray(data) ? data : []))
      .catch(() => setTeachers([]));

    fetch("/api/subjects")
      .then((r) => r.json())
      .then((data) => setSubjects(Array.isArray(data) ? data : []))
      .catch(() => setSubjects([]));
  }, []);

  // FIX: Reset form fields whenever the dialog opens for a different class
  useEffect(() => {
    form.reset({
      grade: initialValues?.grade ?? "",
      section: initialValues?.section ?? "",
      academicYear:
        initialValues?.academicYear ??
        `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
      // FIX: store "none" as the sentinel value so the Select renders correctly
      classTeacherId: initialValues?.classTeacherId ?? "none",
    });
  }, [initialValues?.id]);

  // Reload class subjects whenever the form opens in edit mode
  useEffect(() => {
    if (isEdit && initialValues?.id) {
      fetch(`/api/classes/${initialValues.id}/subjects`)
        .then((r) => r.json())
        .then((data) => {
          const subs = Array.isArray(data) ? data : [];
          console.log('[LOAD_SUBJECTS] Loaded subjects for class:', subs);
          setClassSubjects(subs);
          setOriginalClassSubjects(subs);
        })
        .catch(() => {
          setClassSubjects([]);
          setOriginalClassSubjects([]);
        });
    } else {
      setClassSubjects([]);
      setOriginalClassSubjects([]);
    }
    setSelectedSubject("");
    setSelectedTeacher("none");
  }, [isEdit, initialValues?.id]);

  // Debug: Log whenever classSubjects changes
  useEffect(() => {
    console.log('[STATE] classSubjects updated:', classSubjects);
  }, [classSubjects]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      grade: initialValues?.grade ?? "",
      section: initialValues?.section ?? "",
      academicYear:
        initialValues?.academicYear ??
        `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
      // FIX: default to "none" so Select shows "None" instead of blank
      classTeacherId: initialValues?.classTeacherId ?? "none",
    },
  });

  const handlePut = form.handleSubmit(async (values) => {
    console.log('[SUBMIT] Form values:', values);
    console.log('[SUBMIT] classSubjects:', classSubjects);
    
    try {
      // FIX: strip the "none" sentinel before sending to the API
      const cleanedValues: ClassPayload = {
        ...values,
        classTeacherId:
          values.classTeacherId === "none" || !values.classTeacherId
            ? undefined
            : values.classTeacherId,
      };

      console.log('[SUBMIT] Cleaned values:', cleanedValues);

      if (isEdit) {
        console.log('[SUBMIT] Edit mode - updating class');
        await onSubmit(cleanedValues, "put");
        if (initialValues?.id) {
          console.log('[SUBMIT] Saving subject changes');
          try {
            await saveSubjectChanges();
            // Only reload on success
            window.location.reload();
          } catch (error) {
            console.error('[SUBMIT] Failed to save subject changes:', error);
            // Don't reload on error so user can see what went wrong
          }
        }
      } else {
        const classData: ClassPayload = {
          ...cleanedValues,
          subjects: classSubjects.map((cs) => ({
            subjectId: cs.subject.id,
            teacherId: cs.teacher?.id || null,
          })),
        };
        console.log('[SUBMIT] Create mode - creating class with data:', classData);
        await onSubmit(classData, "create");
      }
    } catch (error: any) {
      console.error("[SUBMIT] Error in handlePut:", error);
      toast.error("Failed to save changes");
    }
  });

  async function saveSubjectChanges() {
    if (!initialValues?.id) {
      console.error('[SAVE_SUBJECTS] No class ID available');
      return;
    }

    console.log('[SAVE_SUBJECTS] Class ID:', initialValues.id);
    console.log('[SAVE_SUBJECTS] Current classSubjects:', classSubjects);
    console.log('[SAVE_SUBJECTS] Original classSubjects:', originalClassSubjects);

    try {
      // Find subjects to add (temp IDs)
      const toAdd = classSubjects.filter(
        (cs) => cs.id && cs.id.startsWith("temp-")
      );

      // Find subjects to remove (not in current classSubjects)
      const toRemove = originalClassSubjects.filter(
        (orig) => !classSubjects.some((cs) => cs.subject.id === orig.subject.id)
      );

      console.log('[SAVE_SUBJECTS] Adding subjects:', toAdd);
      console.log('[SAVE_SUBJECTS] Removing subjects:', toRemove);

      // Add new subjects
      for (const cs of toAdd) {
        try {
          const response = await fetch(`/api/classes/${initialValues.id}/subjects`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              subjectId: cs.subject.id,
              teacherId: cs.teacher?.id || null,
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error(`Failed to add subject ${cs.subject.name}:`, errorText);
            throw new Error(`Failed to add ${cs.subject.name}: ${errorText}`);
          }

          console.log(`Successfully added subject: ${cs.subject.name}`);
        } catch (error) {
          console.error(`Error adding subject ${cs.subject.name}:`, error);
          throw error;
        }
      }

      // Remove deleted subjects
      for (const cs of toRemove) {
        try {
          console.log(`[SAVE_SUBJECTS] Removing subject:`, {
            classId: initialValues.id,
            subjectId: cs.subject.id,
            subjectName: cs.subject.name,
            fullRecord: cs
          });

          const response = await fetch(`/api/classes/${initialValues.id}/subjects/${cs.subject.id}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error(`Failed to remove subject ${cs.subject.name}:`, errorText);
            throw new Error(`Failed to remove ${cs.subject.name}: ${errorText}`);
          }

          console.log(`Successfully removed subject: ${cs.subject.name}`);
        } catch (error) {
          console.error(`Error removing subject ${cs.subject.name}:`, error);
          throw error;
        }
      }

      if (toAdd.length > 0 || toRemove.length > 0) {
        toast.success(`${toAdd.length} subjects added, ${toRemove.length} subjects removed`);
      } else {
        toast.success("No changes to save");
      }
    } catch (error: any) {
      console.error("Error saving subject changes:", error);
      toast.error("Failed to save subject changes: " + error.message);
      throw error;
    }
  }

  function handleAddSubject() {
    console.log('[ADD_SUBJECT] Button clicked');
    console.log('[ADD_SUBJECT] selectedSubject:', selectedSubject);
    console.log('[ADD_SUBJECT] selectedTeacher:', selectedTeacher);
    
    if (!selectedSubject) {
      console.log('[ADD_SUBJECT] No subject selected, returning');
      return;
    }

    const subject = subjects.find((s) => s.id === selectedSubject);
    console.log('[ADD_SUBJECT] Found subject:', subject);
    
    if (!subject) {
      console.log('[ADD_SUBJECT] Subject not found in subjects array');
      return;
    }

    const teacher =
      selectedTeacher !== "none"
        ? teachers.find((t) => t.id === selectedTeacher)
        : null;
    
    console.log('[ADD_SUBJECT] Found teacher:', teacher);

    const newSubject: ClassSubject = {
      id: `temp-${Date.now()}`,
      subject: { id: subject.id, name: subject.name, code: subject.code },
      teacher: teacher ? { id: teacher.id, username: teacher.username } : null,
    };

    console.log('[ADD_SUBJECT] New subject to add:', newSubject);
    console.log('[ADD_SUBJECT] Current classSubjects:', classSubjects);
    
    setClassSubjects([...classSubjects, newSubject]);
    console.log('[ADD_SUBJECT] Updated classSubjects');
    
    setSelectedSubject("");
    setSelectedTeacher("none");
    
    toast.success(`Added ${subject.name} to class`);
  }

  function handleUpdateTeacher(subjectId: string, teacherId: string) {
    const teacher =
      teacherId !== "none" ? teachers.find((t) => t.id === teacherId) : null;

    setClassSubjects(
      classSubjects.map((cs) =>
        cs.subject.id === subjectId
          ? {
              ...cs,
              teacher: teacher
                ? { id: teacher.id, username: teacher.username }
                : null,
            }
          : cs
      )
    );
  }

  function handleRemoveSubject(subjectId: string) {
    setClassSubjects(classSubjects.filter((cs) => cs.subject.id !== subjectId));
  }

  const availableSubjects = subjects.filter(
    (s) => !classSubjects.some((cs) => cs.subject.id === s.id)
  );

  return (
    <Form {...form}>
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grade</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Grade 10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="section"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Section</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. A, B, C" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="academicYear"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Academic Year</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 2025-2026" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="classTeacherId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class Teacher (Optional)</FormLabel>
              {/* FIX: pass the value through as-is ("none" is a valid sentinel),
                  strip it only at submit time in handlePut */}
              <Select
                onValueChange={field.onChange}
                value={field.value || "none"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class teacher" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent position="popper" className="z-[9999]">
                  <SelectItem value="none">None</SelectItem>
                  {teachers.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.username} — {t.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Subjects Section */}
        <div className="space-y-4 pt-4 border-t">
          <div>
            <h3 className="text-sm font-semibold mb-2">Class Subjects</h3>
            <p className="text-xs text-muted-foreground mb-4">
              {isEdit
                ? "Manage subjects and assign teachers for this class"
                : "Add subjects for this class (optional)"}
            </p>
          </div>

          {/* Add Subject */}
          <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
            <h4 className="text-xs font-semibold">Add Subject</h4>
            <div className="grid grid-cols-2 gap-3">
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent position="popper" className="z-[9999]">
                  {availableSubjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} {s.code && `(${s.code})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Teacher (optional)" />
                </SelectTrigger>
                <SelectContent position="popper" className="z-[9999]">
                  <SelectItem value="none">None</SelectItem>
                  {teachers.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              onClick={() => {
                console.log('[BUTTON] Add Subject button clicked!');
                handleAddSubject();
              }}
              disabled={!selectedSubject}
              size="sm"
              className="w-full"
              variant="outline"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Subject
            </Button>
          </div>

          {/* Current Subjects */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold">
              Current Subjects ({classSubjects.length})
            </h4>
            {classSubjects.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4 border rounded-lg">
                No subjects added yet
              </p>
            ) : (
              <div className="space-y-2">
                {classSubjects.map((cs) => (
                  <div
                    key={cs.id}
                    className="flex items-center gap-3 p-3 border rounded-lg bg-card"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {cs.subject.name}
                        {cs.subject.code && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            ({cs.subject.code})
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="w-40">
                      <Select
                        value={cs.teacher?.id || "none"}
                        onValueChange={(val) =>
                          handleUpdateTeacher(cs.subject.id, val)
                        }
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Assign teacher" />
                        </SelectTrigger>
                        <SelectContent position="popper" className="z-[9999]">
                          <SelectItem value="none">No teacher</SelectItem>
                          {teachers.map((t) => (
                            <SelectItem key={t.id} value={t.id}>
                              {t.username}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-red-50"
                      onClick={() => handleRemoveSubject(cs.subject.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 pt-2 justify-end">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
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