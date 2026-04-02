import type {
  AttendanceRecord,
  AttendanceStats,
  AttendanceFilters,
  UpdateAttendancePayload,
} from "../types/attendance.types";
export type AttendanceListResponse = {
  records: AttendanceRecord[];
  stats: AttendanceStats;
  total: number;
};
export const attendanceService = {
  async getAll(
    filters: AttendanceFilters = {},
  ): Promise<AttendanceListResponse> {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== "ALL")
      params.set("status", filters.status);
    if (filters.dateFrom) params.set("from", filters.dateFrom);
    if (filters.dateTo) params.set("to", filters.dateTo);
    if (filters.classId) params.set("classId", filters.classId);
    if (filters.search) params.set("search", filters.search);
    if (filters.pageSize) params.set("pageSize", String(filters.pageSize));

    const res = await fetch(`/api/admin/attendance?${params}`);
    if (!res.ok) throw new Error("Failed to fetch attendance");
    return res.json();
  },

  async update(
    id: string,
    payload: UpdateAttendancePayload,
  ): Promise<AttendanceRecord> {
    const res = await fetch(`/api/admin/attendance/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to update attendance");
    return res.json();
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`/api/admin/attendance/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete attendance");
  },
};
