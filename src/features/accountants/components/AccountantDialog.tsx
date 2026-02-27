"use client";

import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/core/components/ui/dialog";
import { AccountantForm, SubmitMode } from "./AccountantForm";
import { Accountant } from "../types/accountant.types";

type AccountantPayload = Partial<Accountant>;

interface AccountantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<Accountant>;
  onSubmit: (values: AccountantPayload, mode: SubmitMode) => void;
  loading?: boolean;
  isEdit?: boolean;
}

export function AccountantDialog({
  open, onOpenChange, initialValues, onSubmit, loading = false, isEdit = false,
}: AccountantDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Accountant" : "Add Accountant"}</DialogTitle>
        </DialogHeader>
        <AccountantForm
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