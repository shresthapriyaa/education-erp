"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { CreateSessionPayload } from "../../types/attendance.types";

interface Props {
  onClose:  () => void;
  onCreate: (payload: CreateSessionPayload) => Promise<void>;
}

interface ClassOption  { id: string; name: string; }
interface SchoolOption { id: string; name: string; }

export default function CreateSessionModal({ onClose, onCreate }: Props) {
  const [classes,  setClasses]  = useState<ClassOption[]>([]);
  const [schools,  setSchools]  = useState<SchoolOption[]>([]);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  const [form, setForm] = useState({
    classId:          "",
    schoolId:         "",
    date:             new Date().toISOString().split("T")[0],
    startTime:        new Date().toTimeString().slice(0, 5),
    radiusMeters:     100,
    lateThresholdMin: 10,
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/classes?pageSize=200").then(r => r.json()),
      fetch("/api/schools?pageSize=200").then(r => r.json()),
    ]).then(([c, s]) => {
      setClasses(c.classes ?? c.data ?? c ?? []);
      setSchools(s.schools ?? s.data ?? s ?? []);
    }).catch(() => {});
  }, []);

  function set(key: string, value: any) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function submit() {
    if (!form.classId || !form.schoolId) {
      setError("Please select a class and school");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const startDateTime = new Date(`${form.date}T${form.startTime}`);
      await onCreate({
        classId:          form.classId,
        schoolId:         form.schoolId,
        date:             form.date,
        startTime:        startDateTime.toISOString(),
        radiusMeters:     form.radiusMeters,
        lateThresholdMin: form.lateThresholdMin,
      });
    } catch (e: any) {
      setError(e.message);
      setSaving(false);
    }
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: "100%", maxWidth: 440, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>

        {/* Modal header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#111827" }}>New Attendance Session</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280" }}>
            <X size={18} />
          </button>
        </div>

        {error && (
          <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 8, padding: "8px 12px", marginBottom: 14, fontSize: 13, color: "#dc2626" }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Class */}
          <div>
            <label style={labelSt}>Class *</label>
            <select value={form.classId} onChange={e => set("classId", e.target.value)} style={selectSt}>
              <option value="">Select class...</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {/* School */}
          <div>
            <label style={labelSt}>School *</label>
            <select value={form.schoolId} onChange={e => set("schoolId", e.target.value)} style={selectSt}>
              <option value="">Select school...</option>
              {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          {/* Date & Time */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={labelSt}>Date *</label>
              <input type="date" value={form.date} onChange={e => set("date", e.target.value)} style={inputSt} />
            </div>
            <div>
              <label style={labelSt}>Start Time *</label>
              <input type="time" value={form.startTime} onChange={e => set("startTime", e.target.value)} style={inputSt} />
            </div>
          </div>

          {/* Radius & Late threshold */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={labelSt}>GPS Radius (m)</label>
              <input
                type="number" min={10} max={1000}
                value={form.radiusMeters}
                onChange={e => set("radiusMeters", parseInt(e.target.value))}
                style={inputSt}
              />
            </div>
            <div>
              <label style={labelSt}>Late After (min)</label>
              <input
                type="number" min={1} max={60}
                value={form.lateThresholdMin}
                onChange={e => set("lateThresholdMin", parseInt(e.target.value))}
                style={inputSt}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, marginTop: 22, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={cancelBtnSt}>Cancel</button>
          <button onClick={submit} disabled={saving} style={saveBtnSt}>
            {saving ? "Creating..." : "Create & Open Session"}
          </button>
        </div>
      </div>
    </div>
  );
}

const labelSt:    React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 };
const inputSt:    React.CSSProperties = { width: "100%", padding: "8px 12px", borderRadius: 8, border: "1.5px solid #e5e7eb", fontSize: 13, color: "#111827", outline: "none", boxSizing: "border-box" };
const selectSt:   React.CSSProperties = { ...inputSt, background: "#fff" };
const cancelBtnSt: React.CSSProperties = { padding: "9px 18px", borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#374151" };
const saveBtnSt:   React.CSSProperties = { padding: "9px 20px", borderRadius: 8, border: "none", background: "#111827", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" };