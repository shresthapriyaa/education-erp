import axios from "axios";
import type { Teacher } from "../types/teacher.types";

type TeacherPayload = Partial<Teacher> & { password?: string };

export const teacherApi = {
  getAll: async (filters?: { search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    const res = await axios.get(`/api/teachers?${params.toString()}`);
    return res.data;
  },
  create: async (data: TeacherPayload) => {
    const res = await axios.post("/api/teachers", data);
    return res.data;
  },
  update: async (id: string, data: TeacherPayload) => {
    const res = await axios.put(`/api/teachers/${id}`, data);
    return res.data;
  },
  patch: async (id: string, data: TeacherPayload) => {
    const res = await axios.patch(`/api/teachers/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await axios.delete(`/api/teachers/${id}`);
    return res.data;
  },
};