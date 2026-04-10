"use client";

import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/core/components/ui/dialog";
import { ClassForm, SubmitMode } from "./ClassForm";
import { Class } from "../types/class.types";

type ClassPayload = Partial<Class> & { 
  teacherId?: string;
  subjects?: Array<{
    subjectId: string;
    teacherId: string | null;
  }>;
};

interface ClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<Class>;
  onSubmit: (values: ClassPayload, mode: SubmitMode) => Promise<void>;
  loading?: boolean;
  isEdit?: boolean;
  onClose?: () => void;
}

export function ClassDialog({
  open, onOpenChange, initialValues, onSubmit, loading = false, isEdit = false, onClose,
}: ClassDialogProps) {
  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen && onClose) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Class" : "Add Class"}</DialogTitle>
        </DialogHeader>
        <ClassForm
          initialValues={initialValues}
          onSubmit={onSubmit}
          loading={loading}
          isEdit={isEdit}
          onCancel={() => handleOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}