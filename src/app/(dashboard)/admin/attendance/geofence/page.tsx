// src/app/admin/attendance/geofence/page.tsx

"use client";

import GeofenceSettingsForm from "@/features/attendance/components/admin/GeofenceSettingsForm";
import { useGeofenceSettings } from "@/features/attendance/hooks/useGeofenceSettings";

export default function AdminGeofencePage() {
  const { settings, loading, saving, error, update } = useGeofenceSettings();

  return (
    <div style={{ padding: "28px 32px", maxWidth: 700, fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <div style={{ marginBottom: 28 }}>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#9ca3af" }}>Admin · Attendance</p>
        <h1 style={{ margin: "4px 0 0", fontSize: 22, fontWeight: 900, color: "#111827" }}>Geofence Settings</h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>Set school GPS center, teacher radius limits and late threshold</p>
      </div>

      {error && (
        <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 8, padding: "10px 14px", marginBottom: 20, fontSize: 13, color: "#dc2626" }}>
          ⚠ {error}
        </div>
      )}

      <GeofenceSettingsForm settings={settings} loading={loading} saving={saving} onSave={update} />
    </div>
  );
}