"use client";

import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/core/components/ui/dialog";
import { RoutineForm, SubmitMode } from "./RoutineForm";
import { Routine } from "../types/routine.types";

type RoutinePayload = Partial<Routine>;

interface RoutineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<Routine>;
  onSubmit: (values: RoutinePayload, mode: SubmitMode) => void;
  loading?: boolean;
  isEdit?: boolean;
}

export function RoutineDialog({
  open, onOpenChange, initialValues, onSubmit, loading = false, isEdit = false,
}: RoutineDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Routine" : "Add Routine"}</DialogTitle>
        </DialogHeader>
        <RoutineForm
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