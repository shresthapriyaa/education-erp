import axios from "axios";
import type { Exam } from "../types/exam.types";

type ExamPayload = Partial<Exam> & { subjectId?: string };

export const examApi = {
  getAll: async (filters?: { search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    const res = await axios.get(`/api/exams?${params.toString()}`);
    return res.data;
  },
  create: async (data: ExamPayload) => {
    const res = await axios.post("/api/exams", data);
    return res.data;
  },
  update: async (id: string, data: ExamPayload) => {
    const res = await axios.put(`/api/exams/${id}`, data);
    return res.data;
  },
  patch: async (id: string, data: ExamPayload) => {
    const res = await axios.patch(`/api/exams/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await axios.delete(`/api/exams/${id}`);
    return res.data;
  },
};