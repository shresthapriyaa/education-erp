"use client";

import { useState, useEffect } from "react";
import { Save, MapPin } from "lucide-react";
import type {
  GeofenceSettings,
  UpdateGeofencePayload,
} from "../../types/attendance.types";

interface Props {
  settings: GeofenceSettings | null;
  loading: boolean;
  saving: boolean;
  onSave: (payload: UpdateGeofencePayload) => Promise<boolean>;
}

export default function GeofenceSettingsForm({
  settings,
  loading,
  saving,
  onSave,
}: Props) {
  const [minRadius, setMinRadius] = useState(50);
  const [maxRadius, setMaxRadius] = useState(500);
  const [lateMin, setLateMin] = useState(10);
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!settings) return;
    setMinRadius(settings.minRadiusMeters);
    setMaxRadius(settings.maxRadiusMeters);
    setLateMin(settings.lateThresholdMin);
    setLat(settings.latitude);
    setLng(settings.longitude);
  }, [settings]);

  async function handleSubmit() {
    const ok = await onSave({
      latitude: lat,
      longitude: lng,
      minRadiusMeters: minRadius,
      maxRadiusMeters: maxRadius,
      lateThresholdMin: lateMin,
    });
    if (ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  }

  if (loading)
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{ height: 56, background: "#f3f4f6", borderRadius: 10 }}
          />
        ))}
      </div>
    );

  return (
    <div style={{ maxWidth: 560 }}>
      {/* GPS Center */}
      <div style={sectionSt}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 14,
          }}
        >
          <MapPin size={15} color="#6366f1" />
          <h3
            style={{
              margin: 0,
              fontSize: 14,
              fontWeight: 700,
              color: "#111827",
            }}
          >
            School GPS Center
          </h3>
        </div>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <div>
            <label style={labelSt}>Latitude</label>
            <input
              type="number"
              step="any"
              value={lat}
              onChange={(e) => setLat(Number(e.target.value))}
              style={inputSt}
              placeholder="e.g. 27.7172"
            />
          </div>
          <div>
            <label style={labelSt}>Longitude</label>
            <input
              type="number"
              step="any"
              value={lng}
              onChange={(e) => setLng(Number(e.target.value))}
              style={inputSt}
              placeholder="e.g. 85.3240"
            />
          </div>
        </div>
        
        {/* Helper links */}
        <div style={{ marginTop: 12, padding: 12, background: "#f0f9ff", borderRadius: 8, fontSize: 12, color: "#0369a1" }}>
          <p style={{ margin: "0 0 8px", fontWeight: 600 }}>📍 How to get coordinates:</p>
          <p style={{ margin: "0 0 4px" }}>1. Open <a href="https://maps.google.com" target="_blank" style={{ color: "#0369a1", textDecoration: "underline" }}>Google Maps</a></p>
          <p style={{ margin: "0 0 4px" }}>2. Search for your school</p>
          <p style={{ margin: "0 0 4px" }}>3. Right-click on the school location</p>
          <p style={{ margin: "0 0 8px" }}>4. Copy the coordinates (first number = latitude, second = longitude)</p>
          {lat !== 0 && lng !== 0 && (
            <p style={{ margin: 0 }}>
              <a 
                href={`https://maps.google.com/?q=${lat},${lng}`} 
                target="_blank" 
                style={{ color: "#0369a1", textDecoration: "underline", fontWeight: 600 }}
              >
                🗺️ View current location on Google Maps
              </a>
            </p>
          )}
        </div>
      </div>

      {/* Radius Limits */}
      <div style={sectionSt}>
        <h3
          style={{
            margin: "0 0 6px",
            fontSize: 14,
            fontWeight: 700,
            color: "#111827",
          }}
        >
          Teacher Radius Limits
        </h3>
        <p style={{ margin: "0 0 14px", fontSize: 12, color: "#6b7280" }}>
          Teachers can only pick a radius between these values.
        </p>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <div>
            <label style={labelSt}>Min Radius (meters)</label>
            <input
              type="number"
              min={10}
              value={minRadius}
              onChange={(e) => setMinRadius(Number(e.target.value))}
              style={inputSt}
            />
            <p style={hintSt}>Smallest radius teacher can set</p>
          </div>
          <div>
            <label style={labelSt}>Max Radius (meters)</label>
            <input
              type="number"
              min={minRadius + 10}
              value={maxRadius}
              onChange={(e) => setMaxRadius(Number(e.target.value))}
              style={inputSt}
            />
            <p style={hintSt}>Largest radius teacher can set</p>
          </div>
        </div>
        <div
          style={{
            background: "#f9fafb",
            borderRadius: 8,
            padding: "9px 13px",
            marginTop: 12,
            fontSize: 12,
            color: "#374151",
          }}
        >
          📏 Teachers can pick between <strong>{minRadius}m</strong> and{" "}
          <strong>{maxRadius}m</strong>
        </div>
      </div>

      {/* Late Threshold */}
      <div style={{ ...sectionSt, marginBottom: 24 }}>
        <h3
          style={{
            margin: "0 0 6px",
            fontSize: 14,
            fontWeight: 700,
            color: "#111827",
          }}
        >
          Late Threshold
        </h3>
        <p style={{ margin: "0 0 12px", fontSize: 12, color: "#6b7280" }}>
          Students arriving more than this many minutes after session opens are
          marked Late.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <input
            type="number"
            min={1}
            max={60}
            value={lateMin}
            onChange={(e) => setLateMin(Number(e.target.value))}
            style={{ ...inputSt, width: 100 }}
          />
          <span style={{ fontSize: 13, color: "#6b7280" }}>
            minutes after session opens
          </span>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={saving}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "11px 24px",
          borderRadius: 10,
          border: "none",
          background: saved ? "#16a34a" : "#111827",
          color: "#fff",
          fontSize: 14,
          fontWeight: 700,
          cursor: saving ? "not-allowed" : "pointer",
          transition: "background 0.3s",
        }}
      >
        <Save size={15} />
        {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Settings"}
      </button>
    </div>
  );
}

const sectionSt: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: "18px 20px",
  marginBottom: 16,
};
const labelSt: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 700,
  color: "#374151",
  marginBottom: 6,
};
const inputSt: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: 8,
  border: "1.5px solid #e5e7eb",
  fontSize: 13,
  color: "#111827",
  outline: "none",
  boxSizing: "border-box",
};
const hintSt: React.CSSProperties = {
  margin: "5px 0 0",
  fontSize: 11,
  color: "#9ca3af",
};
