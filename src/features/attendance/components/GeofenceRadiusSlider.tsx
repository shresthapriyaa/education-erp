// import { useState, useEffect } from "react";

// // ─── Mock config (replace with your API/context values) ───────────────────────
// const ADMIN_MAX_RADIUS = 500; // meters — fetched from admin settings
// const ADMIN_MIN_RADIUS = 10;  // meters
// const DEFAULT_RADIUS   = 20;  // meters — teacher default

// // ─── Utility ──────────────────────────────────────────────────────────────────
// function getLabel(r) {
//   if (r < 50)  return { text: "Classroom",  color: "#16a34a" };
//   if (r < 150) return { text: "Building",   color: "#ca8a04" };
//   if (r < 300) return { text: "Campus",     color: "#ea580c" };
//   return              { text: "Wide Zone",  color: "#dc2626" };
// }

// // ─── Main Component ───────────────────────────────────────────────────────────
// export default function GeofenceRadiusSlider({
//   adminMaxRadius = ADMIN_MAX_RADIUS,
//   adminMinRadius = ADMIN_MIN_RADIUS,
//   defaultRadius  = DEFAULT_RADIUS,
//   onRadiusChange,   // callback: (radius) => void
//   sessionName = "",
// }) {
//   const [radius, setRadius]       = useState(defaultRadius);
//   const [pulse,  setPulse]        = useState(false);
//   const [confirmed, setConfirmed] = useState(false);

//   const pct   = ((radius - adminMinRadius) / (adminMaxRadius - adminMinRadius)) * 100;
//   const label = getLabel(radius);

//   useEffect(() => {
//     setPulse(true);
//     const t = setTimeout(() => setPulse(false), 300);
//     return () => clearTimeout(t);
//   }, [radius]);

//   function handleChange(e) {
//     setRadius(Number(e.target.value));
//     setConfirmed(false);
//     onRadiusChange?.(Number(e.target.value));
//   }

//   function handleConfirm() {
//     setConfirmed(true);
//     onRadiusChange?.(radius);
//   }

//   // Ring size: scales the visual circle preview
//   const ringSize = 80 + (pct / 100) * 120; // 80px → 200px

//   return (
//     <div style={styles.card}>
//       {/* ── Header ── */}
//       <div style={styles.header}>
//         <div>
//           <p style={styles.subtitle}>Teacher Panel · Geofencing</p>
//           <h2 style={styles.title}>Set Attendance Radius</h2>
//           {sessionName && (
//             <p style={styles.sessionTag}>📍 {sessionName}</p>
//           )}
//         </div>
//         <div style={{ ...styles.zoneBadge, background: label.color + "18", color: label.color, border: `1px solid ${label.color}40` }}>
//           {label.text}
//         </div>
//       </div>

//       {/* ── Visual Preview ── */}
//       <div style={styles.vizWrap}>
//         {/* Outer faint ring */}
//         <div style={{
//           ...styles.ring,
//           width:  ringSize * 1.5,
//           height: ringSize * 1.5,
//           border: `1px dashed ${label.color}30`,
//           transition: "all 0.25s ease",
//         }} />
//         {/* Main ring */}
//         <div style={{
//           ...styles.ring,
//           width:  ringSize,
//           height: ringSize,
//           border: `2px solid ${label.color}60`,
//           background: label.color + "08",
//           transition: "all 0.25s ease",
//         }} />
//         {/* Center pin */}
//         <div style={{ ...styles.centerPin, background: label.color, boxShadow: `0 0 0 6px ${label.color}25` }}>
//           <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
//             <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
//           </svg>
//         </div>

//         {/* Radius label on visual */}
//         <div style={{ ...styles.radiusTag, color: label.color }}>
//           {radius}m radius
//         </div>
//       </div>

