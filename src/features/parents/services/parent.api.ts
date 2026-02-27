import axios from "axios";
import type { Parent } from "../types/parent.types";

type ParentPayload = Partial<Parent> & { password?: string };

export const parentApi = {
  getAll: async (filters?: { search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    const res = await axios.get(`/api/parents?${params.toString()}`);
    return res.data;
  },
  create: async (data: ParentPayload) => {
    const res = await axios.post("/api/parents", data);
    return res.data;
  },
  update: async (id: string, data: ParentPayload) => {
    const res = await axios.put(`/api/parents/${id}`, data);
    return res.data;
  },
  patch: async (id: string, data: ParentPayload) => {
    const res = await axios.patch(`/api/parents/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await axios.delete(`/api/parents/${id}`);
    return res.data;
  },
};