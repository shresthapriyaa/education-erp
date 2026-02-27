"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { Accountant } from "../types/accountant.types";
import { accountantApi } from "../services/accountant.api";

type AccountantPayload = Partial<Accountant> & { password?: string };

export function useAccountants() {
  const [accountants, setAccountants] = useState<Accountant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAccountants = useCallback(async (filters?: { search?: string }) => {
    setLoading(true);
    try {
      const data = await accountantApi.getAll(filters);
      setAccountants(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch accountants");
      toast.error(err?.response?.data?.error || "Failed to fetch accountants");
    } finally {
      setLoading(false);
    }
  }, []);

  const createAccountant = async (data: AccountantPayload) => {
    setLoading(true);
    try {
      await accountantApi.create(data);
      toast.success("Accountant created successfully");
      await fetchAccountants();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to create accountant");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateAccountant = async (id: string, data: AccountantPayload) => {
    setLoading(true);
    try {
      await accountantApi.update(id, data);
      toast.success("Accountant updated successfully");
      await fetchAccountants();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to update accountant");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const patchAccountant = async (id: string, data: AccountantPayload) => {
    setLoading(true);
    try {
      await accountantApi.patch(id, data);
      toast.success("Accountant updated successfully");
      await fetchAccountants();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to update accountant");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteAccountant = async (id: string) => {
    setLoading(true);
    try {
      await accountantApi.delete(id);
      toast.success("Accountant deleted successfully");
      setAccountants((prev) => prev.filter((a) => a.id !== id));
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to delete accountant");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    accountants,
    loading,
    error,
    fetchAccountants,
    createAccountant,
    updateAccountant,
    patchAccountant,
    deleteAccountant,
  };
}