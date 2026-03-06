"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { Result } from "../types/result.types";
import { resultApi } from "../services/result.api";

type ResultPayload = Partial<Result> & { studentId?: string; subjectId?: string };

export function useResults() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = useCallback(async (filters?: { search?: string }) => {
    setLoading(true);
    try {
      const data = await resultApi.getAll(filters);
      setResults(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch results");
      toast.error(err?.response?.data?.error || "Failed to fetch results");
    } finally {
      setLoading(false);
    }
  }, []);

  const createResult = async (data: ResultPayload) => {
    setLoading(true);
    try {
      await resultApi.create(data);
      toast.success("Result created successfully");
      await fetchResults();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to create result");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateResult = async (id: string, data: ResultPayload) => {
    setLoading(true);
    try {
      await resultApi.update(id, data);
      toast.success("Result updated successfully");
      await fetchResults();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to update result");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const patchResult = async (id: string, data: ResultPayload) => {
    setLoading(true);
    try {
      await resultApi.patch(id, data);
      toast.success("Result updated successfully");
      await fetchResults();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to update result");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteResult = async (id: string) => {
    setLoading(true);
    try {
      await resultApi.delete(id);
      toast.success("Result deleted successfully");
      setResults((prev) => prev.filter((r) => r.id !== id));
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to delete result");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    results,
    loading,
    error,
    fetchResults,
    createResult,
    updateResult,
    patchResult,
    deleteResult,
  };
}