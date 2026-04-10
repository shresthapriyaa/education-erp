import axios from "axios";
import type { Class } from "../types/class.types";

type ClassPayload = Partial<Class> & { 
  teacherId?: string;
  subjects?: Array<{
    subjectId: string;
    teacherId: string | null;
  }>;
};

export const classApi = {
  getAll: async (filters?: { search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    // Add timestamp to prevent caching
    params.append("_t", Date.now().toString());
    const res = await axios.get(`/api/classes?${params.toString()}`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
    });
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