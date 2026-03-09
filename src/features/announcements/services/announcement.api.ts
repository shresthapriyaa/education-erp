import axios from "axios";
import type { Announcement } from "../types/announcement.types";

type AnnouncementPayload = Partial<Announcement>;

export const announcementApi = {
  getAll: async (filters?: { search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    const res = await axios.get(`/api/announcements?${params.toString()}`);
    return res.data;
  },
  create: async (data: AnnouncementPayload) => {
    const res = await axios.post("/api/announcements", data);
    return res.data;
  },
  update: async (id: string, data: AnnouncementPayload) => {
    const res = await axios.put(`/api/announcements/${id}`, data);
    return res.data;
  },
  patch: async (id: string, data: AnnouncementPayload) => {
    const res = await axios.patch(`/api/announcements/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await axios.delete(`/api/announcements/${id}`);
    return res.data;
  },
};