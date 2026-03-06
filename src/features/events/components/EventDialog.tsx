"use client";

import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/core/components/ui/dialog";
import { EventForm, SubmitMode } from "./EventForm";
import { Event } from "../types/event.types";

type EventPayload = Partial<Event>;

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<Event>;
  onSubmit: (values: EventPayload, mode: SubmitMode) => void;
  loading?: boolean;
  isEdit?: boolean;
}

export function EventDialog({
  open, onOpenChange, initialValues, onSubmit, loading = false, isEdit = false,
}: EventDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Event" : "Add Event"}</DialogTitle>
        </DialogHeader>
        <EventForm
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