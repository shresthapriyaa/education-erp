// // // "use client";

// // // /**
// // //  * src/features/attendance/components/AttendanceForm.tsx
// // //  * Admin: manually create or edit an attendance record.
// // //  */

// // // import { useState } from "react";
// // // import { Button }   from "@/core/components/ui/button";
// // // import { Label }    from "@/core/components/ui/label";
// // // import { Input }    from "@/core/components/ui/input";
// // // import { Textarea } from "@/core/components/ui/textarea";
// // // import {
// // //   Select, SelectContent, SelectItem,
// // //   SelectTrigger, SelectValue,
// // // } from "@/core/components/ui/select";
// // // import type {
// // //   AttendanceDTO,
// // //   AttendanceFormErrors,
// // //   AttendanceFormValues,
// // //   AttendanceStatus,
// // // } from "../types/attendance.types";

// // // const STATUS_OPTIONS: { value: AttendanceStatus; label: string }[] = [
// // //   { value: "PRESENT", label: "Present" },
// // //   { value: "LATE",    label: "Late"    },
// // //   { value: "ABSENT",  label: "Absent"  },
// // //   { value: "EXCUSED", label: "Excused" },
// // // ];

// // // function validate(v: AttendanceFormValues): AttendanceFormErrors {
// // //   const e: AttendanceFormErrors = {};
// // //   if (!v.studentId.trim()) e.studentId = "Student is required.";
// // //   if (!v.sessionId.trim()) e.sessionId = "Session is required.";
// // //   if (!v.status)           e.status    = "Status is required.";
// // //   return e;
// // // }

// // // interface AttendanceFormProps {
// // //   record?:    AttendanceDTO;
// // //   onSubmit:   (values: AttendanceFormValues) => Promise<void>;
// // //   onCancel:   () => void;
// // //   isLoading?: boolean;
// // // }

// // // export function AttendanceForm({ record, onSubmit, onCancel, isLoading }: AttendanceFormProps) {
// // //   const isEdit = !!record;

// // //   const [values, setValues] = useState<AttendanceFormValues>({
// // //     studentId: record?.student.id ?? "",
// // //     sessionId: record?.session?.id ?? "",
// // //     status:    record?.status ?? "PRESENT",
// // //     note:      "",
// // //   });
// // //   const [errors,      setErrors]      = useState<AttendanceFormErrors>({});
// // //   const [submitError, setSubmitError] = useState<string | null>(null);

// // //   function set<K extends keyof AttendanceFormValues>(key: K, val: AttendanceFormValues[K]) {
// // //     setValues(p => ({ ...p, [key]: val }));
// // //     setErrors(p => ({ ...p, [key]: undefined }));
// // //   }

// // //   async function handleSubmit() {
// // //     const errs = validate(values);
// // //     if (Object.keys(errs).length) { setErrors(errs); return; }
// // //     setSubmitError(null);
// // //     try {
// // //       await onSubmit(values);
// // //     } catch (e: any) {
// // //       setSubmitError(e.message ?? "Failed to save.");
// // //     }
// // //   }

// // //   return (
// // //     <div className="space-y-5">

// // //       {/* Readonly info in edit mode */}
// // //       {isEdit && record && (
// // //         <div className="rounded-xl bg-muted/40 px-4 py-3 space-y-1 text-sm">
// // //           <div className="flex justify-between">
// // //             <span className="text-muted-foreground">Student</span>
// // //             <span className="font-medium">{record.student.username}</span>
// // //           </div>
// // //           <div className="flex justify-between">
// // //             <span className="text-muted-foreground">Class</span>
// // //             <span className="font-medium">{record.session?.class.name ?? "—"}</span>
// // //           </div>
// // //           <div className="flex justify-between">
// // //             <span className="text-muted-foreground">Date</span>
// // //             <span className="font-medium tabular-nums">
// // //               {new Date(record.date).toLocaleDateString([], {
// // //                 weekday: "short", month: "short", day: "numeric",
// // //               })}
// // //             </span>
// // //           </div>
// // //           <div className="flex justify-between">
// // //             <span className="text-muted-foreground">On Campus</span>
// // //             <span className={record.withinSchool ? "text-emerald-600 font-medium" : "text-destructive font-medium"}>
// // //               {record.withinSchool ? "✓ Yes" : "✗ No"}
// // //             </span>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* Student ID (create only) */}
// // //       {!isEdit && (
// // //         <div className="space-y-1.5">
// // //           <Label htmlFor="att-student">Student ID *</Label>
// // //           <Input
// // //             id="att-student"
// // //             placeholder="Student ID"
// // //             value={values.studentId}
// // //             onChange={e => set("studentId", e.target.value)}
// // //             className={errors.studentId ? "border-destructive" : ""}
// // //           />
// // //           {errors.studentId && <p className="text-xs text-destructive">{errors.studentId}</p>}
// // //         </div>
// // //       )}

