"use client";

import { useState } from "react";
import { RefreshCw, Plus } from "lucide-react";
import { useSession } from "@/features/attendance/hooks/usesession";
import TeacherSessionList   from "./TeacherSessionList";
import TeacherSessionDetail from "./TeacherSessionDetail";
import CreateSessionModal   from "./CreateSessionModal";
import type { SessionRecord } from "../../types/attendance.types";

export default function TeacherAttendance() {
  const { sessions, loading, error, refresh, createSession, endSession, deleteSession } =
    useSession();

  const [activeSession, setActiveSession] = useState<SessionRecord | null>(null);
  const [showCreate,    setShowCreate]    = useState(false);

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1200, fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#9ca3af" }}>
            Teacher · Attendance
          </p>
          <h1 style={{ margin: "4px 0 0", fontSize: 22, fontWeight: 900, color: "#111827" }}>
            {activeSession ? `Session: ${activeSession.class.name}` : "My Sessions"}
          </h1>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {activeSession ? (
            <button onClick={() => setActiveSession(null)} style={outlineBtnSt}>
              ← Back to Sessions
            </button>
          ) : (
            <>
              <button onClick={refresh} style={outlineBtnSt}>
                <RefreshCw size={14} /> Refresh
              </button>
              <button onClick={() => setShowCreate(true)} style={primaryBtnSt}>
                <Plus size={14} /> New Session
              </button>
            </>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#dc2626" }}>
          ⚠ {error}
        </div>
      )}

      {/* Content */}
      {activeSession ? (
        <TeacherSessionDetail
          session={activeSession}
          onEnd={async () => { await endSession(activeSession.id); setActiveSession(null); }}
          onRefresh={refresh}
        />
      ) : (
        <TeacherSessionList
          sessions={sessions}
          loading={loading}
          onOpen={setActiveSession}
          onEnd={endSession}
          onDelete={deleteSession}
        />
      )}

      {/* Create Session Modal */}
      {showCreate && (
        <CreateSessionModal
          onClose={() => setShowCreate(false)}
          onCreate={async (payload) => {
            const s = await createSession(payload);
            if (s) { setShowCreate(false); setActiveSession(s); }
          }}
        />
      )}
    </div>
  );
}

const outlineBtnSt: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 6,
  padding: "8px 16px", borderRadius: 8,
  border: "1.5px solid #e5e7eb", background: "#fff",
  fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#374151",
};
const primaryBtnSt: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 6,
  padding: "8px 16px", borderRadius: 8,
  border: "none", background: "#111827",
  fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#fff",
};