"use client";

import { useState } from "react";
import { Button } from "@/core/components/ui/button";
import { Label } from "@/core/components/ui/label";
import { Input } from "@/core/components/ui/input";
import type {
  SchoolDTO,
  SchoolFormValues,
  SchoolFormErrors,
} from "../types/school.types";

function validate(v: SchoolFormValues): SchoolFormErrors {
  const e: SchoolFormErrors = {};
  if (!v.name.trim()) e.name = "Name is required.";
  if (!v.latitude.trim()) e.latitude = "Latitude is required.";
  else if (
    isNaN(Number(v.latitude)) ||
    Number(v.latitude) < -90 ||
    Number(v.latitude) > 90
  )
    e.latitude = "Must be a valid latitude (-90 to 90).";
  if (!v.longitude.trim()) e.longitude = "Longitude is required.";
  else if (
    isNaN(Number(v.longitude)) ||
    Number(v.longitude) < -180 ||
    Number(v.longitude) > 180
  )
    e.longitude = "Must be a valid longitude (-180 to 180).";
  if (v.radiusMeters && isNaN(Number(v.radiusMeters)))
    e.radiusMeters = "Must be a number.";
  return e;
}

interface SchoolFormProps {
  record?: SchoolDTO;
  onSubmit: (values: SchoolFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function SchoolForm({
  record,
  onSubmit,
  onCancel,
  isLoading,
}: SchoolFormProps) {
  const isEdit = !!record;

  const [values, setValues] = useState<SchoolFormValues>({
    name: record?.name ?? "",
    address: record?.address ?? "",
    latitude: record ? String(record.latitude) : "",
    longitude: record ? String(record.longitude) : "",
    radiusMeters: record ? String(record.radiusMeters) : "200",
  });
  const [errors, setErrors] = useState<SchoolFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  function set<K extends keyof SchoolFormValues>(key: K, val: string) {
    setValues((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  }

  async function handleSubmit() {
    const errs = validate(values);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSubmitError(null);
    try {
      await onSubmit(values);
    } catch (e: any) {
      setSubmitError(
        e?.response?.data?.error ?? e.message ?? "Failed to save.",
      );
    }
  }

  return (
    <div className="space-y-5">
      {/* Name */}
      <div className="space-y-1.5">
        <Label>School Name *</Label>
        <Input
          placeholder="e.g. Sunrise Academy"
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          className={errors.name ? "border-destructive" : ""}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name}</p>
        )}
      </div>

      {/* Address */}
      <div className="space-y-1.5">
        <Label>Address</Label>
        <Input
          placeholder="e.g. 123 Main St, Kathmandu"
          value={values.address}
          onChange={(e) => set("address", e.target.value)}
        />
      </div>

      {/* Lat / Lng */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Latitude *</Label>
          <Input
            placeholder="e.g. 27.7172"
            value={values.latitude}
            onChange={(e) => set("latitude", e.target.value)}
            className={errors.latitude ? "border-destructive" : ""}
          />
          {errors.latitude && (
            <p className="text-xs text-destructive">{errors.latitude}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label>Longitude *</Label>
          <Input
            placeholder="e.g. 85.3240"
            value={values.longitude}
            onChange={(e) => set("longitude", e.target.value)}
            className={errors.longitude ? "border-destructive" : ""}
          />
          {errors.longitude && (
            <p className="text-xs text-destructive">{errors.longitude}</p>
          )}
        </div>
      </div>

      {/* Radius */}
      <div className="space-y-1.5">
        <Label>Attendance Radius (meters)</Label>
        <Input
          placeholder="200"
          value={values.radiusMeters}
          onChange={(e) => set("radiusMeters", e.target.value)}
          className={errors.radiusMeters ? "border-destructive" : ""}
        />
        <p className="text-xs text-muted-foreground">
          Students must be within this distance to mark attendance. Default:
          200m.
        </p>
        {errors.radiusMeters && (
          <p className="text-xs text-destructive">{errors.radiusMeters}</p>
        )}
      </div>

      {submitError && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
          {submitError}
        </p>
      )}

      <div className="flex gap-3 pt-1">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading} className="flex-1">
          {isLoading ? "Saving…" : isEdit ? "Save Changes" : "Create School"}
        </Button>
      </div>
    </div>
  );
}