// // //       {/* Session ID (create only) */}
// // //       {!isEdit && (
// // //         <div className="space-y-1.5">
// // //           <Label htmlFor="att-session">Session ID *</Label>
// // //           <Input
// // //             id="att-session"
// // //             placeholder="Session ID"
// // //             value={values.sessionId}
// // //             onChange={e => set("sessionId", e.target.value)}
// // //             className={errors.sessionId ? "border-destructive" : ""}
// // //           />
// // //           {errors.sessionId && <p className="text-xs text-destructive">{errors.sessionId}</p>}
// // //         </div>
// // //       )}

// // //       {/* Status */}
// // //       <div className="space-y-1.5">
// // //         <Label>Status *</Label>
// // //         <Select
// // //           value={values.status}
// // //           onValueChange={v => set("status", v as AttendanceStatus)}
// // //         >
// // //           <SelectTrigger className={errors.status ? "border-destructive" : ""}>
// // //             <SelectValue placeholder="Select status" />
// // //           </SelectTrigger>
// // //           <SelectContent>
// // //             {STATUS_OPTIONS.map(o => (
// // //               <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
// // //             ))}
// // //           </SelectContent>
// // //         </Select>
// // //         {errors.status && <p className="text-xs text-destructive">{errors.status}</p>}
// // //       </div>

// // //       {/* Note */}
// // //       <div className="space-y-1.5">
// // //         <Label htmlFor="att-note">Note</Label>
// // //         <Textarea
// // //           id="att-note"
// // //           placeholder="Reason for override, medical excuse…"
// // //           rows={3}
// // //           value={values.note}
// // //           onChange={e => set("note", e.target.value)}
// // //           className="resize-none"
// // //         />
// // //       </div>

// // //       {submitError && (
// // //         <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
// // //           {submitError}
// // //         </p>
// // //       )}

// // //       <div className="flex gap-3 pt-1">
// // //         <Button variant="outline" onClick={onCancel} disabled={isLoading} className="flex-1">
// // //           Cancel
// // //         </Button>
// // //         <Button onClick={handleSubmit} disabled={isLoading} className="flex-1">
// // //           {isLoading ? "Saving…" : isEdit ? "Save Changes" : "Create Record"}
// // //         </Button>
// // //       </div>
// // //     </div>
// // //   );
// // // }




// // "use client";



// // import { useState, useEffect } from "react";
// // import { Button }   from "@/core/components/ui/button";
// // import { Label }    from "@/core/components/ui/label";
// // import { Textarea } from "@/core/components/ui/textarea";
// // import {
// //   Select, SelectContent, SelectItem,
// //   SelectTrigger, SelectValue,
// // } from "@/core/components/ui/select";
// // import type {
// //   AttendanceDTO,
// //   AttendanceFormErrors,
// //   AttendanceFormValues,
// //   AttendanceStatus,
// // } from "../types/attendance.types";

// // const STATUS_OPTIONS: { value: AttendanceStatus; label: string }[] = [
// //   { value: "PRESENT", label: "Present" },
// //   { value: "LATE",    label: "Late"    },
// //   { value: "ABSENT",  label: "Absent"  },
// //   { value: "EXCUSED", label: "Excused" },
// // ];

// // interface StudentOption {
// //   id:       string;
// //   username: string;
// //   email:    string;
// // }

// // interface SessionOption {
// //   id:        string;
// //   date:      string;
// //   startTime: string;
// //   class:     { name: string };
// // }

// // function validate(v: AttendanceFormValues): AttendanceFormErrors {
// //   const e: AttendanceFormErrors = {};
// //   if (!v.studentId.trim()) e.studentId = "Student is required.";
// //   if (!v.sessionId.trim()) e.sessionId = "Session is required.";
// //   if (!v.status)           e.status    = "Status is required.";
// //   return e;
// // }

