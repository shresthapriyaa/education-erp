"use client";

import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/core/components/ui/dialog";
import { SchoolZoneForm, SchoolZonePayload, SubmitMode } from "./SchoolzoneForm";
import { SchoolZone } from "../types/Schoolzone.types";


interface SchoolZoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<SchoolZone>;
  onSubmit: (values: SchoolZonePayload, mode: SubmitMode) => void;
  loading?: boolean;
  isEdit?: boolean;
}

export function SchoolZoneDialog({
  open, onOpenChange, initialValues, onSubmit, loading = false, isEdit = false,
}: SchoolZoneDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit School Zone" : "Add School Zone"}</DialogTitle>
        </DialogHeader>
        <SchoolZoneForm
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