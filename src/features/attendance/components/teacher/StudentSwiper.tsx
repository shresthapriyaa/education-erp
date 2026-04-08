"use client";

import { CheckCircle2, XCircle, ChevronLeft, Save, MapPin } from "lucide-react";
import type { ClassItem, StudentRow } from "../../hooks/useTeacherAttendance";
import type { AttendanceStatus } from "../../types/attendance.types";

interface Props {
  cls:          ClassItem;
  students:     StudentRow[];
  loading:      boolean;
  error:        string | null;
  currentIndex: number;
  isComplete:   boolean;
  saving:       boolean;
  saved:        boolean;
  saveError:    string | null;
  geoDistance:  number | null;
  onMark:       (status: AttendanceStatus) => void;
  onPrev:       () => void;
  onSave:       () => void;
}

export default function StudentSwiper({
  cls, students, loading, error,
  currentIndex, isComplete,
  saving, saved, saveError, geoDistance,
  onMark, onPrev, onSave,
}: Props) {

  const total   = students.length;
  const marked  = students.filter(s => s.status !== null).length;
  const present = students.filter(s => s.status === "PRESENT").length;
  const absent  = students.filter(s => s.status === "ABSENT").length;
  const current = students[currentIndex];

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {[...Array(3)].map((_, i) => (
          <div key={i} style={{ height: 80, background: "#f3f4f6", borderRadius: 12 }} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 8, padding: "14px 18px", fontSize: 13, color: "#dc2626" }}>
        ⚠ {error}
      </div>
    );
  }

  if (total === 0) {
    return (
      <div style={{ textAlign: "center", padding: 64, color: "#9ca3af" }}>
        <p style={{ fontSize: 16, fontWeight: 600 }}>No students in this class</p>
      </div>
    );
  }

  return (
    <div>
      {/* Info bar */}
      <div style={{
        background: "#f0fdf4", border: "1.5px solid #bbf7d0",
        borderRadius: 10, padding: "12px 18px", marginBottom: 20,
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8,
      }}>
        <div style={{ display: "flex", gap: 16, fontSize: 13, color: "#374151", flexWrap: "wrap" }}>
          <span><b>Class:</b> {cls.name}</span>
          <span><b>Date:</b> {new Date().toLocaleDateString("en-GB")}</span>
          {geoDistance !== null && (
            <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#16a34a" }}>
              <MapPin size={12} /> {geoDistance}m from school
            </span>
          )}
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#16a34a" }}>● Location Verified</span>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>
            Progress: {marked} / {total} students
          </span>
          <span style={{ fontSize: 12, color: "#6b7280" }}>
            ✅ {present} present · ❌ {absent} absent
          </span>
        </div>
        <div style={{ height: 8, background: "#e5e7eb", borderRadius: 8, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 8,
            width: `${total > 0 ? (marked / total) * 100 : 0}%`,
            background: "#16a34a", transition: "width 0.3s ease",
          }} />
        </div>
      </div>

      {/* Student card or completion screen */}
      {isComplete ? (
        <CompletionScreen
          students={students}
          present={present}
          absent={absent}
          saving={saving}
          saved={saved}
          saveError={saveError}
          onSave={onSave}
          onPrev={onPrev}
          currentIndex={currentIndex}
        />
      ) : current ? (
        <div>
          {/* Navigation hint */}
          {currentIndex > 0 && (
            <button onClick={onPrev} style={{
              display: "flex", alignItems: "center", gap: 4,
              background: "none", border: "none", cursor: "pointer",
              fontSize: 12, color: "#6b7280", marginBottom: 12, padding: 0,
            }}>
              <ChevronLeft size={14} /> Back to previous student
            </button>
          )}

          {/* Student card */}
          <div style={{
            background: "#fff", border: "2px solid #e5e7eb",
            borderRadius: 20, padding: "40px 32px",
            textAlign: "center", maxWidth: 480, margin: "0 auto",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          }}>
            {/* Avatar */}
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              background: "#f3f4f6", margin: "0 auto 16px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 32, fontWeight: 800, color: "#374151",
            }}>
              {current.username.charAt(0).toUpperCase()}
            </div>

            <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#9ca3af" }}>
              Student {currentIndex + 1} of {total}
            </p>
            <h2 style={{ margin: "0 0 6px", fontSize: 24, fontWeight: 900, color: "#111827" }}>
              {current.username}
            </h2>
            <p style={{ margin: "0 0 32px", fontSize: 13, color: "#6b7280" }}>
              {current.email}
            </p>

            {/* Present / Absent buttons */}
            <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
              <button
                onClick={() => onMark("PRESENT")}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "14px 32px", borderRadius: 12, border: "none",
                  background: "#16a34a", color: "#fff",
                  fontSize: 16, fontWeight: 800, cursor: "pointer",
                  transition: "transform 0.1s, background 0.15s",
                  flex: 1, justifyContent: "center",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#15803d")}
                onMouseLeave={e => (e.currentTarget.style.background = "#16a34a")}
              >
                <CheckCircle2 size={20} /> Present
              </button>
              <button
                onClick={() => onMark("ABSENT")}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "14px 32px", borderRadius: 12, border: "none",
                  background: "#dc2626", color: "#fff",
                  fontSize: 16, fontWeight: 800, cursor: "pointer",
                  transition: "transform 0.1s, background 0.15s",
                  flex: 1, justifyContent: "center",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#b91c1c")}
                onMouseLeave={e => (e.currentTarget.style.background = "#dc2626")}
              >
                <XCircle size={20} /> Absent
              </button>
            </div>
          </div>

          {/* Mini roster below */}
          {students.filter(s => s.status !== null).length > 0 && (
            <div style={{ marginTop: 24, border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ background: "#f9fafb", padding: "8px 14px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#9ca3af" }}>
                Marked so far
              </div>
              {students.filter(s => s.status !== null).map((s, i) => (
                <div key={s.studentId} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "9px 14px", borderTop: i > 0 ? "1px solid #f3f4f6" : "none",
                  background: "#fff",
                }}>
                  <span style={{ fontSize: 13, color: "#374151" }}>{s.username}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 20,
                    background: s.status === "PRESENT" ? "#dcfce7" : "#fee2e2",
                    color:      s.status === "PRESENT" ? "#16a34a"  : "#dc2626",
                  }}>
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function CompletionScreen({ students, present, absent, saving, saved, saveError, onSave, onPrev, currentIndex }: {
  students: StudentRow[];
  present: number; absent: number;
  saving: boolean; saved: boolean; saveError: string | null;
  onSave: () => void; onPrev: () => void; currentIndex: number;
}) {
  return (
    <div>
      <div style={{
        background: "#f0fdf4", border: "2px solid #bbf7d0",
        borderRadius: 20, padding: "40px 32px", textAlign: "center",
        maxWidth: 480, margin: "0 auto 24px",
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
        <h2 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 900, color: "#111827" }}>All Students Marked!</h2>
        <p style={{ margin: "0 0 24px", fontSize: 14, color: "#6b7280" }}>
          Review the summary below and save attendance.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 24 }}>
          <div style={{ background: "#dcfce7", borderRadius: 12, padding: "14px 24px" }}>
            <p style={{ margin: 0, fontSize: 28, fontWeight: 900, color: "#16a34a" }}>{present}</p>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#15803d", fontWeight: 600 }}>Present</p>
          </div>
          <div style={{ background: "#fee2e2", borderRadius: 12, padding: "14px 24px" }}>
            <p style={{ margin: 0, fontSize: 28, fontWeight: 900, color: "#dc2626" }}>{absent}</p>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#b91c1c", fontWeight: 600 }}>Absent</p>
          </div>
        </div>

        {saveError && (
          <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#dc2626" }}>
            ⚠ {saveError}
          </div>
        )}

        {saved ? (
          <div style={{ background: "#dcfce7", borderRadius: 10, padding: "14px", fontSize: 15, fontWeight: 700, color: "#16a34a" }}>
            ✓ Attendance saved successfully
          </div>
        ) : (
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button onClick={onPrev} style={{
              padding: "11px 20px", borderRadius: 8,
              border: "1.5px solid #e5e7eb", background: "#fff",
              fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#374151",
            }}>
              <ChevronLeft size={14} style={{ display: "inline", marginRight: 4 }} />
              Edit Last
            </button>
            <button onClick={onSave} disabled={saving} style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "11px 28px", borderRadius: 8, border: "none",
              background: saving ? "#d1d5db" : "#111827", color: "#fff",
              fontSize: 14, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer",
            }}>
              <Save size={15} />
              {saving ? "Saving..." : "Save Attendance"}
            </button>
          </div>
        )}
      </div>

      {/* Full roster */}
      <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ background: "#f9fafb", padding: "10px 16px", fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "#9ca3af" }}>
          Full Attendance List ({students.length})
        </div>
        {students.map((s, i) => (
          <div key={s.studentId} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "11px 16px", borderTop: "1px solid #f3f4f6",
            background: i % 2 === 0 ? "#fff" : "#fafafa",
          }}>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: "#111827" }}>{s.username}</p>
              <p style={{ margin: "2px 0 0", fontSize: 11, color: "#9ca3af" }}>{s.email}</p>
            </div>
            <span style={{
              fontSize: 11, fontWeight: 800, padding: "3px 12px", borderRadius: 20,
              background: s.status === "PRESENT" ? "#dcfce7" : "#fee2e2",
              color:      s.status === "PRESENT" ? "#16a34a"  : "#dc2626",
            }}>
              {s.status ?? "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