// // interface AttendanceFormProps {
// //   record?:    AttendanceDTO;
// //   onSubmit:   (values: AttendanceFormValues) => Promise<void>;
// //   onCancel:   () => void;
// //   isLoading?: boolean;
// // }

// // export function AttendanceForm({ record, onSubmit, onCancel, isLoading }: AttendanceFormProps) {
// //   const isEdit = !!record;

// //   const [values, setValues] = useState<AttendanceFormValues>({
// //     studentId: record?.student.id ?? "",
// //     sessionId: record?.session?.id ?? "",
// //     status:    record?.status ?? "PRESENT",
// //     note:      "",
// //   });
// //   const [errors,      setErrors]      = useState<AttendanceFormErrors>({});
// //   const [submitError, setSubmitError] = useState<string | null>(null);

// //   const [students,        setStudents]        = useState<StudentOption[]>([]);
// //   const [sessions,        setSessions]        = useState<SessionOption[]>([]);
// //   const [loadingStudents, setLoadingStudents] = useState(false);
// //   const [loadingSessions, setLoadingSessions] = useState(false);

// //   useEffect(() => {
// //     if (isEdit) return; // dropdowns only needed on create
// //     setLoadingStudents(true);
// //     fetch("/api/students")
// //       .then(r => r.json())
// //       .then(d => setStudents(Array.isArray(d) ? d : []))
// //       .catch(() => setStudents([]))
// //       .finally(() => setLoadingStudents(false));

// //     setLoadingSessions(true);
// //     fetch("/api/sessions")
// //       .then(r => r.json())
// //       .then(d => setSessions(Array.isArray(d) ? d : []))
// //       .catch(() => setSessions([]))
// //       .finally(() => setLoadingSessions(false));
// //   }, [isEdit]);

// //   function set<K extends keyof AttendanceFormValues>(key: K, val: AttendanceFormValues[K]) {
// //     setValues(p => ({ ...p, [key]: val }));
// //     setErrors(p => ({ ...p, [key]: undefined }));
// //   }

// //   async function handleSubmit() {
// //     const errs = validate(values);
// //     if (Object.keys(errs).length) { setErrors(errs); return; }
// //     setSubmitError(null);
// //     try {
// //       await onSubmit(values);
// //     } catch (e: any) {
// //       setSubmitError(e.message ?? "Failed to save.");
// //     }
// //   }

// //   function formatSession(s: SessionOption) {
// //     const date  = new Date(s.date).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
// //     const time  = new Date(s.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// //     return `${s.class.name} — ${date} ${time}`;
// //   }

// //   return (
// //     <div className="space-y-5">

// //       {/* Readonly info in edit mode */}
// //       {isEdit && record && (
// //         <div className="rounded-xl bg-muted/40 px-4 py-3 space-y-1 text-sm">
// //           <div className="flex justify-between">
// //             <span className="text-muted-foreground">Student</span>
// //             <span className="font-medium">{record.student.username}</span>
// //           </div>
// //           <div className="flex justify-between">
// //             <span className="text-muted-foreground">Class</span>
// //             <span className="font-medium">{record.session?.class.name ?? "—"}</span>
// //           </div>
// //           <div className="flex justify-between">
// //             <span className="text-muted-foreground">Date</span>
// //             <span className="font-medium tabular-nums">
// //               {new Date(record.date).toLocaleDateString([], {
// //                 weekday: "short", month: "short", day: "numeric",
// //               })}
// //             </span>
// //           </div>
// //           <div className="flex justify-between">
// //             <span className="text-muted-foreground">On Campus</span>
// //             <span className={record.withinSchool ? "text-emerald-600 font-medium" : "text-destructive font-medium"}>
// //               {record.withinSchool ? "✓ Yes" : "✗ No"}
// //             </span>
// //           </div>
// //         </div>
// //       )}

