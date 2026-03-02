import axios from "axios";
import type { Lesson } from "../types/lesson.types";

type LessonPayload = Partial<Lesson>;

export const lessonApi = {
  getAll: async (filters?: { search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    const res = await axios.get(`/api/lessons?${params.toString()}`);
    return res.data;
  },
  create: async (data: LessonPayload) => {
    const res = await axios.post("/api/lessons", data);
    return res.data;
  },
  update: async (id: string, data: LessonPayload) => {
    const res = await axios.put(`/api/lessons/${id}`, data);
    return res.data;
  },
  patch: async (id: string, data: LessonPayload) => {
    const res = await axios.patch(`/api/lessons/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await axios.delete(`/api/lessons/${id}`);
    return res.data;
  },
};