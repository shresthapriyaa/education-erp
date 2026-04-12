"use client";

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/core/components/ui/dialog";
import { GradeForm, GradePayload, SubmitMode } from "./GradeForm";
import { Grade } from "../types/grade.types";

interface GradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<Grade>;
  onSubmit: (values: GradePayload, mode: SubmitMode) => void;
  loading?: boolean;
  isEdit?: boolean;
}

export function GradeDialog({
  open, onOpenChange, initialValues, onSubmit, loading = false, isEdit = false,
}: GradeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Grade" : "Add Grade"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the grade details below." : "Fill in the details to add a new grade."}
          </DialogDescription>
        </DialogHeader>
        <GradeForm
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