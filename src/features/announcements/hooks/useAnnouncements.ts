"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { Announcement } from "../types/announcement.types";
import { announcementApi } from "../services/announcement.api";

type AnnouncementPayload = Partial<Announcement>;

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnnouncements = useCallback(async (filters?: { search?: string }) => {
    setLoading(true);
    try {
      const data = await announcementApi.getAll(filters);
      setAnnouncements(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch announcements");
      toast.error(err?.response?.data?.error || "Failed to fetch announcements");
    } finally {
      setLoading(false);
    }
  }, []);

  const createAnnouncement = async (data: AnnouncementPayload) => {
    setLoading(true);
    try {
      await announcementApi.create(data);
      toast.success("Announcement created successfully");
      await fetchAnnouncements();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to create announcement");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateAnnouncement = async (id: string, data: AnnouncementPayload) => {
    setLoading(true);
    try {
      await announcementApi.update(id, data);
      toast.success("Announcement updated successfully");
      await fetchAnnouncements();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to update announcement");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const patchAnnouncement = async (id: string, data: AnnouncementPayload) => {
    setLoading(true);
    try {
      await announcementApi.patch(id, data);
      toast.success("Announcement updated successfully");
      await fetchAnnouncements();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to update announcement");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteAnnouncement = async (id: string) => {
    setLoading(true);
    try {
      await announcementApi.delete(id);
      toast.success("Announcement deleted successfully");
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to delete announcement");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    announcements,
    loading,
    error,
    fetchAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    patchAnnouncement,
    deleteAnnouncement,
  };
}