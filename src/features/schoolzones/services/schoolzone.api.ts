import axios from "axios";
import { SchoolZonePayload } from "../types/Schoolzone.types";

export const schoolZoneApi = {
  getAll: async (filters?: { search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    const res = await axios.get(`/api/schoolzones?${params.toString()}`);
    return res.data;
  },
  create: async (data: SchoolZonePayload) => {
    const res = await axios.post("/api/schoolzones", data);
    return res.data;
  },
  update: async (id: string, data: SchoolZonePayload) => {
    const res = await axios.put(`/api/schoolzones/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await axios.delete(`/api/schoolzones/${id}`);
    return res.data;
  },
};
