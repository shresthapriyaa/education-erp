"use client";

import { useState, useEffect } from "react";
import { Button }  from "@/core/components/ui/button";
import { Label }   from "@/core/components/ui/label";
import { Input }   from "@/core/components/ui/input";
import { Switch }  from "@/core/components/ui/switch";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/core/components/ui/select";
import type {
  SessionDTO,
  SessionFormValues,
  SessionFormErrors,
} from "../types/session.types";

interface ClassOption  { id: string; name: string; }
interface SchoolOption { id: string; name: string; }

function validate(v: SessionFormValues): SessionFormErrors {
  const e: SessionFormErrors = {};
  if (!v.classId)   e.classId   = "Class is required.";
  if (!v.schoolId)  e.schoolId  = "School is required.";
  if (!v.date)      e.date      = "Date is required.";
  if (!v.startTime) e.startTime = "Start time is required.";
  return e;
}

function toDateInput(iso: string) {
  return iso ? new Date(iso).toISOString().split("T")[0] : "";
}

function toTimeInput(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

interface SessionFormProps {
  record?:    SessionDTO;
  onSubmit:   (values: SessionFormValues) => Promise<void>;
  onCancel:   () => void;
  isLoading?: boolean;
}

export function SessionForm({ record, onSubmit, onCancel, isLoading }: SessionFormProps) {
  const isEdit = !!record;

  const [values, setValues] = useState<SessionFormValues>({
    classId:   record?.class.id  ?? "",
    schoolId:  record?.school.id ?? "",
    date:      record ? toDateInput(record.date)           : "",
    startTime: record ? toTimeInput(record.startTime)      : "",
    endTime:   record?.endTime ? toTimeInput(record.endTime) : "",
    isOpen:    record?.isOpen ?? false,
  });
  const [errors,      setErrors]      = useState<SessionFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [classes,     setClasses]     = useState<ClassOption[]>([]);
  const [schools,     setSchools]     = useState<SchoolOption[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    setLoadingData(true);
    Promise.all([
      fetch("/api/classes").then(r => r.json()).catch(() => []),
      fetch("/api/schools").then(r => r.json()).catch(() => []),
    ]).then(([c, s]) => {
      setClasses(Array.isArray(c) ? c : []);
      setSchools(Array.isArray(s) ? s : []);
    }).finally(() => setLoadingData(false));
  }, []);

  function set<K extends keyof SessionFormValues>(key: K, val: SessionFormValues[K]) {
    setValues(p => ({ ...p, [key]: val }));
    setErrors(p => ({ ...p, [key]: undefined }));
  }

  function buildPayload(): SessionFormValues {
    const dateBase = values.date;
    const toISO = (time: string) =>
      time ? new Date(`${dateBase}T${time}`).toISOString() : "";
    return {
      ...values,
      date:      new Date(dateBase).toISOString(),
      startTime: toISO(values.startTime),
      endTime:   values.endTime ? toISO(values.endTime) : "",
    };
  }

  async function handleSubmit() {
    const errs = validate(values);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitError(null);
    try {
      await onSubmit(buildPayload());
    } catch (e: any) {
      setSubmitError(e?.response?.data?.error ?? e.message ?? "Failed to save.");
    }
  }

  return (
    <div className="space-y-5">

      {/* Class */}
      <div className="space-y-1.5">
        <Label>Class *</Label>
        <Select
          value={values.classId || undefined}
          onValueChange={v => set("classId", v)}
          disabled={loadingData}
        >
          <SelectTrigger className={errors.classId ? "border-destructive" : ""}>
            <SelectValue placeholder={loadingData ? "Loading…" : "Select class"} />
          </SelectTrigger>
          <SelectContent>
            {classes.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
            {!loadingData && classes.length === 0 && (
              <div className="px-3 py-2 text-sm text-muted-foreground">No classes found</div>
            )}
          </SelectContent>
        </Select>
        {errors.classId && <p className="text-xs text-destructive">{errors.classId}</p>}
      </div>

      {/* School */}
      <div className="space-y-1.5">
        <Label>School *</Label>
        <Select
          value={values.schoolId || undefined}
          onValueChange={v => set("schoolId", v)}
          disabled={loadingData}
        >
          <SelectTrigger className={errors.schoolId ? "border-destructive" : ""}>
            <SelectValue placeholder={loadingData ? "Loading…" : "Select school"} />
          </SelectTrigger>
          <SelectContent>
            {schools.map(s => (
              <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
            ))}
            {!loadingData && schools.length === 0 && (
              <div className="px-3 py-2 text-sm text-muted-foreground">No schools found</div>
            )}
          </SelectContent>
        </Select>
        {errors.schoolId && <p className="text-xs text-destructive">{errors.schoolId}</p>}
      </div>

      {/* Date + Times */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label>Date *</Label>
          <Input
            type="date"
            value={values.date}
            onChange={e => set("date", e.target.value)}
            className={errors.date ? "border-destructive" : ""}
          />
          {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Start Time *</Label>
          <Input
            type="time"
            value={values.startTime}
            onChange={e => set("startTime", e.target.value)}
            className={errors.startTime ? "border-destructive" : ""}
          />
          {errors.startTime && <p className="text-xs text-destructive">{errors.startTime}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>End Time</Label>
          <Input
            type="time"
            value={values.endTime}
            onChange={e => set("endTime", e.target.value)}
          />
        </div>
      </div>

      {/* Open toggle */}
      <div className="flex items-center gap-3">
        <Switch
          id="session-open"
          checked={values.isOpen}
          onCheckedChange={v => set("isOpen", v)}
        />
        <Label htmlFor="session-open" className="cursor-pointer">
          Open for attendance
        </Label>
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
        <Button onClick={handleSubmit} disabled={isLoading || loadingData} className="flex-1">
          {isLoading ? "Saving…" : isEdit ? "Save Changes" : "Create Session"}
        </Button>
      </div>
    </div>
  );
}