// //       {/* Student dropdown (create only) */}
// //       {!isEdit && (
// //         <div className="space-y-1.5">
// //           <Label>Student *</Label>
// //           <Select
// //             value={values.studentId || undefined}
// //             onValueChange={v => set("studentId", v)}
// //             disabled={loadingStudents}
// //           >
// //             <SelectTrigger className={errors.studentId ? "border-destructive" : ""}>
// //               <SelectValue placeholder={loadingStudents ? "Loading students…" : "Select student"} />
// //             </SelectTrigger>
// //             <SelectContent>
// //               {students.map(s => (
// //                 <SelectItem key={s.id} value={s.id}>
// //                   {s.username} — {s.email}
// //                 </SelectItem>
// //               ))}
// //               {!loadingStudents && students.length === 0 && (
// //                 <div className="px-3 py-2 text-sm text-muted-foreground">No students found</div>
// //               )}
// //             </SelectContent>
// //           </Select>
// //           {errors.studentId && <p className="text-xs text-destructive">{errors.studentId}</p>}
// //         </div>
// //       )}

// //       {/* Session dropdown (create only) */}
// //       {!isEdit && (
// //         <div className="space-y-1.5">
// //           <Label>Session *</Label>
// //           <Select
// //             value={values.sessionId || undefined}
// //             onValueChange={v => set("sessionId", v)}
// //             disabled={loadingSessions}
// //           >
// //             <SelectTrigger className={errors.sessionId ? "border-destructive" : ""}>
// //               <SelectValue placeholder={loadingSessions ? "Loading sessions…" : "Select session"} />
// //             </SelectTrigger>
// //             <SelectContent>
// //               {sessions.map(s => (
// //                 <SelectItem key={s.id} value={s.id}>
// //                   {formatSession(s)}
// //                 </SelectItem>
// //               ))}
// //               {!loadingSessions && sessions.length === 0 && (
// //                 <div className="px-3 py-2 text-sm text-muted-foreground">No sessions found</div>
// //               )}
// //             </SelectContent>
// //           </Select>
// //           {errors.sessionId && <p className="text-xs text-destructive">{errors.sessionId}</p>}
// //         </div>
// //       )}

// //       {/* Status */}
// //       <div className="space-y-1.5">
// //         <Label>Status *</Label>
// //         <Select
// //           value={values.status}
// //           onValueChange={v => set("status", v as AttendanceStatus)}
// //         >
// //           <SelectTrigger className={errors.status ? "border-destructive" : ""}>
// //             <SelectValue placeholder="Select status" />
// //           </SelectTrigger>
// //           <SelectContent>
// //             {STATUS_OPTIONS.map(o => (
// //               <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
// //             ))}
// //           </SelectContent>
// //         </Select>
// //         {errors.status && <p className="text-xs text-destructive">{errors.status}</p>}
// //       </div>

// //       {/* Note */}
// //       <div className="space-y-1.5">
// //         <Label htmlFor="att-note">Note</Label>
// //         <Textarea
// //           id="att-note"
// //           placeholder="Reason for override, medical excuse…"
// //           rows={3}
// //           value={values.note}
// //           onChange={e => set("note", e.target.value)}
// //           className="resize-none"
// //         />
// //       </div>

// //       {submitError && (
// //         <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
// //           {submitError}
// //         </p>
// //       )}

// //       <div className="flex gap-3 pt-1">
// //         <Button variant="outline" onClick={onCancel} disabled={isLoading} className="flex-1">
// //           Cancel
// //         </Button>
// //         <Button onClick={handleSubmit} disabled={isLoading} className="flex-1">
// //           {isLoading ? "Saving…" : isEdit ? "Save Changes" : "Create Record"}
// //         </Button>
// //       </div>
// //     </div>
// //   );
// // }







// // "use client";

// // import { useState, useEffect } from "react";
// // import { Button }   from "@/core/components/ui/button";
// // import { Label }    from "@/core/components/ui/label";
// // import { Textarea } from "@/core/components/ui/textarea";
// // import {
// //   Select, SelectContent, SelectItem,
// //   SelectTrigger, SelectValue,
// // } from "@/core/components/ui/select";
// // import type {
// //   AttendanceDTO,
// //   AttendanceFormErrors,
// //   AttendanceFormValues,
// //   AttendanceStatus,
// // } from "../types/attendance.types";

// // const STATUS_OPTIONS: { value: AttendanceStatus; label: string }[] = [
// //   { value: "PRESENT", label: "Present" },
// //   { value: "LATE",    label: "Late"    },
// //   { value: "ABSENT",  label: "Absent"  },
// //   { value: "EXCUSED", label: "Excused" },
// // ];

// // interface StudentOption {
// //   id:       string;
// //   username: string;
// //   email:    string;
// // }

// // interface SessionOption {
// //   id:        string;
// //   date:      string;
// //   startTime: string;
// //   class:     { name: string };
// // }

