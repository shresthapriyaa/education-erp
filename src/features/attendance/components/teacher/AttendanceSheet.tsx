"use client";

import { Save, RefreshCw } from "lucide-react";
import { STATUS_CONFIG } from "../../types/attendance.types";
import type { AttendanceStatus } from "../../types/attendance.types";
import type { ClassItem, StudentRow } from "../../hooks/useTeacherAttendance";

interface Props {
  cls:       ClassItem;
  students:  StudentRow[];
  loading:   boolean;
  error:     string | null;
  saving:    boolean;
  saved:     boolean;
  saveError: string | null;
  onBack:    () => void;
  onStatus:  (studentId: string, status: AttendanceStatus) => void;
  onMarkAll: (status: AttendanceStatus) => void;
  onSave:    () => void;
}

export default function AttendanceSheet({
  cls, students, loading, error,
  saving, saved, saveError,
  onBack, onStatus, onMarkAll, onSave,
}: Props) {
  const counts = students.reduce(
    (acc, s) => { acc[s.status] = (acc[s.status] ?? 0) + 1; return acc; },
    {} as Record<string, number>
  );

  return (
    <div>
      {/* Class info bar */}
      <div style={{
        background: "#f0fdf4", border: "1.5px solid #bbf7d0",
        borderRadius: 10, padding: "12px 16px", marginBottom: 20,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", gap: 16, fontSize: 13, color: "#374151" }}>
          <span><b>Class:</b> {cls.name}</span>
          <span><b>Date:</b> {new Date().toLocaleDateString("en-GB")}</span>
          <span style={{ color: "#16a34a", fontWeight: 700 }}>● Live</span>
        </div>
      </div>

      {/* Mark all buttons */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {(["PRESENT", "ABSENT", "LATE", "EXCUSED"] as AttendanceStatus[]).map(s => {
          const cfg = STATUS_CONFIG[s];
          return (
            <button key={s} onClick={() => onMarkAll(s)} style={{
              padding: "5px 14px", borderRadius: 20,
              border: `1.5px solid ${cfg.color}`,
              background: cfg.bg, color: cfg.color,
              fontSize: 12, fontWeight: 700, cursor: "pointer",
            }}>
              Mark All {cfg.label} ({counts[s] ?? 0})
            </button>
          );
        })}
        <span style={{ marginLeft: "auto", fontSize: 13, color: "#6b7280", alignSelf: "center" }}>
          {students.length} students
        </span>
      </div>

      {/* Errors */}
      {(error || saveError) && (
        <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#dc2626" }}>
          ⚠ {error ?? saveError}
        </div>
      )}

      {/* Student table */}
      <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden", marginBottom: 20 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
              {["#", "Student", "Email", "Status"].map(h => (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.07em", color: "#9ca3af" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  {[...Array(4)].map((_, j) => (
                    <td key={j} style={{ padding: "13px 16px" }}>
                      <div style={{ height: 12, background: "#f3f4f6", borderRadius: 4 }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: 48, textAlign: "center", color: "#9ca3af" }}>
                  No students found in this class
                </td>
              </tr>
            ) : (
              students.map((s, i) => (
                <tr key={s.studentId} style={{
                  borderBottom: i < students.length - 1 ? "1px solid #f3f4f6" : "none",
                  background: i % 2 === 0 ? "#fff" : "#fafafa",
                }}>
                  <td style={{ padding: "12px 16px", color: "#9ca3af", width: 40 }}>{i + 1}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontWeight: 700, color: "#111827" }}>{s.username}</span>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#6b7280" }}>{s.email}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {(["PRESENT", "ABSENT", "LATE", "EXCUSED"] as AttendanceStatus[]).map(st => {
                        const c      = STATUS_CONFIG[st];
                        const active = s.status === st;
                        return (
                          <button key={st} onClick={() => onStatus(s.studentId, st)} style={{
                            padding: "4px 10px", borderRadius: 16, fontSize: 11, fontWeight: 700,
                            border:     `1.5px solid ${active ? c.color : "#e5e7eb"}`,
                            background: active ? c.bg : "#fff",
                            color:      active ? c.color : "#9ca3af",
                            cursor: "pointer",
                          }}>
                            {c.label}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Save button */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
        {saved && (
          <span style={{ fontSize: 13, color: "#16a34a", fontWeight: 600, alignSelf: "center" }}>
            ✓ Attendance saved successfully
          </span>
        )}
        <button onClick={onSave} disabled={saving || loading} style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "10px 24px", borderRadius: 8, border: "none",
          background: saving ? "#d1d5db" : "#111827", color: "#fff",
          fontSize: 14, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer",
        }}>
          {saving
            ? <><RefreshCw size={14} /> Saving...</>
            : <><Save size={14} /> Save Attendance</>
          }
        </button>
      </div>
    </div>
  );
}
