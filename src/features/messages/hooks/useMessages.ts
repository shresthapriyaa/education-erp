"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { Message } from "../types/message.types";
import { messageApi } from "../services/message.api";

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async (filters?: { search?: string }) => {
    setLoading(true);
    try {
      const data = await messageApi.getAll(filters);
      setMessages(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch messages");
      toast.error(err?.response?.data?.error || "Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = async (data: { receiverId: string; content: string }) => {
    setLoading(true);
    try {
      await messageApi.create(data);
      toast.success("Message sent successfully");
      await fetchMessages();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to send message");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const editMessage = async (id: string, data: { receiverId: string; content: string }) => {
    setLoading(true);
    try {
      await messageApi.update(id, data);
      toast.success("Message updated successfully");
      await fetchMessages();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to update message");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id: string) => {
    setLoading(true);
    try {
      await messageApi.delete(id);
      toast.success("Message deleted successfully");
      setMessages((prev) => prev.filter((m) => m.id !== id));
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to delete message");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    loading,
    error,
    fetchMessages,
    sendMessage,
    editMessage,
    deleteMessage,
  };
}