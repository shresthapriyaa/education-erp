import axios from "axios";
import type { Assignment } from "../types/assignment.types";

type AssignmentPayload = Partial<Assignment>;

export const assignmentApi = {
  getAll: async (filters?: { search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    const res = await axios.get(`/api/assignments?${params.toString()}`);
    return res.data;
  },
  create: async (data: AssignmentPayload) => {
    const res = await axios.post("/api/assignments", data);
    return res.data;
  },
  update: async (id: string, data: AssignmentPayload) => {
    const res = await axios.put(`/api/assignments/${id}`, data);
    return res.data;
  },
  patch: async (id: string, data: AssignmentPayload) => {
    const res = await axios.patch(`/api/assignments/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await axios.delete(`/api/assignments/${id}`);
    return res.data;
  },
};