import axios from "axios";
import type { Subject } from "../types/subject.types";

type SubjectPayload = Partial<Subject>;

export const subjectApi = {
  getAll: async (filters?: { search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    const res = await axios.get(`/api/subjects?${params.toString()}`);
    return res.data;
  },
  create: async (data: SubjectPayload) => {
    const res = await axios.post("/api/subjects", data);
    return res.data;
  },
  update: async (id: string, data: SubjectPayload) => {
    const res = await axios.put(`/api/subjects/${id}`, data);
    return res.data;
  },
  patch: async (id: string, data: SubjectPayload) => {
    const res = await axios.patch(`/api/subjects/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await axios.delete(`/api/subjects/${id}`);
    return res.data;
  },
};