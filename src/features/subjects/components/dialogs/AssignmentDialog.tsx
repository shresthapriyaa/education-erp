"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/core/components/ui/dialog";
import { ScrollArea } from "@/core/components/ui/scroll-area";
import { AssignmentForm } from "../forms/AssignmentForm";
import { Assignment } from "@/features/assignments/types/assignment.types";

interface AssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<Assignment>;
  onSubmit: (values: any) => void;
  loading?: boolean;
  isEdit?: boolean;
  subjectId: string;
}

export function AssignmentDialog({
  open,
  onOpenChange,
  initialValues,
  onSubmit,
  loading = false,
  isEdit = false,
  subjectId,
}: AssignmentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Assignment" : "Create Assignment"}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4">
          <AssignmentForm
            initialValues={initialValues}
            onSubmit={onSubmit}
            loading={loading}
            isEdit={isEdit}
            onCancel={() => onOpenChange(false)}
            subjectId={subjectId}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
