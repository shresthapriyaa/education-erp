// src/app/admin/attendance/sessions/page.tsx

"use client";

// import { useSession } from "@/features/attendance/hooks/useSession";
import SessionsTable  from "@/features/attendance/components/admin/SessionsTable";
import { useSession } from "@/features/attendance/hooks/usesession";

export default function AdminSessionsPage() {
  const { sessions, loading, error, deleteSession } = useSession();

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1200, fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <div style={{ marginBottom: 24 }}>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#9ca3af" }}>Admin · Attendance</p>
        <h1 style={{ margin: "4px 0 0", fontSize: 22, fontWeight: 900, color: "#111827" }}>All Sessions</h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>Every session created by all teachers</p>
      </div>

      {error && (
        <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#dc2626" }}>
          ⚠ {error}
        </div>
      )}

      <SessionsTable sessions={sessions} loading={loading} onDelete={deleteSession} />
    </div>
  );
}