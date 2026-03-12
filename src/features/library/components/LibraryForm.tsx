"use client";

import { useState } from "react";
import { Button } from "@/core/components/ui/button";
import { Label }  from "@/core/components/ui/label";
import { Input }  from "@/core/components/ui/input";
import { LibraryBookDTO, LibraryBookFormErrors, LibraryBookFormValues } from "../types/library";

function toDateInput(iso: string) {
  return iso ? new Date(iso).toISOString().split("T")[0] : "";
}

function validate(v: LibraryBookFormValues): LibraryBookFormErrors {
  const e: LibraryBookFormErrors = {};
  if (!v.title.trim())         e.title         = "Title is required.";
  if (!v.author.trim())        e.author        = "Author is required.";
  if (!v.isbn.trim())          e.isbn          = "ISBN is required.";
  if (!v.publishedDate.trim()) e.publishedDate = "Published date is required.";
  return e;
}

interface LibraryBookFormProps {
  record?:    LibraryBookDTO;
  onSubmit:   (values: LibraryBookFormValues) => Promise<void>;
  onCancel:   () => void;
  isLoading?: boolean;
}

export function LibraryBookForm({ record, onSubmit, onCancel, isLoading }: LibraryBookFormProps) {
  const isEdit = !!record;

  const [values, setValues] = useState<LibraryBookFormValues>({
    title:         record?.title         ?? "",
    author:        record?.author        ?? "",
    isbn:          record?.isbn          ?? "",
    publishedDate: record ? toDateInput(record.publishedDate) : "",
  });
  const [errors,      setErrors]      = useState<LibraryBookFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  function set<K extends keyof LibraryBookFormValues>(key: K, val: string) {
    setValues(p => ({ ...p, [key]: val }));
    setErrors(p => ({ ...p, [key]: undefined }));
  }

  async function handleSubmit() {
    const errs = validate(values);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitError(null);
    try {
      await onSubmit({
        ...values,
        publishedDate: new Date(values.publishedDate).toISOString(),
      });
    } catch (e: any) {
      setSubmitError(e?.response?.data?.error ?? e.message ?? "Failed to save.");
    }
  }

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Label>Title *</Label>
        <Input
          placeholder="e.g. The Great Gatsby"
          value={values.title}
          onChange={e => set("title", e.target.value)}
          className={errors.title ? "border-destructive" : ""}
        />
        {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
      </div>

      <div className="space-y-1.5">
        <Label>Author *</Label>
        <Input
          placeholder="e.g. F. Scott Fitzgerald"
          value={values.author}
          onChange={e => set("author", e.target.value)}
          className={errors.author ? "border-destructive" : ""}
        />
        {errors.author && <p className="text-xs text-destructive">{errors.author}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>ISBN *</Label>
          <Input
            placeholder="e.g. 978-3-16-148410-0"
            value={values.isbn}
            onChange={e => set("isbn", e.target.value)}
            className={errors.isbn ? "border-destructive" : ""}
          />
          {errors.isbn && <p className="text-xs text-destructive">{errors.isbn}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Published Date *</Label>
          <Input
            type="date"
            value={values.publishedDate}
            onChange={e => set("publishedDate", e.target.value)}
            className={errors.publishedDate ? "border-destructive" : ""}
          />
          {errors.publishedDate && <p className="text-xs text-destructive">{errors.publishedDate}</p>}
        </div>
      </div>

      {submitError && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
          {submitError}
        </p>
      )}

      <div className="flex gap-3 pt-1">
        <Button variant="outline" onClick={onCancel} disabled={isLoading} className="flex-1">
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading} className="flex-1">
          {isLoading ? "Saving…" : isEdit ? "Save Changes" : "Add Book"}
        </Button>
      </div>
    </div>
  );
}