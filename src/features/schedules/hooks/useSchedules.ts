"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { Schedule } from "../types/schedule.types";
import { scheduleApi } from "../services/schedule.api";

type SchedulePayload = Partial<Schedule> & { classId?: string; subjectId?: string };

export function useSchedules() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedules = useCallback(async (filters?: { search?: string }) => {
    setLoading(true);
    try {
      const data = await scheduleApi.getAll(filters);
      setSchedules(data);
    } catch (err: any) {
      setError(err.message);
      toast.error(err?.response?.data?.error || "Failed to fetch schedules");
    } finally {
      setLoading(false);
    }
  }, []);

  const createSchedule = async (data: SchedulePayload) => {
    setLoading(true);
    try {
      await scheduleApi.create(data);
      toast.success("Schedule created successfully");
      await fetchSchedules();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to create schedule");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateSchedule = async (id: string, data: SchedulePayload) => {
    setLoading(true);
    try {
      await scheduleApi.update(id, data);
      toast.success("Schedule updated successfully");
      await fetchSchedules();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to update schedule");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const patchSchedule = async (id: string, data: SchedulePayload) => {
    setLoading(true);
    try {
      await scheduleApi.patch(id, data);
      toast.success("Schedule updated successfully");
      await fetchSchedules();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to update schedule");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteSchedule = async (id: string) => {
    setLoading(true);
    try {
      await scheduleApi.delete(id);
      toast.success("Schedule deleted successfully");
      setSchedules((prev) => prev.filter((s) => s.id !== id));
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to delete schedule");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    schedules, loading, error,
    fetchSchedules, createSchedule, updateSchedule, patchSchedule, deleteSchedule,
  };
}