//       {/* ── Slider ── */}
//       <div style={styles.sliderSection}>
//         <div style={styles.sliderRow}>
//           <span style={styles.sliderMin}>{adminMinRadius}m</span>
//           <div style={styles.sliderWrap}>
//             <div style={{
//               ...styles.sliderTrack,
//               background: `linear-gradient(to right, ${label.color} ${pct}%, #e5e7eb ${pct}%)`,
//             }} />
//             <input
//               type="range"
//               min={adminMinRadius}
//               max={adminMaxRadius}
//               step={5}
//               value={radius}
//               onChange={handleChange}
//               style={styles.sliderInput}
//             />
//           </div>
//           <span style={styles.sliderMax}>{adminMaxRadius}m</span>
//         </div>

//         {/* Value display */}
//         <div style={styles.valueDisplay}>
//           <span style={{ ...styles.valueNumber, color: label.color }}>{radius}</span>
//           <span style={styles.valueUnit}>meters</span>
//         </div>
//       </div>

//       {/* ── Info row ── */}
//       <div style={styles.infoRow}>
//         <div style={styles.infoItem}>
//           <span style={styles.infoLabel}>Min (Admin)</span>
//           <span style={styles.infoValue}>{adminMinRadius}m</span>
//         </div>
//         <div style={styles.infoItem}>
//           <span style={styles.infoLabel}>Your Radius</span>
//           <span style={{ ...styles.infoValue, color: label.color, fontWeight: 700 }}>{radius}m</span>
//         </div>
//         <div style={styles.infoItem}>
//           <span style={styles.infoLabel}>Max (Admin)</span>
//           <span style={styles.infoValue}>{adminMaxRadius}m</span>
//         </div>
//       </div>

//       {/* ── Confirm Button ── */}
//       <button
//         onClick={handleConfirm}
//         style={{
//           ...styles.confirmBtn,
//           background: confirmed ? "#16a34a" : "#111827",
//           transform: confirmed ? "scale(1.01)" : "scale(1)",
//         }}
//       >
//         {confirmed ? "✓ Radius Confirmed" : "Confirm Radius & Start Session"}
//       </button>

//       {confirmed && (
//         <p style={styles.confirmNote}>
//           Students within <strong>{radius}m</strong> will be marked Present automatically.
//         </p>
//       )}

//       <style>{`
//         input[type=range] { -webkit-appearance: none; appearance: none; background: transparent; cursor: pointer; width: 100%; }
//         input[type=range]::-webkit-slider-thumb {
//           -webkit-appearance: none;
//           height: 22px; width: 22px;
//           border-radius: 50%;
//           background: #111827;
//           border: 3px solid white;
//           box-shadow: 0 2px 8px rgba(0,0,0,0.25);
//           margin-top: -9px;
//           transition: transform 0.15s;
//         }
//         input[type=range]::-webkit-slider-thumb:hover { transform: scale(1.2); }
//         input[type=range]::-webkit-slider-runnable-track { height: 4px; border-radius: 2px; }
//         input[type=range]:focus { outline: none; }
//       `}</style>
//     </div>
//   );
// }

// // ─── Styles ───────────────────────────────────────────────────────────────────
// const styles = {
//   card: {
//     background: "#ffffff",
//     borderRadius: 16,
//     border: "1px solid #e5e7eb",
//     padding: "28px 28px 24px",
//     maxWidth: 480,
//     width: "100%",
//     fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
//     boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
//   },
//   header: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     marginBottom: 24,
//   },
//   subtitle: { fontSize: 11, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 4px" },
//   title:    { fontSize: 20, fontWeight: 700, color: "#111827", margin: 0 },
//   sessionTag: { fontSize: 12, color: "#6b7280", marginTop: 4, margin: 0 },
//   zoneBadge: {
//     fontSize: 11, fontWeight: 700, letterSpacing: "0.05em",
//     textTransform: "uppercase", padding: "4px 10px",
//     borderRadius: 20, whiteSpace: "nowrap",
//   },

