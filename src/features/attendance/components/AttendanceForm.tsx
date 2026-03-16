// "use client";

// /**
//  * src/features/attendance/components/AttendanceForm.tsx
//  * Admin: manually create or edit an attendance record.
//  */

// import { useState } from "react";
// import { Button }   from "@/core/components/ui/button";
// import { Label }    from "@/core/components/ui/label";
// import { Input }    from "@/core/components/ui/input";
// import { Textarea } from "@/core/components/ui/textarea";
// import {
//   Select, SelectContent, SelectItem,
//   SelectTrigger, SelectValue,
// } from "@/core/components/ui/select";
// import type {
//   AttendanceDTO,
//   AttendanceFormErrors,
//   AttendanceFormValues,
//   AttendanceStatus,
// } from "../types/attendance.types";

// const STATUS_OPTIONS: { value: AttendanceStatus; label: string }[] = [
//   { value: "PRESENT", label: "Present" },
//   { value: "LATE",    label: "Late"    },
//   { value: "ABSENT",  label: "Absent"  },
//   { value: "EXCUSED", label: "Excused" },
// ];

// function validate(v: AttendanceFormValues): AttendanceFormErrors {
//   const e: AttendanceFormErrors = {};
//   if (!v.studentId.trim()) e.studentId = "Student is required.";
//   if (!v.sessionId.trim()) e.sessionId = "Session is required.";
//   if (!v.status)           e.status    = "Status is required.";
//   return e;
// }

// interface AttendanceFormProps {
//   record?:    AttendanceDTO;
//   onSubmit:   (values: AttendanceFormValues) => Promise<void>;
//   onCancel:   () => void;
//   isLoading?: boolean;
// }

// export function AttendanceForm({ record, onSubmit, onCancel, isLoading }: AttendanceFormProps) {
//   const isEdit = !!record;

//   const [values, setValues] = useState<AttendanceFormValues>({
//     studentId: record?.student.id ?? "",
//     sessionId: record?.session?.id ?? "",
//     status:    record?.status ?? "PRESENT",
//     note:      "",
//   });
//   const [errors,      setErrors]      = useState<AttendanceFormErrors>({});
//   const [submitError, setSubmitError] = useState<string | null>(null);

//   function set<K extends keyof AttendanceFormValues>(key: K, val: AttendanceFormValues[K]) {
//     setValues(p => ({ ...p, [key]: val }));
//     setErrors(p => ({ ...p, [key]: undefined }));
//   }

//   async function handleSubmit() {
//     const errs = validate(values);
//     if (Object.keys(errs).length) { setErrors(errs); return; }
//     setSubmitError(null);
//     try {
//       await onSubmit(values);
//     } catch (e: any) {
//       setSubmitError(e.message ?? "Failed to save.");
//     }
//   }

//   return (
//     <div className="space-y-5">

//       {/* Readonly info in edit mode */}
//       {isEdit && record && (
//         <div className="rounded-xl bg-muted/40 px-4 py-3 space-y-1 text-sm">
//           <div className="flex justify-between">
//             <span className="text-muted-foreground">Student</span>
//             <span className="font-medium">{record.student.username}</span>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-muted-foreground">Class</span>
//             <span className="font-medium">{record.session?.class.name ?? "—"}</span>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-muted-foreground">Date</span>
//             <span className="font-medium tabular-nums">
//               {new Date(record.date).toLocaleDateString([], {
//                 weekday: "short", month: "short", day: "numeric",
//               })}
//             </span>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-muted-foreground">On Campus</span>
//             <span className={record.withinSchool ? "text-emerald-600 font-medium" : "text-destructive font-medium"}>
//               {record.withinSchool ? "✓ Yes" : "✗ No"}
//             </span>
//           </div>
//         </div>
//       )}

//       {/* Student ID (create only) */}
//       {!isEdit && (
//         <div className="space-y-1.5">
//           <Label htmlFor="att-student">Student ID *</Label>
//           <Input
//             id="att-student"
//             placeholder="Student ID"
//             value={values.studentId}
//             onChange={e => set("studentId", e.target.value)}
//             className={errors.studentId ? "border-destructive" : ""}
//           />
//           {errors.studentId && <p className="text-xs text-destructive">{errors.studentId}</p>}
//         </div>
//       )}

