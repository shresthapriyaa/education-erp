"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { Class } from "../types/class.types";
import { classApi } from "../services/class.api";

type ClassPayload = Partial<Class> & { teacherId?: string };

export function useClasses() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClasses = useCallback(async (filters?: { search?: string }) => {
    setLoading(true);
    try {
      const data = await classApi.getAll(filters);
      setClasses(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch classes");
      toast.error(err?.response?.data?.error || "Failed to fetch classes");
    } finally {
      setLoading(false);
    }
  }, []);

  const createClass = async (data: ClassPayload) => {
    setLoading(true);
    try {
      await classApi.create(data);
      toast.success("Class created successfully");
      await fetchClasses();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to create class");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateClass = async (id: string, data: ClassPayload) => {
    setLoading(true);
    try {
      await classApi.update(id, data);
      toast.success("Class updated successfully");
      await fetchClasses();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to update class");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const patchClass = async (id: string, data: ClassPayload) => {
    setLoading(true);
    try {
      await classApi.patch(id, data);
      toast.success("Class updated successfully");
      await fetchClasses();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to update class");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteClass = async (id: string) => {
    setLoading(true);
    try {
      await classApi.delete(id);
      toast.success("Class deleted successfully");
      setClasses((prev) => prev.filter((c) => c.id !== id));
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to delete class");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    classes,
    loading,
    error,
    fetchClasses,
    createClass,
    updateClass,
    patchClass,
    deleteClass,
  };
}