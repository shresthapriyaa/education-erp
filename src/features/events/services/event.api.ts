import axios from "axios";
import type { Event } from "../types/event.types";

type EventPayload = Partial<Event>;

export const eventApi = {
  getAll: async (filters?: { search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    const res = await axios.get(`/api/events?${params.toString()}`);
    return res.data;
  },
  create: async (data: EventPayload) => {
    const res = await axios.post("/api/events", data);
    return res.data;
  },
  update: async (id: string, data: EventPayload) => {
    const res = await axios.put(`/api/events/${id}`, data);
    return res.data;
  },
  patch: async (id: string, data: EventPayload) => {
    const res = await axios.patch(`/api/events/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await axios.delete(`/api/events/${id}`);
    return res.data;
  },
};