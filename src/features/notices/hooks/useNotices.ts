"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { Notice } from "../types/notice.types";
import { noticeApi } from "../services/notice.api";

type NoticePayload = Partial<Notice>;

export function useNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotices = useCallback(async (filters?: { search?: string }) => {
    setLoading(true);
    try {
      const data = await noticeApi.getAll(filters);
      setNotices(data);
    } catch (err: any) {
      setError(err.message);
      toast.error(err?.response?.data?.error || "Failed to fetch notices");
    } finally {
      setLoading(false);
    }
  }, []);

  const createNotice = async (data: NoticePayload) => {
    setLoading(true);
    try {
      await noticeApi.create(data);
      toast.success("Notice created successfully");
      await fetchNotices();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to create notice");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateNotice = async (id: string, data: NoticePayload) => {
    setLoading(true);
    try {
      await noticeApi.update(id, data);
      toast.success("Notice updated successfully");
      await fetchNotices();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to update notice");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const patchNotice = async (id: string, data: NoticePayload) => {
    setLoading(true);
    try {
      await noticeApi.patch(id, data);
      toast.success("Notice updated successfully");
      await fetchNotices();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to update notice");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteNotice = async (id: string) => {
    setLoading(true);
    try {
      await noticeApi.delete(id);
      toast.success("Notice deleted successfully");
      setNotices((prev) => prev.filter((n) => n.id !== id));
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to delete notice");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    notices, loading, error,
    fetchNotices, createNotice, updateNotice, patchNotice, deleteNotice,
  };
}