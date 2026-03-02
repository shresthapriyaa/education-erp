"use client";

import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/core/components/ui/dialog";
import { SubjectForm, SubmitMode } from "./SubjectForm";
import { Subject } from "../types/subject.types";

type SubjectPayload = Partial<Subject>;

interface SubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<Subject>;
  onSubmit: (values: SubjectPayload, mode: SubmitMode) => void;
  loading?: boolean;
  isEdit?: boolean;
}

export function SubjectDialog({
  open, onOpenChange, initialValues, onSubmit, loading = false, isEdit = false,
}: SubjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Subject" : "Add Subject"}</DialogTitle>
        </DialogHeader>
        <SubjectForm
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