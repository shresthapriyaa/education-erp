"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

import type { Student } from "../types/student.types";
import { studentApi } from "../services/student.api";

export interface StudentFiltersState {
  search: string;
  sex?: string | "all";
  bloodGroup?: string | "all";
}

type StudentPayload = Partial<Student> & { password?: string };

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async (filters?: StudentFiltersState) => {
    setLoading(true);
    try {
      const data = await studentApi.getAll(filters);
      setStudents(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch students");
      toast.error(err?.response?.data?.error || "Failed to fetch students");
    } finally {
      setLoading(false);
    }
  }, []);

  const createStudent = async (data: StudentPayload) => {
    setLoading(true);
    try {
      await studentApi.create(data);
      toast.success("Student created successfully");
      await fetchStudents();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to create student");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateStudent = async (id: string, data: StudentPayload) => {
    setLoading(true);
    try {
      await studentApi.update(id, data);
      toast.success("Student updated successfully");
      await fetchStudents();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to update student");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const patchStudent = async (id: string, data: StudentPayload) => {
    setLoading(true);
    try {
      await studentApi.patch(id, data);
      toast.success("Student updated successfully");
      await fetchStudents();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to update student");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (id: string) => {
    setLoading(true);
    try {
      await studentApi.delete(id);
      toast.success("Student deleted successfully");
      setStudents((prev) => prev.filter((s) => s.id !== id));
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to delete student");
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return {
    students,
    loading,
    error,
    fetchStudents,
    createStudent,
    updateStudent,
    patchStudent,
    deleteStudent,
  };
}