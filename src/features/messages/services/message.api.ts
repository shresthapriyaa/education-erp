import axios from "axios";
import type { Message } from "../types/message.types";

type MessagePayload = {
  receiverId: string;
  content: string;
};

export const messageApi = {
  getAll: async (filters?: { search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    const res = await axios.get(`/api/messages?${params.toString()}`);
    return res.data;
  },
  create: async (data: MessagePayload) => {
    const res = await axios.post("/api/messages", data);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await axios.delete(`/api/messages/${id}`);
    return res.data;
  },
};