// // function validate(v: AttendanceFormValues): AttendanceFormErrors {
// //   const e: AttendanceFormErrors = {};
// //   if (!v.studentId.trim()) e.studentId = "Student is required.";
// //   if (!v.sessionId.trim()) e.sessionId = "Session is required.";
// //   if (!v.status)           e.status    = "Status is required.";
// //   return e;
// // }

// // interface AttendanceFormProps {
// //   record?:    AttendanceDTO;
// //   onSubmit:   (values: AttendanceFormValues) => Promise<void>;
// //   onCancel:   () => void;
// //   isLoading?: boolean;
// // }

// // export function AttendanceForm({ record, onSubmit, onCancel, isLoading }: AttendanceFormProps) {
// //   const isEdit = !!record;

// //   const [values, setValues] = useState<AttendanceFormValues>({
// //     studentId: record?.student.id ?? "",
// //     sessionId: record?.session?.id ?? "",
// //     status:    record?.status ?? "PRESENT",
// //     note:      "",
// //   });
// //   const [errors,      setErrors]      = useState<AttendanceFormErrors>({});
// //   const [submitError, setSubmitError] = useState<string | null>(null);

// //   const [students,        setStudents]        = useState<StudentOption[]>([]);
// //   const [sessions,        setSessions]        = useState<SessionOption[]>([]);
// //   const [loadingStudents, setLoadingStudents] = useState(false);
// //   const [loadingSessions, setLoadingSessions] = useState(false);

// //   useEffect(() => {
// //     if (isEdit) return; // dropdowns only needed on create

// //     // credentials: "include" sends auth cookie
// //     // unwrap { students: [] } response shape
// //     setLoadingStudents(true);
// //     fetch("/api/students", { credentials: "include" })
// //       .then(r => r.json())
// //       .then(d => setStudents(Array.isArray(d) ? d : (d.students ?? [])))
// //       .catch(() => setStudents([]))
// //       .finally(() => setLoadingStudents(false));

// //     // credentials: "include" sends auth cookie
// //     // unwrap { sessions: [] } response shape
// //     setLoadingSessions(true);
// //     fetch("/api/sessions", { credentials: "include" })
// //       .then(r => r.json())
// //       .then(d => setSessions(Array.isArray(d) ? d : (d.sessions ?? [])))
// //       .catch(() => setSessions([]))
// //       .finally(() => setLoadingSessions(false));
// //   }, [isEdit]);

// //   function set<K extends keyof AttendanceFormValues>(key: K, val: AttendanceFormValues[K]) {
// //     setValues(p => ({ ...p, [key]: val }));
// //     setErrors(p => ({ ...p, [key]: undefined }));
// //   }

// //   async function handleSubmit() {
// //     const errs = validate(values);
// //     if (Object.keys(errs).length) { setErrors(errs); return; }
// //     setSubmitError(null);
// //     try {
// //       await onSubmit(values);
// //     } catch (e: any) {
// //       setSubmitError(e.message ?? "Failed to save.");
// //     }
// //   }

// //   function formatSession(s: SessionOption) {
// //     const date = new Date(s.date).toLocaleDateString([], {
// //       weekday: "short", month: "short", day: "numeric",
// //     });
// //     const time = new Date(s.startTime).toLocaleTimeString([], {
// //       hour: "2-digit", minute: "2-digit",
// //     });
// //     return `${s.class.name} — ${date} ${time}`;
// //   }

// //   return (
// //     <div className="space-y-5">

// //       {/* Readonly info in edit mode */}
// //       {isEdit && record && (
// //         <div className="rounded-xl bg-muted/40 px-4 py-3 space-y-1 text-sm">
// //           <div className="flex justify-between">
// //             <span className="text-muted-foreground">Student</span>
// //             <span className="font-medium">{record.student.username}</span>
// //           </div>
// //           <div className="flex justify-between">
// //             <span className="text-muted-foreground">Class</span>
// //             <span className="font-medium">{record.session?.class.name ?? "—"}</span>
// //           </div>
// //           <div className="flex justify-between">
// //             <span className="text-muted-foreground">Date</span>
// //             <span className="font-medium tabular-nums">
// //               {new Date(record.date).toLocaleDateString([], {
// //                 weekday: "short", month: "short", day: "numeric",
// //               })}
// //             </span>
// //           </div>
// //           <div className="flex justify-between">
// //             <span className="text-muted-foreground">On Campus</span>
// //             <span className={record.withinSchool
// //               ? "text-emerald-600 font-medium"
// //               : "text-destructive font-medium"
// //             }>
// //               {record.withinSchool ? "✓ Yes" : "✗ No"}
// //             </span>
// //           </div>
// //         </div>
// //       )}

