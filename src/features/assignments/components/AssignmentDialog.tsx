"use client";

import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/core/components/ui/dialog";
import { ScrollArea } from "@/core/components/ui/scroll-area";
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
      <DialogContent className="max-w-3xl h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 shrink-0 border-b">
          <DialogTitle>{isEdit ? "Edit Assignment" : "Add Assignment"}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full px-6 py-4">
            <AssignmentForm
              initialValues={initialValues}
              onSubmit={onSubmit}
              loading={loading}
              isEdit={isEdit}
              onCancel={() => onOpenChange(false)}
            />
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}