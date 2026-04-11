// "use client";

// import {
//   Dialog, DialogContent, DialogHeader, DialogTitle,
// } from "@/core/components/ui/dialog";
// import { TeacherForm, SubmitMode } from "./TeacherForm";
// import { Teacher } from "../types/teacher.types";

// type TeacherPayload = Partial<Teacher>;

// interface TeacherDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   initialValues?: Partial<Teacher>;
//   onSubmit: (values: TeacherPayload, mode: SubmitMode) => void;
//   loading?: boolean;
//   isEdit?: boolean;
// }

// export function TeacherDialog({
//   open, onOpenChange, initialValues, onSubmit, loading = false, isEdit = false,
// }: TeacherDialogProps) {
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>{isEdit ? "Edit Teacher" : "Add Teacher"}</DialogTitle>
//         </DialogHeader>
//         <TeacherForm
//           initialValues={initialValues}
//           onSubmit={onSubmit}
//           loading={loading}
//           isEdit={isEdit}
//           onCancel={() => onOpenChange(false)}
//         />
//       </DialogContent>
//     </Dialog>
//   );
// }



"use client";

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/core/components/ui/dialog";
import { TeacherForm, SubmitMode } from "./TeacherForm";
import { Teacher } from "../types/teacher.types";

type TeacherPayload = Partial<Teacher>;

interface TeacherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<Teacher>;
  onSubmit: (values: TeacherPayload, mode: SubmitMode) => void;
  loading?: boolean;
  isEdit?: boolean;
}

export function TeacherDialog({
  open, onOpenChange, initialValues, onSubmit, loading = false, isEdit = false,
}: TeacherDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Teacher" : "Add Teacher"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the teacher's details below." : "Fill in the details to add a new teacher."}
          </DialogDescription>
        </DialogHeader>
        <TeacherForm
          initialValues={initialValues}
          onSubmit={onSubmit}
          loading={loading}
          isEdit={isEdit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}