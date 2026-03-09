import axios from "axios";
import type { Fee } from "../types/fee.types";

type FeePayload = Partial<Fee> & { studentId?: string };

export const feeApi = {
  getAll: async (filters?: { search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    const res = await axios.get(`/api/fees?${params.toString()}`);
    return res.data;
  },
  create: async (data: FeePayload) => {
    const res = await axios.post("/api/fees", data);
    return res.data;
  },
  update: async (id: string, data: FeePayload) => {
    const res = await axios.put(`/api/fees/${id}`, data);
    return res.data;
  },
  patch: async (id: string, data: FeePayload) => {
    const res = await axios.patch(`/api/fees/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await axios.delete(`/api/fees/${id}`);
    return res.data;
  },
};