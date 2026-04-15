// // "use client";

// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogDescription,
// //   DialogHeader,
// //   DialogTitle,
// // } from "@/core/components/ui/dialog";

// // import { StudentForm, SubmitMode } from "./StudentForm";
// // import { Student } from "../types/student.types";
// // import { useState, useEffect } from "react";

// // type StudentPayload = Partial<Student> & { password?: string };

// // interface ParentOption {
// //   id: string;
// //   username: string;
// //   email: string;
// // }

// // interface StudentDialogProps {
// //   open: boolean;
// //   onOpenChange: (open: boolean) => void;
// //   initialValues?: Partial<Student>;
// //   onSubmit: (values: StudentPayload, mode: SubmitMode) => void;
// //   loading?: boolean;
// //   isEdit?: boolean;
// // }

// // export function StudentDialog({
// //   open,
// //   onOpenChange,
// //   initialValues,
// //   onSubmit,
// //   loading = false,
// //   isEdit = false,
// // }: StudentDialogProps) {
// //   const [parents, setParents] = useState<ParentOption[]>([]);

// //   // Fetch once when dialog opens
// //   useEffect(() => {
// //     if (!open) return;
// //     fetch("/api/parents")
// //       .then((r) => r.json())
// //       .then((data) => setParents(Array.isArray(data) ? data : []))
// //       .catch(() => setParents([]));
// //   }, [open]);

// //   return (
// //     <Dialog open={open} onOpenChange={onOpenChange}>
// //       <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
// //         <DialogHeader>
// //           <DialogTitle>{isEdit ? "Edit Student" : "Add New Student"}</DialogTitle>
// //           <DialogDescription>
// //             {isEdit
// //               ? "Update the student's details below."
// //               : "Fill in the details below. Click submit when you're done."}
// //           </DialogDescription>
// //         </DialogHeader>
// //         <StudentForm
// //           initialValues={initialValues}
// //           onSubmit={onSubmit}
// //           loading={loading}
// //           isEdit={isEdit}
// //           onCancel={() => onOpenChange(false)}
// //           parents={parents}
// //         />
// //       </DialogContent>
// //     </Dialog>
// //   );
// // }









// "use client";

// import {
//   Dialog, DialogContent, DialogDescription,
//   DialogHeader, DialogTitle,
// } from "@/core/components/ui/dialog";

// import { StudentForm, SubmitMode } from "./StudentForm";
// import { Student } from "../types/student.types";
// import { useState, useEffect } from "react";

// type StudentPayload = Partial<Student> & { password?: string };

// interface ParentOption { id: string; username: string; email: string; }
// interface ClassOption  { id: string; name: string; }

// interface StudentDialogProps {
//   open:         boolean;
//   onOpenChange: (open: boolean) => void;
//   initialValues?: Partial<Student>;
//   onSubmit:     (values: StudentPayload, mode: SubmitMode) => void;
//   loading?:     boolean;
//   isEdit?:      boolean;
// }

// export function StudentDialog({
//   open, onOpenChange, initialValues,
//   onSubmit, loading = false, isEdit = false,
// }: StudentDialogProps) {
//   const [parents, setParents] = useState<ParentOption[]>([]);
//   const [classes, setClasses] = useState<ClassOption[]>([]);

//   useEffect(() => {
//     if (!open) return;
//     fetch("/api/parents")
//       .then((r) => r.json())
//       .then((data) => setParents(Array.isArray(data) ? data : []))
//       .catch(() => setParents([]));

//     fetch("/api/classes")
//       .then((r) => r.json())
//       .then((data) => setClasses(Array.isArray(data) ? data : []))
//       .catch(() => setClasses([]));
//   }, [open]);

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>{isEdit ? "Edit Student" : "Add New Student"}</DialogTitle>
//           <DialogDescription>
//             {isEdit
//               ? "Update the student's details below."
//               : "Fill in the details below. Click submit when you're done."}
//           </DialogDescription>
//         </DialogHeader>
//         <StudentForm
//           initialValues={initialValues}
//           onSubmit={onSubmit}
//           loading={loading}
//           isEdit={isEdit}
//           onCancel={() => onOpenChange(false)}
//           parents={parents}
//           classes={classes}
//         />
//       </DialogContent>
//     </Dialog>
//   );
// }










"use client";

import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle,
} from "@/core/components/ui/dialog";
import { ScrollArea } from "@/core/components/ui/scroll-area";
import { StudentForm, SubmitMode } from "./StudentForm";
import { Student } from "../types/student.types";
import { useState, useEffect } from "react";

type StudentPayload = Partial<Student> & { password?: string };

interface ParentOption { id: string; username: string; email: string; }
interface ClassOption  { id: string; name: string; }

interface StudentDialogProps {
  open:         boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<Student>;
  onSubmit:     (values: StudentPayload, mode: SubmitMode) => void;
  loading?:     boolean;
  isEdit?:      boolean;
}

export function StudentDialog({
  open, onOpenChange, initialValues,
  onSubmit, loading = false, isEdit = false,
}: StudentDialogProps) {
  const [parents, setParents] = useState<ParentOption[]>([]);
  const [classes, setClasses] = useState<ClassOption[]>([]);

  useEffect(() => {
    if (!open) return;
    fetch("/api/parents")
      .then((r) => r.json())
      .then((data) => setParents(Array.isArray(data) ? data : []))
      .catch(() => setParents([]));

    fetch("/api/classes")
      .then((r) => r.json())
      .then((data) => setClasses(Array.isArray(data) ? data : []))
      .catch(() => setClasses([]));
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 shrink-0 border-b">
          <DialogTitle>{isEdit ? "Edit Student" : "Add New Student"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the student's details below."
              : "Fill in the details below. Click submit when you're done."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full px-6 py-4">
            <StudentForm
              initialValues={initialValues}
              onSubmit={onSubmit}
              loading={loading}
              isEdit={isEdit}
              onCancel={() => onOpenChange(false)}
              parents={parents}
              classes={classes}
            />
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
