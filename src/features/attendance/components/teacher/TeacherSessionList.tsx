"use client";

import { Users, Clock, CheckCircle, Trash2, PlayCircle, StopCircle } from "lucide-react";
import type { SessionRecord } from "../../types/attendance.types";

interface Props {
  sessions: SessionRecord[];
  loading:  boolean;
  onOpen:   (s: SessionRecord) => void;
  onEnd:    (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function TeacherSessionList({ sessions, loading, onOpen, onEnd, onDelete }: Props) {
  if (loading) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ height: 160, background: "#f3f4f6", borderRadius: 12, animation: "pulse 1.5s infinite" }} />
        ))}
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "64px 0", color: "#9ca3af" }}>
        <PlayCircle size={40} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
        <p style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>No sessions yet</p>
        <p style={{ fontSize: 13, margin: "6px 0 0" }}>Create a new session to start taking attendance</p>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
      {sessions.map(s => {
        const date = new Date(s.startTime);
        return (
          <div
            key={s.id}
            style={{
              background: "#fff", borderRadius: 12,
              border: `2px solid ${s.isOpen ? "#22c55e" : "#e5e7eb"}`,
              padding: 20, position: "relative", overflow: "hidden",
            }}
          >
            {/* Open badge */}
            {s.isOpen && (
              <div style={{
                position: "absolute", top: 12, right: 12,
                background: "#dcfce7", color: "#16a34a",
                fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 20,
                textTransform: "uppercase", letterSpacing: "0.06em",
              }}>
                ● Live
              </div>
            )}

            <div style={{ marginBottom: 12 }}>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#111827" }}>
                {s.class.name}
              </p>
              <p style={{ margin: "3px 0 0", fontSize: 12, color: "#6b7280" }}>
                {s.school.name}
              </p>
            </div>

            <div style={{ display: "flex", gap: 16, marginBottom: 16, fontSize: 12, color: "#6b7280" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Clock size={12} />
                {date.toLocaleDateString("en-GB")} {date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Users size={12} />
                {s._count.attendance} marked
              </span>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => onOpen(s)}
                style={{
                  flex: 1, padding: "8px 0", borderRadius: 8,
                  border: "none",
                  background: s.isOpen ? "#111827" : "#f3f4f6",
                  color: s.isOpen ? "#fff" : "#374151",
                  fontSize: 12, fontWeight: 700, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                }}
              >
                <CheckCircle size={13} />
                {s.isOpen ? "Take Attendance" : "View Records"}
              </button>

              {s.isOpen && (
                <button
                  onClick={() => onEnd(s.id)}
                  title="End session"
                  style={{ padding: "8px 12px", borderRadius: 8, border: "1.5px solid #fca5a5", background: "#fff", color: "#dc2626", cursor: "pointer" }}
                >
                  <StopCircle size={14} />
                </button>
              )}

              <button
                onClick={() => onDelete(s.id)}
                title="Delete session"
                style={{ padding: "8px 12px", borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", color: "#6b7280", cursor: "pointer" }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}