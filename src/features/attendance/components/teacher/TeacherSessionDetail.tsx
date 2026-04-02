"use client";

import { useState, useEffect } from "react";
import { Save, StopCircle, RefreshCw } from "lucide-react";
import { STATUS_CONFIG } from "../../types/attendance.types";
import type { SessionRecord, AttendanceStatus } from "../../types/attendance.types";

interface StudentRow {
  studentId: string;
  username:  string;
  email:     string;
  status:    AttendanceStatus;
}

interface Props {
  session:   SessionRecord;
  onEnd:     () => Promise<void>;
  onRefresh: () => void;
}

export default function TeacherSessionDetail({ session, onEnd, onRefresh }: Props) {
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  // Load students in this class + existing attendance
  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        // Fetch session detail with attendance
        const res = await fetch(`/api/admin/attendance/sessions/${session.id}`);
        if (!res.ok) throw new Error("Failed to load session detail");
        const data = await res.json();

        // Fetch all students in the class
        const studRes = await fetch(`/api/students?classId=${session.class.id}&pageSize=200`);
        if (!studRes.ok) throw new Error("Failed to load students");
        const studData = await studRes.json();

        const existingMap: Record<string, AttendanceStatus> = {};
        (data.attendance ?? []).forEach((a: any) => {
          existingMap[a.studentId] = a.status;
        });

        const rows: StudentRow[] = (studData.students ?? studData.data ?? studData ?? []).map((s: any) => ({
          studentId: s.id,
          username:  s.username,
          email:     s.email,
          status:    existingMap[s.id] ?? "PRESENT",
        }));

        setStudents(rows);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [session.id, session.class.id]);

  function setStatus(studentId: string, status: AttendanceStatus) {
    setStudents(prev => prev.map(s => s.studentId === studentId ? { ...s, status } : s));
    setSaved(false);
  }

  function markAll(status: AttendanceStatus) {
    setStudents(prev => prev.map(s => ({ ...s, status })));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/teacher/attendance", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          sessionId: session.id,
          records:   students.map(({ studentId, status }) => ({ studentId, status })),
        }),
      });
      if (!res.ok) throw new Error("Failed to save attendance");
      setSaved(true);
      onRefresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  const counts = students.reduce(
    (acc, s) => { acc[s.status] = (acc[s.status] ?? 0) + 1; return acc; },
    {} as Record<string, number>
  );

  return (
    <div>
      {/* Session info bar */}
      <div style={{
        background: session.isOpen ? "#f0fdf4" : "#f9fafb",
        border: `1.5px solid ${session.isOpen ? "#bbf7d0" : "#e5e7eb"}`,
        borderRadius: 10, padding: "12px 16px", marginBottom: 20,
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10,
      }}>
        <div style={{ display: "flex", gap: 16, fontSize: 13, color: "#374151" }}>
          <span><b>Class:</b> {session.class.name}</span>
          <span><b>School:</b> {session.school.name}</span>
          <span><b>Date:</b> {new Date(session.date).toLocaleDateString("en-GB")}</span>
          <span style={{ color: session.isOpen ? "#16a34a" : "#6b7280", fontWeight: 700 }}>
            {session.isOpen ? "● Live" : "● Closed"}
          </span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {session.isOpen && (
            <button onClick={onEnd} style={dangerBtnSt}>
              <StopCircle size={13} /> End Session
            </button>
          )}
        </div>
      </div>

      {/* Stats pills */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {(["PRESENT", "ABSENT", "LATE", "EXCUSED"] as AttendanceStatus[]).map(s => {
          const cfg = STATUS_CONFIG[s];
          return (
            <button key={s} onClick={() => markAll(s)} style={{
              padding: "5px 14px", borderRadius: 20, border: `1.5px solid ${cfg.color}`,
              background: cfg.bg, color: cfg.color, fontSize: 12, fontWeight: 700, cursor: "pointer",
            }}>
              Mark All {cfg.label} ({counts[s] ?? 0})
            </button>
          );
        })}
        <span style={{ marginLeft: "auto", fontSize: 13, color: "#6b7280", alignSelf: "center" }}>
          {students.length} students
        </span>
      </div>

      {error && (
        <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#dc2626" }}>
          ⚠ {error}
        </div>
      )}

      {/* Student table */}
      <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden", marginBottom: 20 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
              {["#", "Student", "Email", "Status"].map(h => (
                <th key={h} style={thSt}>{h}</th>
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
              students.map((s, i) => {
                const cfg = STATUS_CONFIG[s.status];
                return (
                  <tr key={s.studentId} style={{ borderBottom: i < students.length - 1 ? "1px solid #f3f4f6" : "none", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <td style={{ ...tdSt, color: "#9ca3af", width: 40 }}>{i + 1}</td>
                    <td style={tdSt}><span style={{ fontWeight: 700, color: "#111827" }}>{s.username}</span></td>
                    <td style={{ ...tdSt, color: "#6b7280" }}>{s.email}</td>
                    <td style={tdSt}>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {(["PRESENT", "ABSENT", "LATE", "EXCUSED"] as AttendanceStatus[]).map(st => {
                          const c = STATUS_CONFIG[st];
                          const active = s.status === st;
                          return (
                            <button
                              key={st}
                              onClick={() => setStatus(s.studentId, st)}
                              style={{
                                padding: "4px 10px", borderRadius: 16, fontSize: 11, fontWeight: 700,
                                border:     `1.5px solid ${active ? c.color : "#e5e7eb"}`,
                                background: active ? c.bg : "#fff",
                                color:      active ? c.color : "#9ca3af",
                                cursor: "pointer",
                              }}
                            >
                              {c.label}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Save button */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
        {saved && (
          <span style={{ fontSize: 13, color: "#16a34a", fontWeight: 600, alignSelf: "center" }}>
            ✓ Attendance saved
          </span>
        )}
        <button onClick={save} disabled={saving || loading} style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "10px 24px", borderRadius: 8, border: "none",
          background: saving ? "#d1d5db" : "#111827", color: "#fff",
          fontSize: 14, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer",
        }}>
          {saving ? <><RefreshCw size={14} /> Saving...</> : <><Save size={14} /> Save Attendance</>}
        </button>
      </div>
    </div>
  );
}

const thSt: React.CSSProperties = { padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#9ca3af" };
const tdSt: React.CSSProperties = { padding: "12px 16px", color: "#374151" };
const dangerBtnSt: React.CSSProperties = { display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 8, border: "1.5px solid #fca5a5", background: "#fff", color: "#dc2626", fontSize: 12, fontWeight: 700, cursor: "pointer" };