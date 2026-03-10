"use client";

/**
 * src/features/attendance/components/ConfirmDelete.tsx
 */

import { useState } from "react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/core/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import type { AttendanceDTO } from "../types/attendance.types";

interface ConfirmDeleteProps {
  open:         boolean;
  onOpenChange: (open: boolean) => void;
  record:       AttendanceDTO | null;
  onConfirm:    (id: string) => Promise<void>;
}

export function ConfirmDelete({ open, onOpenChange, record, onConfirm }: ConfirmDeleteProps) {
  const [deleting, setDeleting] = useState(false);

  if (!record) return null;

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm(record.id);
      onOpenChange(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Attendance Record</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>You are about to permanently delete this record:</p>
              <div className="rounded-lg bg-muted/40 px-4 py-3 space-y-1 text-foreground">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Student</span>
                  <span className="font-medium">{record.student.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Class</span>
                  <span className="font-medium">{record.session?.class.name ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium tabular-nums">
                    {new Date(record.date).toLocaleDateString([], {
                      weekday: "short", month: "short", day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium">{record.status}</span>
                </div>
              </div>
              <p className="text-destructive font-medium">This action cannot be undone.</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={deleting}
            className="bg-destructive hover:bg-destructive/90"
          >
            {deleting
              ? <><Loader2 size={13} className="mr-2 animate-spin" /> Deleting…</>
              : "Delete Record"
            }
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}