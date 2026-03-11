"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/core/components/ui/dialog";
import { SchoolForm } from "./SchoolForm";
import type { SchoolDTO, SchoolFormValues } from "../types/school.types";

interface SchoolDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record?: SchoolDTO;
  onSubmit: (values: SchoolFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function SchoolDialog({
  open,
  onOpenChange,
  record,
  onSubmit,
  isLoading,
}: SchoolDialogProps) {
  const isEdit = !!record;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit School" : "Add School"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the school details below."
              : "Fill in the details to add a new school."}
          </DialogDescription>
        </DialogHeader>
        <SchoolForm
          record={record}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
