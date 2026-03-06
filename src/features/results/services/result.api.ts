import axios from "axios";
import type { Result } from "../types/result.types";

type ResultPayload = Partial<Result> & { studentId?: string; subjectId?: string };

export const resultApi = {
  getAll: async (filters?: { search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    const res = await axios.get(`/api/results?${params.toString()}`);
    return res.data;
  },
  create: async (data: ResultPayload) => {
    const res = await axios.post("/api/results", data);
    return res.data;
  },
  update: async (id: string, data: ResultPayload) => {
    const res = await axios.put(`/api/results/${id}`, data);
    return res.data;
  },
  patch: async (id: string, data: ResultPayload) => {
    const res = await axios.patch(`/api/results/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await axios.delete(`/api/results/${id}`);
    return res.data;
  },
};