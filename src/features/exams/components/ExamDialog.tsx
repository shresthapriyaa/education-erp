// "use client";

// import {
//   Dialog, DialogContent, DialogHeader, DialogTitle,
// } from "@/core/components/ui/dialog";
// import { ExamForm, SubmitMode } from "./ExamForm";
// import { Exam } from "../types/exam.types";

// type ExamPayload = Partial<Exam> & { subjectId?: string };

// interface ExamDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   initialValues?: Partial<Exam>;
//   onSubmit: (values: ExamPayload, mode: SubmitMode) => void;
//   loading?: boolean;
//   isEdit?: boolean;
// }

// export function ExamDialog({
//   open, onOpenChange, initialValues, onSubmit, loading = false, isEdit = false,
// }: ExamDialogProps) {
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-lg">
//         <DialogHeader>
//           <DialogTitle>{isEdit ? "Edit Exam" : "Add Exam"}</DialogTitle>
//         </DialogHeader>
//         <ExamForm
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
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/core/components/ui/dialog";
import { ExamForm, SubmitMode } from "./ExamForm";
import { Exam } from "../types/exam.types";


type ExamPayload = Partial<Exam> & { subjectId?: string; classId?: string };

interface ExamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<Exam>;
  onSubmit: (values: ExamPayload, mode: SubmitMode) => void;
  loading?: boolean;
  isEdit?: boolean;
}

export function ExamDialog({
  open, onOpenChange, initialValues, onSubmit, loading = false, isEdit = false,
}: ExamDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Exam" : "Add Exam"}</DialogTitle>
        </DialogHeader>
        <ExamForm
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