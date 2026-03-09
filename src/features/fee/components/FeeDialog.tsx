"use client";

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/core/components/ui/dialog";
import { FeeForm, SubmitMode } from "./FeeForm";
import { Fee } from "../types/fee.types";

type FeePayload = Partial<Fee> & { studentId?: string };

interface FeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<Fee>;
  onSubmit: (values: FeePayload, mode: SubmitMode) => void;
  loading?: boolean;
  isEdit?: boolean;
}

export function FeeDialog({
  open, onOpenChange, initialValues, onSubmit, loading = false, isEdit = false,
}: FeeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Fee" : "Add Fee"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update fee details below." : "Fill in the details to create a new fee."}
          </DialogDescription>
        </DialogHeader>
        <FeeForm
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