//       {/* Session ID (create only) */}
//       {!isEdit && (
//         <div className="space-y-1.5">
//           <Label htmlFor="att-session">Session ID *</Label>
//           <Input
//             id="att-session"
//             placeholder="Session ID"
//             value={values.sessionId}
//             onChange={e => set("sessionId", e.target.value)}
//             className={errors.sessionId ? "border-destructive" : ""}
//           />
//           {errors.sessionId && <p className="text-xs text-destructive">{errors.sessionId}</p>}
//         </div>
//       )}

//       {/* Status */}
//       <div className="space-y-1.5">
//         <Label>Status *</Label>
//         <Select
//           value={values.status}
//           onValueChange={v => set("status", v as AttendanceStatus)}
//         >
//           <SelectTrigger className={errors.status ? "border-destructive" : ""}>
//             <SelectValue placeholder="Select status" />
//           </SelectTrigger>
//           <SelectContent>
//             {STATUS_OPTIONS.map(o => (
//               <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//         {errors.status && <p className="text-xs text-destructive">{errors.status}</p>}
//       </div>

//       {/* Note */}
//       <div className="space-y-1.5">
//         <Label htmlFor="att-note">Note</Label>
//         <Textarea
//           id="att-note"
//           placeholder="Reason for override, medical excuse…"
//           rows={3}
//           value={values.note}
//           onChange={e => set("note", e.target.value)}
//           className="resize-none"
//         />
//       </div>

//       {submitError && (
//         <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
//           {submitError}
//         </p>
//       )}

//       <div className="flex gap-3 pt-1">
//         <Button variant="outline" onClick={onCancel} disabled={isLoading} className="flex-1">
//           Cancel
//         </Button>
//         <Button onClick={handleSubmit} disabled={isLoading} className="flex-1">
//           {isLoading ? "Saving…" : isEdit ? "Save Changes" : "Create Record"}
//         </Button>
//       </div>
//     </div>
//   );
// }




"use client";



import { useState, useEffect } from "react";
import { Button }   from "@/core/components/ui/button";
import { Label }    from "@/core/components/ui/label";
import { Textarea } from "@/core/components/ui/textarea";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/core/components/ui/select";
import type {
  AttendanceDTO,
  AttendanceFormErrors,
  AttendanceFormValues,
  AttendanceStatus,
} from "../types/attendance.types";

const STATUS_OPTIONS: { value: AttendanceStatus; label: string }[] = [
  { value: "PRESENT", label: "Present" },
  { value: "LATE",    label: "Late"    },
  { value: "ABSENT",  label: "Absent"  },
  { value: "EXCUSED", label: "Excused" },
];

interface StudentOption {
  id:       string;
  username: string;
  email:    string;
}

interface SessionOption {
  id:        string;
  date:      string;
  startTime: string;
  class:     { name: string };
}

function validate(v: AttendanceFormValues): AttendanceFormErrors {
  const e: AttendanceFormErrors = {};
  if (!v.studentId.trim()) e.studentId = "Student is required.";
  if (!v.sessionId.trim()) e.sessionId = "Session is required.";
  if (!v.status)           e.status    = "Status is required.";
  return e;
}

interface AttendanceFormProps {
  record?:    AttendanceDTO;
  onSubmit:   (values: AttendanceFormValues) => Promise<void>;
  onCancel:   () => void;
  isLoading?: boolean;
}

