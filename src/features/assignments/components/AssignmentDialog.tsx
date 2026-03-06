"use client";

import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/core/components/ui/dialog";
import { AssignmentForm, SubmitMode } from "./AssignmentForm";
import { Assignment } from "../types/assignment.types";

type AssignmentPayload = Partial<Assignment>;

interface AssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<Assignment>;
  onSubmit: (values: AssignmentPayload, mode: SubmitMode) => void;
  loading?: boolean;
  isEdit?: boolean;
}

export function AssignmentDialog({
  open, onOpenChange, initialValues, onSubmit, loading = false, isEdit = false,
}: AssignmentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Assignment" : "Add Assignment"}</DialogTitle>
        </DialogHeader>
        <AssignmentForm
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