// //       {/* Student dropdown (create only) */}
// //       {!isEdit && (
// //         <div className="space-y-1.5">
// //           <Label>Student *</Label>
// //           <Select
// //             value={values.studentId || undefined}
// //             onValueChange={v => set("studentId", v)}
// //             disabled={loadingStudents}
// //           >
// //             <SelectTrigger className={errors.studentId ? "border-destructive" : ""}>
// //               <SelectValue placeholder={
// //                 loadingStudents ? "Loading students…" : "Select student"
// //               } />
// //             </SelectTrigger>
// //             <SelectContent>
// //               {students.map(s => (
// //                 <SelectItem key={s.id} value={s.id}>
// //                   {s.username} — {s.email}
// //                 </SelectItem>
// //               ))}
// //               {!loadingStudents && students.length === 0 && (
// //                 <div className="px-3 py-2 text-sm text-muted-foreground">
// //                   No students found
// //                 </div>
// //               )}
// //             </SelectContent>
// //           </Select>
// //           {errors.studentId && (
// //             <p className="text-xs text-destructive">{errors.studentId}</p>
// //           )}
// //         </div>
// //       )}

// //       {/* Session dropdown (create only) */}
// //       {!isEdit && (
// //         <div className="space-y-1.5">
// //           <Label>Session *</Label>
// //           <Select
// //             value={values.sessionId || undefined}
// //             onValueChange={v => set("sessionId", v)}
// //             disabled={loadingSessions}
// //           >
// //             <SelectTrigger className={errors.sessionId ? "border-destructive" : ""}>
// //               <SelectValue placeholder={
// //                 loadingSessions ? "Loading sessions…" : "Select session"
// //               } />
// //             </SelectTrigger>
// //             <SelectContent>
// //               {sessions.map(s => (
// //                 <SelectItem key={s.id} value={s.id}>
// //                   {formatSession(s)}
// //                 </SelectItem>
// //               ))}
// //               {!loadingSessions && sessions.length === 0 && (
// //                 <div className="px-3 py-2 text-sm text-muted-foreground">
// //                   No sessions found
// //                 </div>
// //               )}
// //             </SelectContent>
// //           </Select>
// //           {errors.sessionId && (
// //             <p className="text-xs text-destructive">{errors.sessionId}</p>
// //           )}
// //         </div>
// //       )}

// //       {/* Status */}
// //       <div className="space-y-1.5">
// //         <Label>Status *</Label>
// //         <Select
// //           value={values.status}
// //           onValueChange={v => set("status", v as AttendanceStatus)}
// //         >
// //           <SelectTrigger className={errors.status ? "border-destructive" : ""}>
// //             <SelectValue placeholder="Select status" />
// //           </SelectTrigger>
// //           <SelectContent>
// //             {STATUS_OPTIONS.map(o => (
// //               <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
// //             ))}
// //           </SelectContent>
// //         </Select>
// //         {errors.status && (
// //           <p className="text-xs text-destructive">{errors.status}</p>
// //         )}
// //       </div>

// //       {/* Note */}
// //       <div className="space-y-1.5">
// //         <Label htmlFor="att-note">Note</Label>
// //         <Textarea
// //           id="att-note"
// //           placeholder="Reason for override, medical excuse…"
// //           rows={3}
// //           value={values.note}
// //           onChange={e => set("note", e.target.value)}
// //           className="resize-none"
// //         />
// //       </div>

// //       {submitError && (
// //         <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
// //           {submitError}
// //         </p>
// //       )}

// //       <div className="flex gap-3 pt-1">
// //         <Button
// //           variant="outline"
// //           onClick={onCancel}
// //           disabled={isLoading}
// //           className="flex-1"
// //         >
// //           Cancel
// //         </Button>
// //         <Button
// //           onClick={handleSubmit}
// //           disabled={isLoading}
// //           className="flex-1"
// //         >
// //           {isLoading ? "Saving…" : isEdit ? "Save Changes" : "Create Record"}
// //         </Button>
// //       </div>
// //     </div>
// //   );
// // }





