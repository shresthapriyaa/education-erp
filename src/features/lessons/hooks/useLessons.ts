"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { Lesson } from "../types/lesson.types";
import { lessonApi } from "../services/lesson.api";

type LessonPayload = Partial<Lesson>;

export function useLessons() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLessons = useCallback(async (filters?: { search?: string }) => {
    setLoading(true);
    try {
      const data = await lessonApi.getAll(filters);
      setLessons(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch lessons");
      toast.error(err?.response?.data?.error || "Failed to fetch lessons");
    } finally {
      setLoading(false);
    }
  }, []);

  const createLesson = async (data: LessonPayload) => {
    setLoading(true);
    try {
      await lessonApi.create(data);
      toast.success("Lesson created successfully");
      await fetchLessons();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to create lesson");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateLesson = async (id: string, data: LessonPayload) => {
    setLoading(true);
    try {
      await lessonApi.update(id, data);
      toast.success("Lesson updated successfully");
      await fetchLessons();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to update lesson");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const patchLesson = async (id: string, data: LessonPayload) => {
    setLoading(true);
    try {
      await lessonApi.patch(id, data);
      toast.success("Lesson updated successfully");
      await fetchLessons();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to update lesson");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteLesson = async (id: string) => {
    setLoading(true);
    try {
      await lessonApi.delete(id);
      toast.success("Lesson deleted successfully");
      setLessons((prev) => prev.filter((l) => l.id !== id));
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to delete lesson");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    lessons,
    loading,
    error,
    fetchLessons,
    createLesson,
    updateLesson,
    patchLesson,
    deleteLesson,
  };
}