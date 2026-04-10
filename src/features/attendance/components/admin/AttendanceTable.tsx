"use client";

import { useState } from "react";
import { Pencil, Trash2, Search, Filter } from "lucide-react";
import { STATUS_CONFIG } from "../../types/attendance.types";
import type { AttendanceRecord, AttendanceStatus } from "../../types/attendance.types";

import ConfirmDelete from "./ConfirmDelete";
import EditAttendanceModal from "./EditAttendanceModal";


interface Props {
  records:  AttendanceRecord[];
  loading:  boolean;
  onEdit:   (id: string, status: AttendanceStatus) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

type FilterStatus = AttendanceStatus | "ALL";

export default function AttendanceTable({ records, loading, onEdit, onDelete }: Props) {
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("ALL");
  const [dateFrom,     setDateFrom]     = useState("");
  const [dateTo,       setDateTo]       = useState("");
  const [editTarget,   setEditTarget]   = useState<AttendanceRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AttendanceRecord | null>(null);

  const filtered = records.filter(r => {
    const q          = search.toLowerCase();
    const matchSearch = !search ||
      r.student.username.toLowerCase().includes(q) ||
      (r.student.class?.name ?? "").toLowerCase().includes(q);
    const matchStatus = statusFilter === "ALL" || r.status === statusFilter;
    let matchDate = true;
    if (dateFrom) matchDate = matchDate && new Date(r.date) >= new Date(dateFrom);
    if (dateTo)   matchDate = matchDate && new Date(r.date) <= new Date(dateTo);
    return matchSearch && matchStatus && matchDate;
  });

  return (
    <div>
      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
          <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
          <input
            placeholder="Search student or class..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ ...inputSt, paddingLeft: 30, width: "100%" }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Filter size={13} color="#9ca3af" />
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={inputSt} />
          <span style={{ fontSize: 12, color: "#9ca3af" }}>to</span>
          <input type="date" value={dateTo}   onChange={e => setDateTo(e.target.value)}   style={inputSt} />
        </div>
      </div>

      {/* Status Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {(["ALL", "PRESENT", "ABSENT", "LATE", "EXCUSED"] as const).map(s => {
          const count  = s === "ALL" ? filtered.length : filtered.filter(r => r.status === s).length;
          const active = statusFilter === s;
          const cfg    = s !== "ALL" ? STATUS_CONFIG[s] : null;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                padding: "5px 14px", borderRadius: 20,
                border:     `1.5px solid ${active ? (cfg?.color ?? "#111827") : "#e5e7eb"}`,
                background: active ? (cfg?.bg ?? "#111827") : "#fff",
                color:      active ? (cfg?.color ?? "#fff")  : "#6b7280",
                fontSize: 12, fontWeight: 700, cursor: "pointer",
              }}
            >
              {s === "ALL" ? "All" : STATUS_CONFIG[s].label} ({count})
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
              {["Student", "Class", "Date", "Time", "Status", "Actions"].map(h => (
                <th key={h} style={thSt}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  {[...Array(6)].map((_, j) => (
                    <td key={j} style={{ padding: "13px 16px" }}>
                      <div style={{ height: 12, background: "#f3f4f6", borderRadius: 4 }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 48, textAlign: "center", color: "#9ca3af" }}>
                  No records found
                </td>
              </tr>
            ) : (
              filtered.map((r, i) => {
                const cfg  = STATUS_CONFIG[r.status];
                const date = new Date(r.date);
                return (
                  <tr
                    key={r.id}
                    style={{ borderBottom: i < filtered.length - 1 ? "1px solid #f3f4f6" : "none", background: i % 2 === 0 ? "#fff" : "#fafafa" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#f0f9ff")}
                    onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#fafafa")}
                  >
                    <td style={tdSt}>
                      <p style={{ margin: 0, fontWeight: 700, color: "#111827" }}>{r.student.username}</p>
                      <p style={{ margin: "2px 0 0", fontSize: 11, color: "#9ca3af" }}>#{r.student.id.slice(0, 10)}</p>
                    </td>
                    <td style={tdSt}>
                      <span style={{ fontSize: 12, fontWeight: 600, background: "#eff6ff", color: "#3b82f6", padding: "3px 8px", borderRadius: 6 }}>
                        {r.student.class?.name ?? r.session?.class?.name ?? "—"}
                      </span>
                    </td>
                    <td style={tdSt}>{date.toLocaleDateString("en-GB")}</td>
                    <td style={tdSt}>{date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</td>
                    <td style={tdSt}>
                      <span style={{ fontSize: 11, fontWeight: 800, background: cfg.bg, color: cfg.color, padding: "3px 10px", borderRadius: 20 }}>
                        {cfg.label.toUpperCase()}
                      </span>
                    </td>
                    <td style={tdSt}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => setEditTarget(r)}   style={editBtnSt}><Pencil size={12} /> Edit</button>
                        <button onClick={() => setDeleteTarget(r)} style={delBtnSt}><Trash2  size={12} /> Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {editTarget && (
        <EditAttendanceModal
          record={editTarget}
          onClose={() => setEditTarget(null)}
          onSave={async (id, status) => { await onEdit(id, status); setEditTarget(null); }}
        />
      )}
      {deleteTarget && (
        <ConfirmDelete
          label={`record for ${deleteTarget.student.username}`}
          onClose={() => setDeleteTarget(null)}
          onConfirm={async () => { await onDelete(deleteTarget.id); setDeleteTarget(null); }}
        />
      )}
    </div>
  );
}

const inputSt: React.CSSProperties = { padding: "7px 12px", borderRadius: 8, border: "1.5px solid #e5e7eb", fontSize: 13, color: "#374151", outline: "none", background: "#fff" };
const thSt:    React.CSSProperties = { padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#9ca3af" };
const tdSt:    React.CSSProperties = { padding: "12px 16px", color: "#374151" };
const editBtnSt: React.CSSProperties = { display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 6, border: "1.5px solid #e5e7eb", background: "#fff", fontSize: 12, fontWeight: 600, color: "#374151", cursor: "pointer" };
const delBtnSt:  React.CSSProperties = { display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 6, border: "1.5px solid #fee2e2", background: "#fff", fontSize: 12, fontWeight: 600, color: "#dc2626",  cursor: "pointer" };