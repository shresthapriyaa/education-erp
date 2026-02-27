"use client";

import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/core/components/ui/dialog";
import { ParentForm, SubmitMode } from "./ParentForm";
import { Parent } from "../types/parent.types";

type ParentPayload = Partial<Parent>;

interface ParentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<Parent>;
  onSubmit: (values: ParentPayload, mode: SubmitMode) => void;
  loading?: boolean;
  isEdit?: boolean;
}

export function ParentDialog({
  open,
  onOpenChange,
  initialValues,
  onSubmit,
  loading = false,
  isEdit = false,
}: ParentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Parent" : "Add Parent"}</DialogTitle>
        </DialogHeader>
        <ParentForm
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