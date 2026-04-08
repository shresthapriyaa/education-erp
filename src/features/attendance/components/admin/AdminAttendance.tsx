"use client";

import { RefreshCw } from "lucide-react";
import { useAttendance } from "@/features/attendance/hooks/useAttendance";
import AttendanceSummary from "@/features/attendance/components/admin/AttendanceSummary";
import AttendanceTable from "@/features/attendance/components/admin/AttendanceTable";

export default function AdminAttendancePage() {
  const { records, stats, loading, error, refresh, editRecord, deleteRecord } =
    useAttendance();

  return (
    <div
      style={{
        padding: "28px 32px",
        maxWidth: 1200,
        fontFamily: "'DM Sans','Segoe UI',sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#9ca3af",
            }}
          >
            Admin · Attendance
          </p>
          <h1
            style={{
              margin: "4px 0 0",
              fontSize: 22,
              fontWeight: 900,
              color: "#111827",
            }}
          >
            Attendance Records
          </h1>
        </div>
        <button
          onClick={refresh}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 16px",
            borderRadius: 8,
            border: "1.5px solid #e5e7eb",
            background: "#fff",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {error && (
        <div
          style={{
            background: "#fee2e2",
            border: "1px solid #fca5a5",
            borderRadius: 8,
            padding: "10px 14px",
            marginBottom: 16,
            fontSize: 13,
            color: "#dc2626",
          }}
        >
          ⚠ {error}
        </div>
      )}

      <AttendanceSummary stats={stats} loading={loading} />
      <AttendanceTable
        records={records}
        loading={loading}
        onEdit={editRecord}
        onDelete={deleteRecord}
      />
    </div>
  );
}




