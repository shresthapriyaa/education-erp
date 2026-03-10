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


// // type StudentPayload = Partial<Student> & { password?: string };

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
// //         />
// //       </DialogContent>
// //     </Dialog>
// //   );
// // }






// "use client";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/core/components/ui/dialog";

// import { StudentForm, SubmitMode } from "./StudentForm";
// import { Student } from "../types/student.types";
// import { useState, useEffect } from "react";

// type StudentPayload = Partial<Student> & { password?: string };

// interface ParentOption {
//   id: string;
//   username: string;
//   email: string;
// }

// interface StudentDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   initialValues?: Partial<Student>;
//   onSubmit: (values: StudentPayload, mode: SubmitMode) => void;
//   loading?: boolean;
//   isEdit?: boolean;
// }

// export function StudentDialog({
//   open,
//   onOpenChange,
//   initialValues,
//   onSubmit,
//   loading = false,
//   isEdit = false,
// }: StudentDialogProps) {
//   const [parents, setParents] = useState<ParentOption[]>([]);

//   // Fetch once when dialog opens
//   useEffect(() => {
//     if (!open) return;
//     fetch("/api/parents")
//       .then((r) => r.json())
//       .then((data) => setParents(Array.isArray(data) ? data : []))
//       .catch(() => setParents([]));
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
//         />
//       </DialogContent>
//     </Dialog>
//   );
// }




"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog";

import { StudentForm, SubmitMode } from "./StudentForm";
import { Student } from "../types/student.types";
import { useState, useEffect } from "react";

type StudentPayload = Partial<Student> & { password?: string };

interface ParentOption {
  id: string;
  username: string;
  email: string;
}

interface StudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<Student>;
  onSubmit: (values: StudentPayload, mode: SubmitMode) => void;
  loading?: boolean;
  isEdit?: boolean;
}

export function StudentDialog({
  open,
  onOpenChange,
  initialValues,
  onSubmit,
  loading = false,
  isEdit = false,
}: StudentDialogProps) {
  const [parents, setParents] = useState<ParentOption[]>([]);

  // Fetch once when dialog opens
  useEffect(() => {
    if (!open) return;
    fetch("/api/parents")
      .then((r) => r.json())
      .then((data) => setParents(Array.isArray(data) ? data : []))
      .catch(() => setParents([]));
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Student" : "Add New Student"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the student's details below."
              : "Fill in the details below. Click submit when you're done."}
          </DialogDescription>
        </DialogHeader>
        <StudentForm
          initialValues={initialValues}
          onSubmit={onSubmit}
          loading={loading}
          isEdit={isEdit}
          onCancel={() => onOpenChange(false)}
          parents={parents}
        />
      </DialogContent>
    </Dialog>
  );
}