//   vizWrap: {
//     display: "flex", alignItems: "center", justifyContent: "center",
//     position: "relative", height: 200, marginBottom: 8,
//   },
//   ring: {
//     position: "absolute", borderRadius: "50%",
//     display: "flex", alignItems: "center", justifyContent: "center",
//   },
//   centerPin: {
//     position: "absolute", width: 32, height: 32, borderRadius: "50%",
//     display: "flex", alignItems: "center", justifyContent: "center",
//     zIndex: 2, transition: "background 0.3s",
//   },
//   radiusTag: {
//     position: "absolute", bottom: 16,
//     fontSize: 12, fontWeight: 600,
//     background: "white", padding: "3px 10px",
//     borderRadius: 20, border: "1px solid #e5e7eb",
//     boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
//   },

//   sliderSection: { marginBottom: 20 },
//   sliderRow: { display: "flex", alignItems: "center", gap: 10 },
//   sliderMin: { fontSize: 11, color: "#9ca3af", minWidth: 28, textAlign: "right" },
//   sliderMax: { fontSize: 11, color: "#9ca3af", minWidth: 28 },
//   sliderWrap: { flex: 1, position: "relative", height: 24, display: "flex", alignItems: "center" },
//   sliderTrack: {
//     position: "absolute", width: "100%", height: 4,
//     borderRadius: 2, pointerEvents: "none", transition: "background 0.2s",
//   },
//   sliderInput: { position: "relative", zIndex: 1, width: "100%", height: 4 },

//   valueDisplay: { display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4, marginTop: 12 },
//   valueNumber:  { fontSize: 42, fontWeight: 800, lineHeight: 1, transition: "color 0.3s" },
//   valueUnit:    { fontSize: 16, color: "#6b7280", fontWeight: 500 },

//   infoRow: {
//     display: "flex", justifyContent: "space-between",
//     background: "#f9fafb", borderRadius: 10, padding: "12px 16px",
//     marginBottom: 20,
//   },
//   infoItem:  { display: "flex", flexDirection: "column", alignItems: "center", gap: 2 },
//   infoLabel: { fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em" },
//   infoValue: { fontSize: 14, fontWeight: 600, color: "#374151" },

//   confirmBtn: {
//     width: "100%", padding: "13px 0",
//     borderRadius: 10, border: "none", cursor: "pointer",
//     color: "white", fontSize: 14, fontWeight: 600,
//     letterSpacing: "0.02em", transition: "all 0.3s ease",
//   },
//   confirmNote: {
//     textAlign: "center", fontSize: 12, color: "#6b7280",
//     marginTop: 10, marginBottom: 0,
//   },
// };




"use client";

import { useState, useEffect } from "react";
import {
  clampRadius,
  fmtDist,
  RADIUS_MIN_M,
  RADIUS_MAX_M,
  LATE_THRESHOLD_MIN,
  type Coords,
} from "@/core/lib/haversineDistance";

interface GeofenceRadiusSliderProps {
  adminMinRadius?: number;
  adminMaxRadius?: number;
  defaultRadius?:  number;
  sessionName?:    string;
  gpsAccuracy?:    number;
  schoolCenter?:   Coords;
  onRadiusChange?: (radiusMeters: number) => void;
  onConfirm?:      (radiusMeters: number) => void;
}

interface ZoneLabel {
  text:  string;
  color: string;
}

function getLabel(r: number): ZoneLabel {
  if (r <= 100) return { text: "Classroom", color: "#16a34a" };
  if (r <= 200) return { text: "Building",  color: "#ca8a04" };
  if (r <= 350) return { text: "Campus",    color: "#ea580c" };
  return               { text: "Wide Zone", color: "#dc2626" };
}

