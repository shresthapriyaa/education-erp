"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { Parent } from "../types/parent.types";
import { parentApi } from "../services/parent.api";

type ParentPayload = Partial<Parent> & { password?: string };

export function useParents() {
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchParents = useCallback(async (filters?: { search?: string }) => {
    setLoading(true);
    try {
      const data = await parentApi.getAll(filters);
      setParents(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch parents");
      toast.error(err?.response?.data?.error || "Failed to fetch parents");
    } finally {
      setLoading(false);
    }
  }, []);

  const createParent = async (data: ParentPayload) => {
    setLoading(true);
    try {
      await parentApi.create(data);
      toast.success("Parent created successfully");
      await fetchParents();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to create parent");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateParent = async (id: string, data: ParentPayload) => {
    setLoading(true);
    try {
      await parentApi.update(id, data);
      toast.success("Parent updated successfully");
      await fetchParents();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to update parent");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const patchParent = async (id: string, data: ParentPayload) => {
    setLoading(true);
    try {
      await parentApi.patch(id, data);
      toast.success("Parent updated successfully");
      await fetchParents();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to update parent");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteParent = async (id: string) => {
    setLoading(true);
    try {
      await parentApi.delete(id);
      toast.success("Parent deleted successfully");
      setParents((prev) => prev.filter((p) => p.id !== id));
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to delete parent");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    parents,
    loading,
    error,
    fetchParents,
    createParent,
    updateParent,
    patchParent,
    deleteParent,
  };
}