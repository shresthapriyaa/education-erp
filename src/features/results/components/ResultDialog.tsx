// "use client";

// import {
//   Dialog, DialogContent, DialogHeader, DialogTitle,
// } from "@/core/components/ui/dialog";
// import { ResultForm, SubmitMode } from "./ResultForm";
// import { Result } from "../types/result.types";

// type ResultPayload = Partial<Result> & { studentId?: string; subjectId?: string };

// interface ResultDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   initialValues?: Partial<Result>;
//   onSubmit: (values: ResultPayload, mode: SubmitMode) => void;
//   loading?: boolean;
//   isEdit?: boolean;
// }

// export function ResultDialog({
//   open, onOpenChange, initialValues, onSubmit, loading = false, isEdit = false,
// }: ResultDialogProps) {
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-lg">
//         <DialogHeader>
//           <DialogTitle>{isEdit ? "Edit Result" : "Add Result"}</DialogTitle>
//         </DialogHeader>
//         <ResultForm
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
import { ResultForm, SubmitMode } from "./ResultForm";
import { Result } from "../types/result.types";

type ResultPayload = Partial<Result> & { studentId?: string; subjectId?: string };

interface ResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<Result>;
  onSubmit: (values: ResultPayload, mode: SubmitMode) => void;
  loading?: boolean;
  isEdit?: boolean;
}

export function ResultDialog({
  open, onOpenChange, initialValues, onSubmit, loading = false, isEdit = false,
}: ResultDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Result" : "Add Result"}</DialogTitle>
        </DialogHeader>
        <ResultForm
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