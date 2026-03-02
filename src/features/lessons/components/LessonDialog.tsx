"use client";

import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/core/components/ui/dialog";
import { LessonForm, SubmitMode } from "./LessonForm";
import { Lesson } from "../types/lesson.types";

type LessonPayload = Partial<Lesson>;

interface LessonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<Lesson>;
  onSubmit: (values: LessonPayload, mode: SubmitMode) => void;
  loading?: boolean;
  isEdit?: boolean;
}

export function LessonDialog({
  open, onOpenChange, initialValues, onSubmit, loading = false, isEdit = false,
}: LessonDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Lesson" : "Add Lesson"}</DialogTitle>
        </DialogHeader>
        <LessonForm
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