import axios from "axios";
import type { Schedule } from "../types/schedule.types";

type SchedulePayload = Partial<Schedule> & { classId?: string; subjectId?: string };

export const scheduleApi = {
  getAll: async (filters?: { search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    const res = await axios.get(`/api/schedules?${params.toString()}`);
    return res.data;
  },
  create: async (data: SchedulePayload) => {
    const res = await axios.post("/api/schedules", data);
    return res.data;
  },
  update: async (id: string, data: SchedulePayload) => {
    const res = await axios.put(`/api/schedules/${id}`, data);
    return res.data;
  },
  patch: async (id: string, data: SchedulePayload) => {
    const res = await axios.patch(`/api/schedules/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await axios.delete(`/api/schedules/${id}`);
    return res.data;
  },
};