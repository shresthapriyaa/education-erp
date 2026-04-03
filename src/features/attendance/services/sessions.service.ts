// import type {
//   SessionRecord,
//   SessionFilters,
//   CreateSessionPayload,
// } from "../types/attendance.types";

// export type SessionListResponse = {
//   sessions: SessionRecord[];
//   total: number;
// };

// export const sessionService = {
//   async getAll(filters: SessionFilters = {}): Promise<SessionListResponse> {
//     const params = new URLSearchParams();
//     if (filters.classId) params.set("classId", filters.classId);
//     if (filters.teacherId) params.set("teacherId", filters.teacherId);
//     if (filters.dateFrom) params.set("from", filters.dateFrom);
//     if (filters.dateTo) params.set("to", filters.dateTo);
//     if (filters.isOpen !== undefined)
//       params.set("isOpen", String(filters.isOpen));

//     const res = await fetch(`/api/admin/attendance/sessions?${params}`);
//     if (!res.ok) throw new Error("Failed to fetch sessions");
//     return res.json();
//   },

//   async getById(id: string): Promise<SessionRecord> {
//     const res = await fetch(`/api/admin/attendance/sessions/${id}`);
//     if (!res.ok) throw new Error("Failed to fetch session");
//     return res.json();
//   },

//   async create(payload: CreateSessionPayload): Promise<SessionRecord> {
//     const res = await fetch("/api/admin/attendance/sessions", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });
//     if (!res.ok) throw new Error("Failed to create session");
//     return res.json();
//   },

//   async endSession(id: string): Promise<SessionRecord> {
//     const res = await fetch(`/api/admin/attendance/sessions/${id}`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         isOpen: false,
//         endTime: new Date().toISOString(),
//       }),
//     });
//     if (!res.ok) throw new Error("Failed to end session");
//     return res.json();
//   },

//   async delete(id: string): Promise<void> {
//     const res = await fetch(`/api/admin/attendance/sessions/${id}`, {
//       method: "DELETE",
//     });
//     if (!res.ok) throw new Error("Failed to delete session");
//   },
// };





import type {
  SessionRecord,
  SessionFilters,
  CreateSessionPayload,
} from "../types/attendance.types";

export type SessionListResponse = {
  sessions: SessionRecord[];
  total: number;
};

export const sessionService = {
  async getAll(filters: SessionFilters = {}): Promise<SessionListResponse> {
    const params = new URLSearchParams();
    if (filters.classId) params.set("classId", filters.classId);
    if (filters.teacherId) params.set("teacherId", filters.teacherId);
    if (filters.dateFrom) params.set("from", filters.dateFrom);
    if (filters.dateTo) params.set("to", filters.dateTo);
    if (filters.isOpen !== undefined)
      params.set("isOpen", String(filters.isOpen));

    const res = await fetch(`/api/sessions?${params}`);
    if (!res.ok) throw new Error("Failed to fetch sessions");
    return res.json();
  },

  async getById(id: string): Promise<SessionRecord> {
    const res = await fetch(`/api/sessions/${id}`);
    if (!res.ok) throw new Error("Failed to fetch session");
    return res.json();
  },

  async create(payload: CreateSessionPayload): Promise<SessionRecord> {
    const res = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to create session");
    return res.json();
  },

  async endSession(id: string): Promise<SessionRecord> {
    const res = await fetch(`/api/sessions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        isOpen: false,
        endTime: new Date().toISOString(),
      }),
    });
    if (!res.ok) throw new Error("Failed to end session");
    return res.json();
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`/api/sessions/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete session");
  },
};
