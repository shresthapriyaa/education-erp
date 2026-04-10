"use client";

import { Users, ChevronRight, BookOpen, Clock, User } from "lucide-react";
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
        cursor: "pointer", transition: "all 0.15s",
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "#111827")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "#e5e7eb")}
    >
      <div style={{ marginBottom: 12 }}>
        <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 800, color: "#111827" }}>
          Class {cls.name}
        </h3>
        
        {/* Teacher Name - Prominent Display */}
        {cls.teacher && (
          <div style={{ 
            display: "flex", alignItems: "center", gap: 6,
            background: "#f0fdf4", border: "1px solid #bbf7d0",
            padding: "6px 12px", borderRadius: 8, width: "fit-content",
          }}>
            <User size={14} color="#16a34a" />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#15803d" }}>
              Teacher: {cls.teacher.username}
            </span>
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
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
            <Clock size={13} color="#3b82f6" />
            <span style={{ fontSize: 13, color: "#3b82f6", fontWeight: 600 }}>
              Today: {new Date(todaySchedule.startTime).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
              })}
            </span>
          </div>
        )}
      </div>

      <div style={{
        background: "#111827", color: "#fff",
        padding: "10px 20px", borderRadius: 8,
        fontSize: 14, fontWeight: 700,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      }}>
        Take Attendance <ChevronRight size={16} />
      </div>
    </div>
  );
}
