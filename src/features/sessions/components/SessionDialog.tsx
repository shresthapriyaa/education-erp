"use client";

import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription,
} from "@/core/components/ui/dialog";
import { SessionForm } from "./SessionForm";
import type { SessionDTO, SessionFormValues } from "../types/session.types";

interface SessionDialogProps {
  open:         boolean;
  onOpenChange: (open: boolean) => void;
  record?:      SessionDTO;
  onSubmit:     (values: SessionFormValues) => Promise<void>;
  isLoading?:   boolean;
}

export function SessionDialog({
  open, onOpenChange, record, onSubmit, isLoading,
}: SessionDialogProps) {
  const isEdit = !!record;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Session" : "Create Session"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the session details below."
              : "Fill in the details to create a new session."}
          </DialogDescription>
        </DialogHeader>
        <SessionForm
          record={record}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}