"use client";

import { Users, ChevronRight, BookOpen, Clock } from "lucide-react";
import type { ClassItem } from "../../hooks/useTeacherAttendance";

interface Props {
  cls:      ClassItem;
  onSelect: (cls: ClassItem) => void;
}

export default function ClassCard({ cls, onSelect }: Props) {
  // Get unique subjects from schedules
  const subjects = cls.schedules
    ? [...new Set(cls.schedules.map(s => s.subject.name))].slice(0, 2)
    : [];

  // Get today's schedule if available
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const todaySchedule = cls.schedules?.find(s => s.day === today);

  return (
    <div
      onClick={() => onSelect(cls)}
      style={{
        background: "#fff", border: "1.5px solid #e5e7eb",
        borderRadius: 12, padding: "20px 24px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        cursor: "pointer", transition: "all 0.15s",
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "#111827")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "#e5e7eb")}
    >
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#111827" }}>
            {cls.name}
          </h3>
          {cls.teacher && (
            <span style={{
              fontSize: 11, fontWeight: 600, padding: "2px 8px",
              borderRadius: 12, background: "#f3f4f6", color: "#6b7280",
            }}>
              {cls.teacher.username}
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Users size={13} color="#9ca3af" />
            <span style={{ fontSize: 13, color: "#6b7280" }}>
              {cls._count.students} students
            </span>
          </div>

          {subjects.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <BookOpen size={13} color="#9ca3af" />
              <span style={{ fontSize: 13, color: "#6b7280" }}>
                {subjects.join(", ")}
              </span>
            </div>
          )}

          {todaySchedule && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Clock size={13} color="#16a34a" />
              <span style={{ fontSize: 13, color: "#16a34a", fontWeight: 600 }}>
                Today: {new Date(todaySchedule.startTime).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: true 
                })}
              </span>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          background: "#111827", color: "#fff",
          padding: "8px 16px", borderRadius: 8,
          fontSize: 13, fontWeight: 700,
          display: "flex", alignItems: "center", gap: 6,
        }}>
          Take Attendance <ChevronRight size={14} />
        </div>
      </div>
    </div>
  );
}
