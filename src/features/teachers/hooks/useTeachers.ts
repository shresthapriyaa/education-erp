"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { Teacher } from "../types/teacher.types";
import { teacherApi } from "../services/teacher.api";

type TeacherPayload = Partial<Teacher> & { password?: string };

export function useTeachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeachers = useCallback(async (filters?: { search?: string }) => {
    setLoading(true);
    try {
      const data = await teacherApi.getAll(filters);
      setTeachers(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch teachers");
      toast.error(err?.response?.data?.error || "Failed to fetch teachers");
    } finally {
      setLoading(false);
    }
  }, []);

  const createTeacher = async (data: TeacherPayload) => {
    setLoading(true);
    try {
      await teacherApi.create(data);
      toast.success("Teacher created successfully");
      await fetchTeachers();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to create teacher");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateTeacher = async (id: string, data: TeacherPayload) => {
    setLoading(true);
    try {
      await teacherApi.update(id, data);
      toast.success("Teacher updated successfully");
      await fetchTeachers();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to update teacher");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const patchTeacher = async (id: string, data: TeacherPayload) => {
    setLoading(true);
    try {
      await teacherApi.patch(id, data);
      toast.success("Teacher updated successfully");
      await fetchTeachers();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to update teacher");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteTeacher = async (id: string) => {
    setLoading(true);
    try {
      await teacherApi.delete(id);
      toast.success("Teacher deleted successfully");
      setTeachers((prev) => prev.filter((t) => t.id !== id));
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to delete teacher");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    teachers,
    loading,
    error,
    fetchTeachers,
    createTeacher,
    updateTeacher,
    patchTeacher,
    deleteTeacher,
  };
}