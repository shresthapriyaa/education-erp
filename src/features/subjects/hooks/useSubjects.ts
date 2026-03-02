"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { Subject } from "../types/subject.types";
import { subjectApi } from "../services/subject.api";

type SubjectPayload = Partial<Subject>;

export function useSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubjects = useCallback(async (filters?: { search?: string }) => {
    setLoading(true);
    try {
      const data = await subjectApi.getAll(filters);
      setSubjects(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch subjects");
      toast.error(err?.response?.data?.error || "Failed to fetch subjects");
    } finally {
      setLoading(false);
    }
  }, []);

  const createSubject = async (data: SubjectPayload) => {
    setLoading(true);
    try {
      await subjectApi.create(data);
      toast.success("Subject created successfully");
      await fetchSubjects();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to create subject");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateSubject = async (id: string, data: SubjectPayload) => {
    setLoading(true);
    try {
      await subjectApi.update(id, data);
      toast.success("Subject updated successfully");
      await fetchSubjects();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to update subject");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const patchSubject = async (id: string, data: SubjectPayload) => {
    setLoading(true);
    try {
      await subjectApi.patch(id, data);
      toast.success("Subject updated successfully");
      await fetchSubjects();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to update subject");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteSubject = async (id: string) => {
    setLoading(true);
    try {
      await subjectApi.delete(id);
      toast.success("Subject deleted successfully");
      setSubjects((prev) => prev.filter((s) => s.id !== id));
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to delete subject");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    subjects,
    loading,
    error,
    fetchSubjects,
    createSubject,
    updateSubject,
    patchSubject,
    deleteSubject,
  };
}