"use client";

import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/core/components/ui/dialog";
import { ScrollArea } from "@/core/components/ui/scroll-area";
import { LessonForm, SubmitMode } from "./LessonForm";
import { Lesson } from "../types/lesson.types";

type LessonPayload = Partial<Lesson>;

interface LessonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<Lesson>;
  onSubmit: (values: LessonPayload, mode: SubmitMode) => void;
  loading?: boolean;
  isEdit?: boolean;
}

export function LessonDialog({
  open, onOpenChange, initialValues, onSubmit, loading = false, isEdit = false,
}: LessonDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 shrink-0 border-b">
          <DialogTitle>{isEdit ? "Edit Lesson" : "Add Lesson"}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full px-6 py-4">
            <LessonForm
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