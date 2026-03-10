"use client";

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/core/components/ui/dialog";
import { NoticeForm, SubmitMode } from "./NoticeForm";
import { Notice } from "../types/notice.types";

type NoticePayload = Partial<Notice>;

interface NoticeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<Notice>;
  onSubmit: (values: NoticePayload, mode: SubmitMode) => void;
  loading?: boolean;
  isEdit?: boolean;
}

export function NoticeDialog({
  open, onOpenChange, initialValues, onSubmit, loading = false, isEdit = false,
}: NoticeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Notice" : "Add Notice"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update notice details below." : "Fill in the details to create a new notice."}
          </DialogDescription>
        </DialogHeader>
        <NoticeForm
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