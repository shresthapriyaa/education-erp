"use client";

import { useState } from "react";
import { X, Check } from "lucide-react";
import { STATUS_CONFIG } from "../../types/attendance.types";
import type {
  AttendanceRecord,
  AttendanceStatus,
} from "../../types/attendance.types";

interface Props {
  record: AttendanceRecord;
  onClose: () => void;
  onSave: (id: string, status: AttendanceStatus) => Promise<void>;
}

export default function EditAttendanceModal({
  record,
  onClose,
  onSave,
}: Props) {
  const [status, setStatus] = useState<AttendanceStatus>(record.status);
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setLoading(true);
    await onSave(record.id, status);
    setLoading(false);
  }

  return (
    <div style={overlay}>
      <div style={modal}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 20,
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 17,
                fontWeight: 800,
                color: "#111827",
              }}
            >
              Edit Attendance
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>
              {record.student.username} ·{" "}
              {new Date(record.date).toLocaleDateString("en-GB")}
            </p>
          </div>
          <button onClick={onClose} style={iconBtn}>
            <X size={16} />
          </button>
        </div>

        {record.student.class && (
          <div
            style={{
              background: "#eff6ff",
              borderRadius: 8,
              padding: "9px 13px",
              marginBottom: 16,
              fontSize: 13,
              color: "#1d4ed8",
            }}
          >
            📚 Class: <strong>{record.student.class.name}</strong>
          </div>
        )}

        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#9ca3af",
            margin: "0 0 10px",
          }}
        >
          Select Status
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            marginBottom: 22,
          }}
        >
          {(Object.keys(STATUS_CONFIG) as AttendanceStatus[]).map((s) => {
            const cfg = STATUS_CONFIG[s];
            const sel = status === s;
            return (
              <button
                key={s}
                onClick={() => setStatus(s)}
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  border: `2px solid ${sel ? cfg.color : "#e5e7eb"}`,
                  background: sel ? cfg.bg : "#fff",
                  color: sel ? cfg.color : "#6b7280",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {sel && <Check size={13} />}
                {cfg.label}
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ ...outlineBtn, flex: 1 }}>
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            style={{
              ...primaryBtn,
              flex: 1,
              background: STATUS_CONFIG[status].color,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 50,
  backdropFilter: "blur(4px)",
};
const modal: React.CSSProperties = {
  background: "#fff",
  borderRadius: 16,
  padding: 26,
  width: "100%",
  maxWidth: 440,
  boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
};
const iconBtn: React.CSSProperties = {
  width: 30,
  height: 30,
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  background: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  color: "#6b7280",
};
const primaryBtn: React.CSSProperties = {
  padding: "10px 0",
  borderRadius: 8,
  border: "none",
  color: "#fff",
  fontSize: 13,
  fontWeight: 700,
  cursor: "pointer",
};
const outlineBtn: React.CSSProperties = {
  padding: "10px 0",
  borderRadius: 8,
  border: "1.5px solid #e5e7eb",
  background: "#fff",
  fontSize: 13,
  fontWeight: 600,
  color: "#374151",
  cursor: "pointer",
};
