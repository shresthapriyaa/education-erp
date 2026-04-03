
"use client";

import { Users, ChevronRight } from "lucide-react";
import type { ClassItem } from "../../hooks/useTeacherAttendance";

interface Props {
  cls:      ClassItem;
  onSelect: (cls: ClassItem) => void;
}

export default function ClassCard({ cls, onSelect }: Props) {
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
      <div>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#111827" }}>
          {cls.name}
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
          <Users size={13} color="#9ca3af" />
          <span style={{ fontSize: 13, color: "#6b7280" }}>
            {cls._count.students} students
          </span>
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
