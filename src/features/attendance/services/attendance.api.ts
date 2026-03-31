import type {
  AttendanceRecord,
  AttendanceFilters,
  MarkAttendancePayload,
  BulkMarkAttendancePayload,
  AttendanceSummary,
} from "../types/attendance.types";

const BASE = "/api/attendance";

// ─── Student: Mark own attendance (geofence check-in) ───────────────────────
export async function markStudentAttendance(
  payload: MarkAttendancePayload
): Promise<AttendanceRecord> {
  const res = await fetch(`${BASE}/mark`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to mark attendance");
  return res.json();
}

// ─── Teacher: Bulk mark entire class ────────────────────────────────────────
export async function bulkMarkAttendance(
  payload: BulkMarkAttendancePayload
): Promise<AttendanceRecord[]> {
  const res = await fetch(`${BASE}/bulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to bulk mark attendance");
  return res.json();
}

// ─── Get attendance records (filterable by role) ─────────────────────────────
export async function getAttendanceRecords(
  filters: AttendanceFilters
): Promise<AttendanceRecord[]> {
  const params = new URLSearchParams();
  if (filters.studentId) params.set("studentId", filters.studentId);
  if (filters.classId) params.set("classId", filters.classId);
  if (filters.startDate) params.set("startDate", filters.startDate);
  if (filters.endDate) params.set("endDate", filters.endDate);
  if (filters.status) params.set("status", filters.status);

  const res = await fetch(`${BASE}?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch attendance records");
  return res.json();
}

// ─── Get summary (present/absent/late/percentage) ────────────────────────────
export async function getAttendanceSummary(
  studentId: string,
  month?: string // e.g. "2026-03"
): Promise<AttendanceSummary> {
  const params = new URLSearchParams({ studentId });
  if (month) params.set("month", month);

  const res = await fetch(`${BASE}/summary?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch attendance summary");
  return res.json();
}

// ─── Admin/Accountant: Get all students attendance report ────────────────────
export async function getClassAttendanceReport(
  classId: string,
  month?: string
): Promise<{ student: { id: string; name: string; rollNo: string }; summary: AttendanceSummary }[]> {
  const params = new URLSearchParams({ classId });
  if (month) params.set("month", month);

  const res = await fetch(`${BASE}/report?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch class attendance report");
  return res.json();
}