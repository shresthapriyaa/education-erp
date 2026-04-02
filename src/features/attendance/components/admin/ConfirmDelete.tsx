"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

interface Props {
  label: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function ConfirmDelete({ label, onClose, onConfirm }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  }

  return (
    <div style={overlay}>
      <div style={modal}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "#fee2e2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <Trash2 size={22} color="#dc2626" />
        </div>
        <h2
          style={{
            margin: "0 0 8px",
            fontSize: 17,
            fontWeight: 800,
            color: "#111827",
            textAlign: "center",
          }}
        >
          Delete Record?
        </h2>
        <p
          style={{
            margin: "0 0 24px",
            fontSize: 13,
            color: "#6b7280",
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          Permanently delete the <strong>{label}</strong>. This cannot be
          undone.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ ...outlineBtn, flex: 1 }}>
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            style={{ ...deleteBtn, flex: 1, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 50,
  backdropFilter: "blur(4px)",
};
const modal: React.CSSProperties = {
  background: "#fff",
  borderRadius: 16,
  padding: "28px 28px 24px",
  width: "100%",
  maxWidth: 400,
  boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
};
const outlineBtn: React.CSSProperties = {
  padding: "10px 0",
  borderRadius: 8,
  border: "1.5px solid #e5e7eb",
  background: "#fff",
  fontSize: 13,
  fontWeight: 600,
  color: "#374151",
  cursor: "pointer",
};
const deleteBtn: React.CSSProperties = {
  padding: "10px 0",
  borderRadius: 8,
  border: "none",
  background: "#dc2626",
  color: "#fff",
  fontSize: 13,
  fontWeight: 700,
  cursor: "pointer",
};
