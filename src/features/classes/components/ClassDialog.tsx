"use client";

import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/core/components/ui/dialog";
import { ClassForm, SubmitMode } from "./ClassForm";
import { Class } from "../types/class.types";

type ClassPayload = Partial<Class> & { teacherId?: string };

interface ClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<Class>;
  onSubmit: (values: ClassPayload, mode: SubmitMode) => void;
  loading?: boolean;
  isEdit?: boolean;
}

export function ClassDialog({
  open, onOpenChange, initialValues, onSubmit, loading = false, isEdit = false,
}: ClassDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Class" : "Add Class"}</DialogTitle>
        </DialogHeader>
        <ClassForm
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