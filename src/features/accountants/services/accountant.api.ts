import axios from "axios";
import type { Accountant } from "../types/accountant.types";

type AccountantPayload = Partial<Accountant> & { password?: string };

export const accountantApi = {
  getAll: async (filters?: { search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    const res = await axios.get(`/api/accountants?${params.toString()}`);
    return res.data;
  },
  create: async (data: AccountantPayload) => {
    const res = await axios.post("/api/accountants", data);
    return res.data;
  },
  update: async (id: string, data: AccountantPayload) => {
    const res = await axios.put(`/api/accountants/${id}`, data);
    return res.data;
  },
  patch: async (id: string, data: AccountantPayload) => {
    const res = await axios.patch(`/api/accountants/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await axios.delete(`/api/accountants/${id}`);
    return res.data;
  },
};