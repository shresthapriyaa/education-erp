import axios from "axios";
import type { Student } from "../types/student.types";

type StudentPayload = Partial<Student> & { password?: string };

export const studentApi = {
  getAll: async (filters?: { search?: string; sex?: string; bloodGroup?: string }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.sex && filters.sex !== "all") params.append("sex", filters.sex);
    if (filters?.bloodGroup && filters.bloodGroup !== "all") params.append("bloodGroup", filters.bloodGroup);
    const res = await axios.get(`/api/students?${params.toString()}`);
    return res.data;
  },

  create: async (data: StudentPayload) => {
    const res = await axios.post("/api/students", data);
    return res.data;
  },

  update: async (id: string, data: StudentPayload) => {
    const res = await axios.put(`/api/students/${id}`, data);
    return res.data;
  },

  patch: async (id: string, data: StudentPayload) => {
    const res = await axios.patch(`/api/students/${id}`, data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await axios.delete(`/api/students/${id}`);
    return res.data;
  },
};