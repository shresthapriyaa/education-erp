"use client";

import { useTeacherAttendance } from "@/features/attendance/hooks/useTeacherAttendance";
import ClassCard      from "./ClassCard";
import StudentSwiper  from "./StudentSwiper";

export default function TeacherAttendance() {
  const {
    classes, classesLoading, classesError,
    activeClass, resetClass,
    students, studentsLoading, studentsError,
    currentIndex, isComplete,
    geoState, geoError, geoDistance,
    saving, saved, saveError,
    selectClass, markStudent, prevStudent, saveAttendance,
  } = useTeacherAttendance();

  // Helper to retry location for the same class
  const retryLocation = () => {
    if (activeClass) selectClass(activeClass);
  };

  return (
    <div style={{ padding: "28px 32px", maxWidth: 900, fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#9ca3af" }}>
            Teacher · Attendance
          </p>
          <h1 style={{ margin: "4px 0 0", fontSize: 22, fontWeight: 900, color: "#111827" }}>
            {activeClass ? `Attendance — ${activeClass.name}` : "My Classes"}
          </h1>
        </div>
        {activeClass && (
          <button onClick={resetClass} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 16px", borderRadius: 8,
            border: "1.5px solid #e5e7eb", background: "#fff",
            fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#374151",
          }}>
            ← Back to Classes
          </button>
        )}
      </div>

      {classesError && (
        <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#dc2626" }}>
          ⚠ {classesError}
        </div>
      )}

      {/* Class list */}
      {!activeClass && (
        <div>
          {classesLoading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[...Array(3)].map((_, i) => (
                <div key={i} style={{ height: 80, background: "#f3f4f6", borderRadius: 12 }} />
              ))}
            </div>
          ) : classes.length === 0 ? (
            <div style={{ textAlign: "center", padding: 64, color: "#9ca3af" }}>
              <p style={{ fontSize: 16, fontWeight: 600 }}>No classes assigned yet</p>
              <p style={{ fontSize: 13 }}>Ask your admin to assign classes to you</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {classes.map(cls => (
                <ClassCard key={cls.id} cls={cls} onSelect={selectClass} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Geofence states */}
      {activeClass && geoState === "requesting" && (
        <GeoCard
          icon="📍"
          title="Requesting Location Access"
          message="Please click 'Allow' when your browser asks for location permission. This is required to verify you are within the school zone."
          color="#6366f1"
          bg="#eef2ff"
        />
      )}

      {activeClass && geoState === "verifying" && (
        <GeoCard
          icon="🔍"
          title="Verifying Location"
          message="Checking if you are within the school zone..."
          color="#0891b2"
          bg="#ecfeff"
        />
      )}

      {activeClass && geoState === "failed" && (
        <div style={{ background: "#fef2f2", border: "1.5px solid #fca5a5", borderRadius: 14, padding: "28px 32px", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🚫</div>
          <h2 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 800, color: "#dc2626" }}>Location Verification Failed</h2>
          <p style={{ margin: "0 0 20px", fontSize: 14, color: "#7f1d1d", maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}>
            {geoError}
          </p>
          {geoDistance !== null && (
            <p style={{ margin: "0 0 20px", fontSize: 13, color: "#6b7280" }}>
              Distance from school: <strong>{geoDistance}m</strong>
            </p>
          )}
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button onClick={resetClass} style={{
              padding: "10px 24px", borderRadius: 8,
              border: "1.5px solid #e5e7eb", background: "#fff",
              fontSize: 14, fontWeight: 600, cursor: "pointer", color: "#374151",
            }}>
              ← Back to Classes
            </button>
            <button onClick={retryLocation} style={{
              padding: "10px 24px", borderRadius: 8, border: "none",
              background: "#6366f1", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
            }}>
              🔄 Try Again
            </button>
          </div>
        </div>
      )}

      {/* Attendance taking */}
      {activeClass && geoState === "success" && (
        <StudentSwiper
          cls={activeClass}
          students={students}
          loading={studentsLoading}
          error={studentsError}
          currentIndex={currentIndex}
          isComplete={isComplete}
          saving={saving}
          saved={saved}
          saveError={saveError}
          geoDistance={geoDistance}
          onMark={markStudent}
          onPrev={prevStudent}
          onSave={saveAttendance}
        />
      )}
    </div>
  );
}

function GeoCard({ icon, title, message, color, bg }: {
  icon: string; title: string; message: string; color: string; bg: string;
}) {
  return (
    <div style={{ background: bg, border: `1.5px solid ${color}30`, borderRadius: 14, padding: "40px 32px", textAlign: "center" }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
      <h2 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 800, color }}>{title}</h2>
      <p style={{ margin: 0, fontSize: 14, color: "#6b7280" }}>{message}</p>
      <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
        <div style={{ width: 32, height: 32, border: `3px solid ${color}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