// "use client";

// import { useState, useEffect } from "react";
// import { Button }   from "@/core/components/ui/button";
// import { Loader2 }  from "lucide-react";
// import type { AttendanceDTO, AttendanceFormValues, AttendanceStatus } from "../types/attendance.types";

// interface AttendanceFormProps {
//   record?:    AttendanceDTO;
//   onSubmit:   (values: AttendanceFormValues) => Promise<void>;
//   onCancel:   () => void;
//   isLoading?: boolean;
// }

// const STATUSES: AttendanceStatus[] = ["Present", "Absent", "Late"];

// export function AttendanceForm({
//   record,
//   onSubmit,
//   onCancel,
//   isLoading = false,
// }: AttendanceFormProps) {
//   const [values, setValues] = useState<AttendanceFormValues>({
//     studentId: record?.student?.id ?? "",
//     sessionId: record?.session?.id ?? "",
//     status:    (record?.status as AttendanceStatus) ?? "Present",
//     date:      record?.date?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
//   });

//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (record) {
//       setValues({
//         studentId: record.student?.id ?? "",
//         sessionId: record.session?.id ?? "",
//         status:    record.status as AttendanceStatus,
//         date:      record.date?.slice(0, 10) ?? "",
//       });
//     }
//   }, [record]);

//   async function handleSubmit() {
//     setError(null);
//     if (!values.studentId) return setError("Student ID is required.");
//     if (!values.sessionId) return setError("Session ID is required.");
//     try {
//       await onSubmit(values);
//     } catch (e: any) {
//       setError(e?.message ?? "Something went wrong.");
//     }
//   }

//   return (
//     <div className="space-y-4">

//       {/* Student ID */}
//       <div className="space-y-1">
//         <label className="text-sm font-medium text-gray-700">Student ID</label>
//         <input
//           type="text"
//           value={values.studentId}
//           onChange={e => setValues(v => ({ ...v, studentId: e.target.value }))}
//           placeholder="Enter student ID"
//           className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>

//       {/* Session ID */}
//       <div className="space-y-1">
//         <label className="text-sm font-medium text-gray-700">Session ID</label>
//         <input
//           type="text"
//           value={values.sessionId}
//           onChange={e => setValues(v => ({ ...v, sessionId: e.target.value }))}
//           placeholder="Enter session ID"
//           className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>

//       {/* Date */}
//       <div className="space-y-1">
//         <label className="text-sm font-medium text-gray-700">Date</label>
//         <input
//           type="date"
//           value={values.date}
//           onChange={e => setValues(v => ({ ...v, date: e.target.value }))}
//           className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>

//       {/* Status */}
//       <div className="space-y-1">
//         <label className="text-sm font-medium text-gray-700">Status</label>
//         <div className="flex gap-2">
//           {STATUSES.map(s => (
//             <button
//               key={s}
//               onClick={() => setValues(v => ({ ...v, status: s }))}
//               className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
//                 values.status === s
//                   ? s === "Present" ? "bg-green-600 text-white border-green-600"
//                   : s === "Absent"  ? "bg-red-600 text-white border-red-600"
//                   :                   "bg-yellow-500 text-white border-yellow-500"
//                   : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
//               }`}
//             >
//               {s}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Error */}
//       {error && (
//         <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
//           {error}
//         </p>
//       )}

//       {/* Actions */}
//       <div className="flex gap-2 pt-1">
//         <Button variant="outline" onClick={onCancel} className="flex-1" disabled={isLoading}>
//           Cancel
//         </Button>
//         <Button onClick={handleSubmit} className="flex-1" disabled={isLoading}>
//           {isLoading
//             ? <><Loader2 size={14} className="mr-2 animate-spin" /> Saving…</>
//             : record ? "Update" : "Create"
//           }
//         </Button>
//       </div>
//     </div>
//   );
// }



"use client";

import { useState, useEffect } from "react";
import { Button }  from "@/core/components/ui/button";
import { Loader2, Search } from "lucide-react";
import type { AttendanceDTO, AttendanceFormValues, AttendanceStatus } from "../types/attendance.types";

interface Student {
  id:       string;
  username: string;
  email:    string;
}

interface Session {
  id:        string;
  date:      string;
  startTime: string;
  isOpen:    boolean;
  class:     { id: string; name: string };
  school:    { id: string; name: string };
}

