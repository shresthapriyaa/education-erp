// src/app/admin/attendance/sessions/[sessionId]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, MapPin, Users, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { STATUS_CONFIG } from "@/features/attendance/types/attendance.types";
import type { AttendanceRecord } from "@/features/attendance/types/attendance.types";

type SessionDetail = {
  id: string; date: string; startTime: string; endTime?: string | null;
  isOpen: boolean; radiusMeters: number; lateThresholdMin: number;
  class: { id: string; name: string };
  school: { id: string; name: string };
  teacher?: { id: string; username: string } | null;
  attendance: AttendanceRecord[];
};

export default function SessionDetailPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const router = useRouter();
  const [session,  setSession]  = useState<SessionDetail | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/attendance/sessions/${sessionId}`)
      .then(r => { if (!r.ok) throw new Error("Failed to load session"); return r.json(); })
      .then(setSession)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) return (
    <div style={{ padding: "28px 32px" }}>
      {[1,2,3].map(i => <div key={i} style={{ height: 60, background: "#f3f4f6", borderRadius: 10, marginBottom: 12 }} />)}
    </div>
  );

  if (error) return (
    <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <AlertCircle size={40} color="#dc2626" />
      <p style={{ color: "#dc2626" }}>{error}</p>
      <button onClick={() => router.back()} style={{ padding: "8px 16px", borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", cursor: "pointer" }}>Go Back</button>
    </div>
  );

  if (!session) return null;

  const present = session.attendance.filter(a => a.status === "PRESENT").length;
  const absent  = session.attendance.filter(a => a.status === "ABSENT").length;
  const late    = session.attendance.filter(a => a.status === "LATE").length;
  const total   = session.attendance.length;
  const rate    = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1100, fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <button onClick={() => router.back()} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6b7280", background: "none", border: "none", cursor: "pointer", marginBottom: 20, padding: 0 }}>
        <ArrowLeft size={15} /> Back to Sessions
      </button>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#9ca3af" }}>Admin · Sessions</p>
          <h1 style={{ margin: "4px 0 0", fontSize: 22, fontWeight: 900, color: "#111827" }}>{session.class.name}</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>
            {new Date(session.date).toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, padding: "5px 14px", borderRadius: 20, background: session.isOpen ? "#dcfce7" : "#f3f4f6", color: session.isOpen ? "#16a34a" : "#6b7280" }}>
          {session.isOpen ? "● Live" : "Ended"}
        </span>
      </div>

      {/* Info Strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { icon: <Clock size={14} color="#6366f1" />,  label: "Start",   value: new Date(session.startTime).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) },
          { icon: <Clock size={14} color="#9ca3af" />,  label: "End",     value: session.endTime ? new Date(session.endTime).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "—" },
          { icon: <MapPin size={14} color="#ea580c" />, label: "Radius",  value: `${session.radiusMeters}m` },
          { icon: <Users size={14} color="#0891b2" />,  label: "Teacher", value: session.teacher?.username ?? "—" },
        ].map(item => (
          <div key={item.label} style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10, padding: "12px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              {item.icon}
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "#9ca3af" }}>{item.label}</span>
            </div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#111827" }}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total",   value: total,   color: "#374151", bg: "#f9fafb" },
          { label: "Present", value: present, color: "#16a34a", bg: "#f0fdf4" },
          { label: "Absent",  value: absent,  color: "#dc2626", bg: "#fef2f2" },
          { label: "Late",    value: late,    color: "#ca8a04", bg: "#fefce8" },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, border: "1px solid #e5e7eb", borderRadius: 10, padding: "14px 18px" }}>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#9ca3af" }}>{s.label}</p>
            <p style={{ margin: "4px 0 0", fontSize: 28, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Rate bar */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Attendance Rate</span>
          <span style={{ fontSize: 12, fontWeight: 800, color: rate >= 75 ? "#16a34a" : "#dc2626" }}>{rate}%</span>
        </div>
        <div style={{ height: 8, background: "#e5e7eb", borderRadius: 8, overflow: "hidden" }}>
          <div style={{ height: "100%", borderRadius: 8, width: `${rate}%`, background: rate >= 75 ? "#16a34a" : rate >= 50 ? "#ca8a04" : "#dc2626", transition: "width 0.5s ease" }} />
        </div>
      </div>

      {/* Attendance Table */}
      <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb", padding: "12px 16px" }}>
          <h2 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#111827" }}>Attendance List ({total})</h2>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
              {["Student", "Status", "Check-in Time", "Distance", "GPS Accuracy", "Within School"].map(h => (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#9ca3af" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {session.attendance.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 48, textAlign: "center", color: "#9ca3af" }}>No attendance records for this session</td></tr>
            ) : (
              session.attendance.map((a, i) => {
                const cfg = STATUS_CONFIG[a.status];
                return (
                  <tr key={a.id} style={{ borderBottom: i < session.attendance.length - 1 ? "1px solid #f3f4f6" : "none", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <p style={{ margin: 0, fontWeight: 700, color: "#111827" }}>{a.student.username}</p>
                      <p style={{ margin: "2px 0 0", fontSize: 11, color: "#9ca3af" }}>{a.student.email}</p>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: 11, fontWeight: 800, background: cfg.bg, color: cfg.color, padding: "3px 10px", borderRadius: 20 }}>{cfg.label.toUpperCase()}</span>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#374151" }}>{new Date(a.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</td>
                    <td style={{ padding: "12px 16px", color: "#374151" }}>{a.distanceFromCenter != null ? `${Math.round(a.distanceFromCenter)}m` : "—"}</td>
                    <td style={{ padding: "12px 16px" }}>
                      {a.gpsAccuracy != null ? (
                        <span style={{ fontSize: 11, fontWeight: 600, color: a.gpsAccuracy <= 20 ? "#16a34a" : a.gpsAccuracy <= 50 ? "#ca8a04" : "#dc2626", background: a.gpsAccuracy <= 20 ? "#dcfce7" : a.gpsAccuracy <= 50 ? "#fef9c3" : "#fee2e2", padding: "2px 7px", borderRadius: 6 }}>
                          ±{Math.round(a.gpsAccuracy)}m
                        </span>
                      ) : "—"}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      {a.withinSchool ? <CheckCircle2 size={18} color="#16a34a" /> : <XCircle size={18} color="#dc2626" />}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}