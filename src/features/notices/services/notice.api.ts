import axios from "axios";
import type { Notice } from "../types/notice.types";

type NoticePayload = Partial<Notice>;

export const noticeApi = {
  getAll: async (filters?: { search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    const res = await axios.get(`/api/notices?${params.toString()}`);
    return res.data;
  },
  create: async (data: NoticePayload) => {
    const res = await axios.post("/api/notices", data);
    return res.data;
  },
  update: async (id: string, data: NoticePayload) => {
    const res = await axios.put(`/api/notices/${id}`, data);
    return res.data;
  },
  patch: async (id: string, data: NoticePayload) => {
    const res = await axios.patch(`/api/notices/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await axios.delete(`/api/notices/${id}`);
    return res.data;
  },
};