export function AttendanceForm({ record, onSubmit, onCancel, isLoading }: AttendanceFormProps) {
  const isEdit = !!record;

  const [values, setValues] = useState<AttendanceFormValues>({
    studentId: record?.student.id ?? "",
    sessionId: record?.session?.id ?? "",
    status:    record?.status ?? "PRESENT",
    note:      "",
  });
  const [errors,      setErrors]      = useState<AttendanceFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [students,        setStudents]        = useState<StudentOption[]>([]);
  const [sessions,        setSessions]        = useState<SessionOption[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(false);

  useEffect(() => {
    if (isEdit) return; // dropdowns only needed on create
    setLoadingStudents(true);
    fetch("/api/students")
      .then(r => r.json())
      .then(d => setStudents(Array.isArray(d) ? d : []))
      .catch(() => setStudents([]))
      .finally(() => setLoadingStudents(false));

    setLoadingSessions(true);
    fetch("/api/sessions")
      .then(r => r.json())
      .then(d => setSessions(Array.isArray(d) ? d : []))
      .catch(() => setSessions([]))
      .finally(() => setLoadingSessions(false));
  }, [isEdit]);

  function set<K extends keyof AttendanceFormValues>(key: K, val: AttendanceFormValues[K]) {
    setValues(p => ({ ...p, [key]: val }));
    setErrors(p => ({ ...p, [key]: undefined }));
  }

  async function handleSubmit() {
    const errs = validate(values);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitError(null);
    try {
      await onSubmit(values);
    } catch (e: any) {
      setSubmitError(e.message ?? "Failed to save.");
    }
  }

  function formatSession(s: SessionOption) {
    const date  = new Date(s.date).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
    const time  = new Date(s.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return `${s.class.name} — ${date} ${time}`;
  }

  return (
    <div className="space-y-5">

      {/* Readonly info in edit mode */}
      {isEdit && record && (
        <div className="rounded-xl bg-muted/40 px-4 py-3 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Student</span>
            <span className="font-medium">{record.student.username}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Class</span>
            <span className="font-medium">{record.session?.class.name ?? "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date</span>
            <span className="font-medium tabular-nums">
              {new Date(record.date).toLocaleDateString([], {
                weekday: "short", month: "short", day: "numeric",
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">On Campus</span>
            <span className={record.withinSchool ? "text-emerald-600 font-medium" : "text-destructive font-medium"}>
              {record.withinSchool ? "✓ Yes" : "✗ No"}
            </span>
          </div>
        </div>
      )}

      {/* Student dropdown (create only) */}
      {!isEdit && (
        <div className="space-y-1.5">
          <Label>Student *</Label>
          <Select
            value={values.studentId || undefined}
            onValueChange={v => set("studentId", v)}
            disabled={loadingStudents}
          >
            <SelectTrigger className={errors.studentId ? "border-destructive" : ""}>
              <SelectValue placeholder={loadingStudents ? "Loading students…" : "Select student"} />
            </SelectTrigger>
            <SelectContent>
              {students.map(s => (
                <SelectItem key={s.id} value={s.id}>
                  {s.username} — {s.email}
                </SelectItem>
              ))}
              {!loadingStudents && students.length === 0 && (
                <div className="px-3 py-2 text-sm text-muted-foreground">No students found</div>
              )}
            </SelectContent>
          </Select>
          {errors.studentId && <p className="text-xs text-destructive">{errors.studentId}</p>}
        </div>
      )}

      {/* Session dropdown (create only) */}
      {!isEdit && (
        <div className="space-y-1.5">
          <Label>Session *</Label>
          <Select
            value={values.sessionId || undefined}
            onValueChange={v => set("sessionId", v)}
            disabled={loadingSessions}
          >
            <SelectTrigger className={errors.sessionId ? "border-destructive" : ""}>
              <SelectValue placeholder={loadingSessions ? "Loading sessions…" : "Select session"} />
            </SelectTrigger>
            <SelectContent>
              {sessions.map(s => (
                <SelectItem key={s.id} value={s.id}>
                  {formatSession(s)}
                </SelectItem>
              ))}
              {!loadingSessions && sessions.length === 0 && (
                <div className="px-3 py-2 text-sm text-muted-foreground">No sessions found</div>
              )}
            </SelectContent>
          </Select>
          {errors.sessionId && <p className="text-xs text-destructive">{errors.sessionId}</p>}
        </div>
      )}

      {/* Status */}
      <div className="space-y-1.5">
        <Label>Status *</Label>
        <Select
          value={values.status}
          onValueChange={v => set("status", v as AttendanceStatus)}
        >
          <SelectTrigger className={errors.status ? "border-destructive" : ""}>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map(o => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.status && <p className="text-xs text-destructive">{errors.status}</p>}
      </div>

      {/* Note */}
      <div className="space-y-1.5">
        <Label htmlFor="att-note">Note</Label>
        <Textarea
          id="att-note"
          placeholder="Reason for override, medical excuse…"
          rows={3}
          value={values.note}
          onChange={e => set("note", e.target.value)}
          className="resize-none"
        />
      </div>

      {submitError && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
          {submitError}
        </p>
      )}

      <div className="flex gap-3 pt-1">
        <Button variant="outline" onClick={onCancel} disabled={isLoading} className="flex-1">
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading} className="flex-1">
          {isLoading ? "Saving…" : isEdit ? "Save Changes" : "Create Record"}
        </Button>
      </div>
    </div>
  );
}