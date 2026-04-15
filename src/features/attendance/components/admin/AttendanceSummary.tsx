import { CheckCircle2, XCircle, Clock, Users } from "lucide-react";
import type { AttendanceStats } from "../../types/attendance.types";

interface Props {
  stats: AttendanceStats;
  loading: boolean;
}

export default function AttendanceSummary({ stats, loading }: Props) {
  const cards = [
    {
      label: "Total",
      value: stats.total,
      color: "#6366f1",
      bg: "#f5f3ff",
      icon: <Users size={16} color="#6366f1" />,
    },
    {
      label: "Present",
      value: stats.present,
      color: "#16a34a",
      bg: "#f0fdf4",
      icon: <CheckCircle2 size={16} color="#16a34a" />,
    },
    {
      label: "Absent",
      value: stats.absent,
      color: "#dc2626",
      bg: "#fef2f2",
      icon: <XCircle size={16} color="#dc2626" />,
    },
    {
      label: "Late",
      value: stats.late,
      color: "#ca8a04",
      bg: "#fefce8",
      icon: <Clock size={16} color="#ca8a04" />,
    },
  ];

  return (
    <div style={{ marginBottom: 24 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
        }}
      >
        {cards.map((c) => (
          <div
            key={c.label}
            style={{
              background: c.bg,
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: "16px 18px",
            }}
          >
            {loading ? (
              <div
                style={{ height: 40, background: "#e5e7eb", borderRadius: 6 }}
              />
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      color: "#9ca3af",
                    }}
                  >
                    {c.label}
                  </span>
                  {c.icon}
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 30,
                    fontWeight: 900,
                    color: c.color,
                    lineHeight: 1,
                  }}
                >
                  {c.value.toLocaleString()}
                </p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}