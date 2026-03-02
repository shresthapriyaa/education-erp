import axios from "axios";
import type { Class } from "../types/class.types";

type ClassPayload = Partial<Class> & { teacherId?: string };

export const classApi = {
  getAll: async (filters?: { search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    const res = await axios.get(`/api/classes?${params.toString()}`);
    return res.data;
  },
  create: async (data: ClassPayload) => {
    const res = await axios.post("/api/classes", data);
    return res.data;
  },
  update: async (id: string, data: ClassPayload) => {
    const res = await axios.put(`/api/classes/${id}`, data);
    return res.data;
  },
  patch: async (id: string, data: ClassPayload) => {
    const res = await axios.patch(`/api/classes/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await axios.delete(`/api/classes/${id}`);
    return res.data;
  },
};