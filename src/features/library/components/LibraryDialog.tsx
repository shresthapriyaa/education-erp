"use client";

import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription,
} from "@/core/components/ui/dialog";
import { LibraryBookForm } from "./LibraryForm";
import { LibraryBookDTO, LibraryBookFormValues } from "../types/library";


interface LibraryBookDialogProps {
  open:         boolean;
  onOpenChange: (open: boolean) => void;
  record?:      LibraryBookDTO;
  onSubmit:     (values: LibraryBookFormValues) => Promise<void>;
  isLoading?:   boolean;
}

export function LibraryBookDialog({
  open, onOpenChange, record, onSubmit, isLoading,
}: LibraryBookDialogProps) {
  const isEdit = !!record;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Book" : "Add Book"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the book details below."
              : "Fill in the details to add a new book to the library."}
          </DialogDescription>
        </DialogHeader>
        <LibraryBookForm
          record={record}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}