interface AttendanceFormProps {
  record?:    AttendanceDTO;
  onSubmit:   (values: AttendanceFormValues) => Promise<void>;
  onCancel:   () => void;
  isLoading?: boolean;
}

const STATUSES: AttendanceStatus[] = ["Present", "Absent", "Late"];

export function AttendanceForm({
  record,
  onSubmit,
  onCancel,
  isLoading = false,
}: AttendanceFormProps) {
  const [students,       setStudents]       = useState<Student[]>([]);
  const [sessions,       setSessions]       = useState<Session[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [studentSearch,  setStudentSearch]  = useState("");
  const [error,          setError]          = useState<string | null>(null);

  const [values, setValues] = useState<AttendanceFormValues>({
    studentId: record?.student?.id ?? "",
    sessionId: record?.session?.id ?? "",
    status:    (record?.status as AttendanceStatus) ?? "Present",
    date:      record?.date?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    async function load() {
      setLoadingOptions(true);
      try {
        const [sRes, sesRes] = await Promise.all([
          fetch("/api/students"),
          fetch("/api/sessions"),
        ]);
        const studentsData = await sRes.json();
        const sessionsData = await sesRes.json();
        setStudents(Array.isArray(studentsData) ? studentsData : []);
        setSessions(sessionsData.sessions ?? []);
      } catch {
        setError("Failed to load students or sessions.");
      } finally {
        setLoadingOptions(false);
      }
    }
    load();
  }, []);

  function handleSessionChange(sessionId: string) {
    const selected = sessions.find(s => s.id === sessionId);
    setValues(v => ({
      ...v,
      sessionId,
      date: selected ? selected.date.slice(0, 10) : v.date,
    }));
  }

  const filteredStudents = students.filter(s =>
    s.username.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.email.toLowerCase().includes(studentSearch.toLowerCase())
  );

  async function handleSubmit() {
    setError(null);
    if (!values.studentId) return setError("Please select a student.");
    if (!values.sessionId) return setError("Please select a session.");
    try {
      await onSubmit(values);
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong.");
    }
  }

  if (loadingOptions) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 size={20} className="animate-spin text-gray-400" />
        <span className="ml-2 text-sm text-gray-400">Loading options…</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* Student selector */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Student</label>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search student name or email…"
            value={studentSearch}
            onChange={e => setStudentSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="border border-gray-200 rounded-lg max-h-36 overflow-y-auto">
          {filteredStudents.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-3">No students found</p>
          ) : (
            filteredStudents.map(s => (
              <button
                key={s.id}
                onClick={() => setValues(v => ({ ...v, studentId: s.id }))}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  values.studentId === s.id ? "bg-blue-50 text-blue-700 font-medium" : ""
                }`}
              >
                <span className="font-medium">{s.username}</span>
                <span className="text-xs text-gray-400 ml-2">{s.email}</span>
              </button>
            ))
          )}
        </div>
        {values.studentId && (
          <p className="text-xs text-blue-600">
            ✓ Selected: {students.find(s => s.id === values.studentId)?.username}
          </p>
        )}
      </div>

      {/* Session selector */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Session</label>
        <select
          value={values.sessionId}
          onChange={e => handleSessionChange(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">— Select a session —</option>
          {sessions.map(s => (
            <option key={s.id} value={s.id}>
              {s.class?.name ?? "Unknown class"} · {new Date(s.date).toLocaleDateString()} · {s.isOpen ? "🟢 Open" : "🔴 Closed"}
            </option>
          ))}
        </select>
      </div>

      {/* Date */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          value={values.date}
          onChange={e => setValues(v => ({ ...v, date: e.target.value }))}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Status */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Status</label>
        <div className="flex gap-2">
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setValues(v => ({ ...v, status: s }))}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                values.status === s
                  ? s === "Present" ? "bg-green-600 text-white border-green-600"
                  : s === "Absent"  ? "bg-red-600 text-white border-red-600"
                  :                   "bg-yellow-500 text-white border-yellow-500"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <Button variant="outline" onClick={onCancel} className="flex-1" disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} className="flex-1" disabled={isLoading}>
          {isLoading
            ? <><Loader2 size={14} className="mr-2 animate-spin" /> Saving…</>
            : record ? "Update" : "Create"
          }
        </Button>
      </div>
    </div>
  );
}