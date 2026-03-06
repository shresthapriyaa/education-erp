"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { Exam } from "../types/exam.types";
import { examApi } from "../services/exam.api";

type ExamPayload = Partial<Exam> & { subjectId?: string };

export function useExams() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExams = useCallback(async (filters?: { search?: string }) => {
    setLoading(true);
    try {
      const data = await examApi.getAll(filters);
      setExams(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch exams");
      toast.error(err?.response?.data?.error || "Failed to fetch exams");
    } finally {
      setLoading(false);
    }
  }, []);

  const createExam = async (data: ExamPayload) => {
    setLoading(true);
    try {
      await examApi.create(data);
      toast.success("Exam created successfully");
      await fetchExams();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to create exam");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateExam = async (id: string, data: ExamPayload) => {
    setLoading(true);
    try {
      await examApi.update(id, data);
      toast.success("Exam updated successfully");
      await fetchExams();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to update exam");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const patchExam = async (id: string, data: ExamPayload) => {
    setLoading(true);
    try {
      await examApi.patch(id, data);
      toast.success("Exam updated successfully");
      await fetchExams();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to update exam");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteExam = async (id: string) => {
    setLoading(true);
    try {
      await examApi.delete(id);
      toast.success("Exam deleted successfully");
      setExams((prev) => prev.filter((e) => e.id !== id));
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to delete exam");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    exams,
    loading,
    error,
    fetchExams,
    createExam,
    updateExam,
    patchExam,
    deleteExam,
  };
}