"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { Fee } from "../types/fee.types";
import { feeApi } from "../services/fee.api";

type FeePayload = Partial<Fee> & { studentId?: string };

export function useFees() {
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFees = useCallback(async (filters?: { search?: string }) => {
    setLoading(true);
    try {
      const data = await feeApi.getAll(filters);
      setFees(data);
    } catch (err: any) {
      setError(err.message);
      toast.error(err?.response?.data?.error || "Failed to fetch fees");
    } finally {
      setLoading(false);
    }
  }, []);

  const createFee = async (data: FeePayload) => {
    setLoading(true);
    try {
      await feeApi.create(data);
      toast.success("Fee created successfully");
      await fetchFees();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to create fee");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateFee = async (id: string, data: FeePayload) => {
    setLoading(true);
    try {
      await feeApi.update(id, data);
      toast.success("Fee updated successfully");
      await fetchFees();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to update fee");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const patchFee = async (id: string, data: FeePayload) => {
    setLoading(true);
    try {
      await feeApi.patch(id, data);
      toast.success("Fee updated successfully");
      await fetchFees();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to update fee");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteFee = async (id: string) => {
    setLoading(true);
    try {
      await feeApi.delete(id);
      toast.success("Fee deleted successfully");
      setFees((prev) => prev.filter((f) => f.id !== id));
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to delete fee");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    fees, loading, error,
    fetchFees, createFee, updateFee, patchFee, deleteFee,
  };
}