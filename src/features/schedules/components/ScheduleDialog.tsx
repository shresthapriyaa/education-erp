"use client";

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/core/components/ui/dialog";
import { ScheduleForm, SubmitMode } from "./ScheduleForm";
import { Schedule } from "../types/schedule.types";

type SchedulePayload = Partial<Schedule> & { classId?: string; subjectId?: string };

interface ScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<Schedule>;
  onSubmit: (values: SchedulePayload, mode: SubmitMode) => void;
  loading?: boolean;
  isEdit?: boolean;
}

export function ScheduleDialog({
  open, onOpenChange, initialValues, onSubmit, loading = false, isEdit = false,
}: ScheduleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Schedule" : "Add Schedule"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update schedule details below." : "Fill in the details to create a new schedule."}
          </DialogDescription>
        </DialogHeader>
        <ScheduleForm
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