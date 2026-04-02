"use client";

import { useState } from "react";
import { Trash2, Eye, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import type { SessionRecord } from "../../types/attendance.types";
import ConfirmDelete from "./ConfirmDelete";

interface Props {
  sessions: SessionRecord[];
  loading: boolean;
  onDelete: (id: string) => Promise<void>;
}

export default function SessionsTable({ sessions, loading, onDelete }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<SessionRecord | null>(null);

  const filtered = sessions.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.class.name.toLowerCase().includes(q) ||
      (s.teacher?.username ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div style={{ position: "relative", maxWidth: 320, marginBottom: 16 }}>
        <Search
          size={13}
          style={{
            position: "absolute",
            left: 10,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#9ca3af",
          }}
        />
        <input
          placeholder="Search class or teacher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "8px 12px 8px 30px",
            borderRadius: 8,
            border: "1.5px solid #e5e7eb",
            fontSize: 13,
            outline: "none",
            width: "100%",
          }}
        />
      </div>

      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
        >
          <thead>
            <tr
              style={{
                background: "#f9fafb",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              {[
                "Class",
                "Teacher",
                "Date",
                "Start",
                "End",
                "Radius",
                "Students",
                "Status",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "10px 14px",
                    textAlign: "left",
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    color: "#9ca3af",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(4)].map((_, i) => (
                <tr key={i}>
                  {[...Array(9)].map((_, j) => (
                    <td key={j} style={{ padding: "13px 14px" }}>
                      <div
                        style={{
                          height: 12,
                          background: "#f3f4f6",
                          borderRadius: 4,
                        }}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  style={{ padding: 48, textAlign: "center", color: "#9ca3af" }}
                >
                  No sessions found
                </td>
              </tr>
            ) : (
              filtered.map((s, i) => {
                const start = new Date(s.startTime);
                const end = s.endTime ? new Date(s.endTime) : null;
                return (
                  <tr
                    key={s.id}
                    style={{
                      borderBottom:
                        i < filtered.length - 1 ? "1px solid #f3f4f6" : "none",
                      background: i % 2 === 0 ? "#fff" : "#fafafa",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#f0f9ff")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        i % 2 === 0 ? "#fff" : "#fafafa")
                    }
                  >
                    <td
                      style={{
                        padding: "12px 14px",
                        fontWeight: 700,
                        color: "#111827",
                      }}
                    >
                      {s.class.name}
                    </td>
                    <td style={{ padding: "12px 14px", color: "#6b7280" }}>
                      {s.teacher?.username ?? "—"}
                    </td>
                    <td style={{ padding: "12px 14px", color: "#374151" }}>
                      {new Date(s.date).toLocaleDateString("en-GB")}
                    </td>
                    <td style={{ padding: "12px 14px", color: "#374151" }}>
                      {start.toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td style={{ padding: "12px 14px", color: "#374151" }}>
                      {end
                        ? end.toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </td>
                    <td style={{ padding: "12px 14px", color: "#374151" }}>
                      {s.radiusMeters}m
                    </td>
                    <td
                      style={{
                        padding: "12px 14px",
                        fontWeight: 700,
                        color: "#111827",
                      }}
                    >
                      {s._count.attendance}
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "3px 10px",
                          borderRadius: 20,
                          background: s.isOpen ? "#dcfce7" : "#f3f4f6",
                          color: s.isOpen ? "#16a34a" : "#6b7280",
                        }}
                      >
                        {s.isOpen ? "● Live" : "Ended"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          onClick={() =>
                            router.push(`/admin/attendance/sessions/${s.id}`)
                          }
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            padding: "5px 10px",
                            borderRadius: 6,
                            border: "1.5px solid #e5e7eb",
                            background: "#fff",
                            fontSize: 12,
                            fontWeight: 600,
                            color: "#374151",
                            cursor: "pointer",
                          }}
                        >
                          <Eye size={12} /> View
                        </button>
                        <button
                          onClick={() => setDeleteTarget(s)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            padding: "5px 10px",
                            borderRadius: 6,
                            border: "1.5px solid #fee2e2",
                            background: "#fff",
                            fontSize: 12,
                            fontWeight: 600,
                            color: "#dc2626",
                            cursor: "pointer",
                          }}
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {deleteTarget && (
        <ConfirmDelete
          label={`session for ${deleteTarget.class.name}`}
          onClose={() => setDeleteTarget(null)}
          onConfirm={async () => {
            await onDelete(deleteTarget.id);
            setDeleteTarget(null);
          }}
        />
      )}
    </div>
  );
}
