/**
 * src/features/attendance/services/attendance.api.ts
 * All fetch() calls for the attendance feature.
 * Hooks and components never call fetch() directly.
 */

import type {
  AttendanceDTO,
  AttendanceFilters,
  AttendanceFormValues,
  ListAttendanceResponse,
  MarkAttendanceBody,
  MarkAttendanceResponse,
  SessionDTO,
} from "../types/attendance.types";

function headers(userId?: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    ...(userId ? { "x-user-id": userId } : {}),
    // Replace with real auth: "Authorization": `Bearer ${token}`
  };
}

// ─── Student ──────────────────────────────────────────────────────────────────

export async function fetchOpenSessions(userId: string): Promise<SessionDTO[]> {
  const res = await fetch("/api/attendance", {
    headers: headers(userId),
  });
  if (!res.ok) throw new Error("Failed to fetch sessions");
  const data = await res.json();
  return data.sessions as SessionDTO[];
}

export async function markAttendance(
  userId: string,
  body:   MarkAttendanceBody
): Promise<MarkAttendanceResponse> {
  const res = await fetch("/api/attendance", {
    method:  "POST",
    headers: headers(userId),
    body:    JSON.stringify(body),
  });
  return res.json() as Promise<MarkAttendanceResponse>;
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export async function fetchAttendanceList(
  userId:  string,
  filters: Partial<AttendanceFilters> = {}
): Promise<ListAttendanceResponse> {
  const params = new URLSearchParams();
  if (filters.status)   params.set("status",   filters.status);
  if (filters.classId)  params.set("classId",  filters.classId);
  if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
  if (filters.dateTo)   params.set("dateTo",   filters.dateTo);
  if (filters.search)   params.set("search",   filters.search);
  if (filters.page)     params.set("page",     String(filters.page));
  if (filters.pageSize) params.set("pageSize", String(filters.pageSize));

  const res = await fetch(`/api/attendance?${params.toString()}`, {
    headers: headers(userId),
  });
  if (!res.ok) throw new Error("Failed to fetch attendance list");
  return res.json() as Promise<ListAttendanceResponse>;
}

export async function fetchAttendanceById(
  userId: string,
  id:     string
): Promise<AttendanceDTO> {
  const res = await fetch(`/api/attendance/${id}`, {
    headers: headers(userId),
  });
  if (!res.ok) throw new Error("Attendance record not found");
  return res.json() as Promise<AttendanceDTO>;
}

export async function createAttendance(
  userId: string,
  body:   AttendanceFormValues
): Promise<AttendanceDTO> {
  const res = await fetch("/api/attendance", {
    method:  "POST",
    headers: headers(userId),
    body:    JSON.stringify({ ...body, isManualOverride: true }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Failed to create attendance");
  }
  const data = await res.json();
  return data.attendance as AttendanceDTO;
}

export async function updateAttendance(
  userId: string,
  id:     string,
  body:   Partial<AttendanceFormValues>
): Promise<AttendanceDTO> {
  const res = await fetch(`/api/attendance/${id}`, {
    method:  "PATCH",
    headers: headers(userId),
    body:    JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Failed to update attendance");
  }
  return res.json() as Promise<AttendanceDTO>;
}

export async function deleteAttendance(
  userId: string,
  id:     string
): Promise<void> {
  const res = await fetch(`/api/attendance/${id}`, {
    method:  "DELETE",
    headers: headers(userId),
  });
  if (!res.ok) throw new Error("Failed to delete attendance record");
}

export async function toggleSession(
  userId:    string,
  sessionId: string,
  isOpen:    boolean
): Promise<void> {
  const res = await fetch(`/api/attendance/sessions/${sessionId}/toggle`, {
    method:  "PATCH",
    headers: headers(userId),
    body:    JSON.stringify({ isOpen }),
  });
  if (!res.ok) throw new Error("Failed to toggle session");
}