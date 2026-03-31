"use client";

import type { AttendanceSummary } from "../types/attendance.types";

interface AttendanceSummaryProps {
  summary: AttendanceSummary;
  loading?: boolean;
  showWarning?: boolean; // warn if below 75%
}

export function AttendanceSummaryCards({
  summary,
  loading = false,
  showWarning = true,
}: AttendanceSummaryProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  const cards = [
    { label: "Total Days", value: summary.total, style: "bg-gray-50 text-gray-700 border border-gray-200" },
    { label: "Present", value: summary.present, style: "bg-green-50 text-green-700 border border-green-100" },
    { label: "Absent", value: summary.absent, style: "bg-red-50 text-red-700 border border-red-100" },
    { label: "Late", value: summary.late, style: "bg-yellow-50 text-yellow-700 border border-yellow-100" },
  ];

  return (
    <div className="space-y-3">
      {/* Cards */}
      <div className="grid grid-cols-4 gap-3">
        {cards.map((c) => (
          <div key={c.label} className={`rounded-xl p-4 text-center ${c.style}`}>
            <p className="text-2xl font-bold">{c.value}</p>
            <p className="text-xs font-medium mt-1 opacity-80">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-sm mb-1.5">
          <span className="text-gray-500">Attendance Rate</span>
          <span className="font-semibold">{summary.percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full transition-all ${
              summary.percentage >= 75 ? "bg-green-500" : "bg-red-500"
            }`}
            style={{ width: `${summary.percentage}%` }}
          />
        </div>
      </div>

      {/* Warning */}
      {showWarning && summary.percentage < 75 && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700 flex items-center gap-2">
          ⚠️ Below 75% minimum attendance.{" "}
          <strong>
            {Math.ceil((0.75 * summary.total - summary.present) / 0.25)} more days
          </strong>{" "}
          needed to reach 75%.
        </div>
      )}
    </div>
  );
}