export default function GeofenceRadiusSlider({
  adminMinRadius = RADIUS_MIN_M,
  adminMaxRadius = RADIUS_MAX_M,
  defaultRadius  = RADIUS_MIN_M,
  sessionName    = "",
  gpsAccuracy    = 0,
  onRadiusChange,
  onConfirm,
}: GeofenceRadiusSliderProps) {
  const [radius,    setRadius]    = useState<number>(() => clampRadius(defaultRadius));
  const [confirmed, setConfirmed] = useState<boolean>(false);

  const pct      = ((radius - adminMinRadius) / (adminMaxRadius - adminMinRadius)) * 100;
  const label    = getLabel(radius);
  const ringSize = 80 + (pct / 100) * 120;

  useEffect(() => {
    onRadiusChange?.(radius);
  }, [radius]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = clampRadius(Number(e.target.value));
    setRadius(val);
    setConfirmed(false);
  }

  function handleConfirm() {
    setConfirmed(true);
    onConfirm?.(radius);
  }

  return (
    <div style={s.card}>

      {/* Header */}
      <div style={s.header}>
        <div>
          <p style={s.subtitle}>Teacher panel · Geofencing</p>
          <h2 style={s.title}>Set attendance radius</h2>
          {sessionName && <p style={s.sessionTag}>📍 {sessionName}</p>}
        </div>
        <span style={{ ...s.badge, background: label.color + "18", color: label.color, border: `1px solid ${label.color}40` }}>
          {label.text}
        </span>
      </div>

      {/* Visual ring preview */}
      <div style={s.vizWrap}>
        <div style={{ ...s.ring, width: ringSize * 1.55, height: ringSize * 1.55, border: `1px dashed ${label.color}25`, transition: "all 0.25s ease" }} />
        <div style={{ ...s.ring, width: ringSize, height: ringSize, border: `2px solid ${label.color}55`, background: label.color + "08", transition: "all 0.25s ease" }} />
        <div style={{ ...s.pin, background: label.color, boxShadow: `0 0 0 6px ${label.color}22` }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
        <span style={{ ...s.radiusTag, color: label.color }}>{fmtDist(radius)} radius</span>
      </div>

      {/* Slider */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={s.edge}>{fmtDist(adminMinRadius)}</span>
          <div style={s.trackWrap}>
            <div style={{ ...s.track, background: `linear-gradient(to right, ${label.color} ${pct}%, #e5e7eb ${pct}%)` }} />
            <input
              className="geo-slider"
              type="range"
              min={adminMinRadius}
              max={adminMaxRadius}
              step={5}
              value={radius}
              onChange={handleChange}
            />
          </div>
          <span style={s.edge}>{fmtDist(adminMaxRadius)}</span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4, marginTop: 12 }}>
          <span style={{ fontSize: 42, fontWeight: 800, lineHeight: 1, color: label.color, transition: "color 0.3s" }}>{radius}</span>
          <span style={{ fontSize: 16, color: "#6b7280", fontWeight: 500 }}>meters</span>
        </div>
      </div>

      {/* Info strip */}
      <div style={s.infoStrip}>
        <div style={s.infoItem}>
          <span style={s.infoLabel}>Min (admin)</span>
          <span style={s.infoVal}>{fmtDist(adminMinRadius)}</span>
        </div>
        <div style={s.infoItem}>
          <span style={s.infoLabel}>Your radius</span>
          <span style={{ ...s.infoVal, color: label.color, fontWeight: 700 }}>{fmtDist(radius)}</span>
        </div>
        <div style={s.infoItem}>
          <span style={s.infoLabel}>Max (admin)</span>
          <span style={s.infoVal}>{fmtDist(adminMaxRadius)}</span>
        </div>
      </div>

      {/* Late note */}
      <p style={s.lateNote}>
        ⏱ Students arriving more than <strong>{LATE_THRESHOLD_MIN} min</strong> after session opens will be marked <em>Late</em>.
      </p>

      {/* GPS warning */}
      {gpsAccuracy > 30 && (
        <p style={s.gpsWarn}>
          ⚠ GPS accuracy is ±{Math.round(gpsAccuracy)}m — a buffer has been applied automatically.
        </p>
      )}

      {/* Confirm button */}
      <button onClick={handleConfirm} style={{ ...s.confirmBtn, background: confirmed ? "#16a34a" : "#111827" }}>
        {confirmed ? "✓ Radius confirmed" : "Confirm radius & start session"}
      </button>

      {confirmed && (
        <p style={{ textAlign: "center", fontSize: 12, color: "#6b7280", marginTop: 10, marginBottom: 0 }}>
          Students within <strong>{fmtDist(radius)}</strong> will be marked Present automatically.
        </p>
      )}

      <style>{`
        .geo-slider {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          cursor: pointer;
          width: 100%;
          height: 28px;
          padding: 0;
          margin: 0;
          display: block;
          position: relative;
          z-index: 1;
        }
        .geo-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 22px;
          width: 22px;
          border-radius: 50%;
          background: #111827;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.25);
          margin-top: -9px;
          transition: transform 0.15s;
          cursor: pointer;
        }
        .geo-slider::-webkit-slider-thumb:hover { transform: scale(1.2); }
        .geo-slider::-moz-range-thumb {
          height: 22px;
          width: 22px;
          border-radius: 50%;
          background: #111827;
          border: 3px solid white;
          cursor: pointer;
        }
        .geo-slider::-webkit-slider-runnable-track { height: 4px; border-radius: 2px; background: transparent; }
        .geo-slider::-moz-range-track { height: 4px; border-radius: 2px; }
        .geo-slider:focus { outline: none; }
      `}</style>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  card:       { background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: "28px 28px 24px", maxWidth: 480, width: "100%", fontFamily: "'DM Sans','Segoe UI',sans-serif", boxShadow: "0 4px 24px rgba(0,0,0,0.07)" },
  header:     { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  subtitle:   { fontSize: 11, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 4px" },
  title:      { fontSize: 20, fontWeight: 700, color: "#111827", margin: 0 },
  sessionTag: { fontSize: 12, color: "#6b7280", margin: "4px 0 0" },
  badge:      { fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 20, whiteSpace: "nowrap" },
  vizWrap:    { display: "flex", alignItems: "center", justifyContent: "center", position: "relative", height: 200, marginBottom: 8 },
  ring:       { position: "absolute", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" },
  pin:        { position: "absolute", width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2, transition: "background 0.3s" },
  radiusTag:  { position: "absolute", bottom: 16, fontSize: 12, fontWeight: 600, background: "white", padding: "3px 10px", borderRadius: 20, border: "1px solid #e5e7eb" },
  edge:       { fontSize: 11, color: "#9ca3af", minWidth: 36, flexShrink: 0 },
  trackWrap:  { flex: 1, position: "relative", height: 28, display: "flex", alignItems: "center" },
  track:      { position: "absolute", width: "100%", height: 4, borderRadius: 2, pointerEvents: "none", transition: "background 0.2s" },
  infoStrip:  { display: "flex", justifyContent: "space-between", background: "#f9fafb", borderRadius: 10, padding: "12px 16px", marginBottom: 12 },
  infoItem:   { display: "flex", flexDirection: "column", alignItems: "center", gap: 2 },
  infoLabel:  { fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em" },
  infoVal:    { fontSize: 14, fontWeight: 600, color: "#374151" },
  lateNote:   { fontSize: 12, color: "#6b7280", background: "#f9fafb", borderRadius: 8, padding: "8px 12px", margin: "0 0 12px" },
  gpsWarn:    { fontSize: 12, color: "#92400e", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "8px 12px", marginBottom: 12 },
  confirmBtn: { width: "100%", padding: "13px 0", borderRadius: 10, border: "none", cursor: "pointer", color: "white", fontSize: 14, fontWeight: 600, letterSpacing: "0.02em", transition: "all 0.3s ease" },
};