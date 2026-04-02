"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { SchoolDTO, SchoolFormValues } from "../types/school.types";
import { createSchool, deleteSchool, fetchSchools, updateSchool } from "../services/school.api";


export function useSchools() {
  const [schools, setSchools] = useState<SchoolDTO[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (search = "") => {
    setLoading(true);
    try {
      const data = await fetchSchools(search);
      setSchools(data);
    } catch {
      toast.error("Failed to load schools.");
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (values: SchoolFormValues) => {
    setLoading(true);
    try {
      const created = await createSchool(values);
      setSchools(p => [created, ...p]);
      toast.success("School created.");
    } catch (e: any) {
      toast.error(e?.response?.data?.error ?? "Failed to create school.");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (id: string, values: SchoolFormValues) => {
    setLoading(true);
    try {
      const updated = await updateSchool(id, values);
      setSchools(p => p.map(s => s.id === id ? updated : s));
      toast.success("School updated.");
    } catch (e: any) {
      toast.error(e?.response?.data?.error ?? "Failed to update school.");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await deleteSchool(id);
      setSchools(p => p.filter(s => s.id !== id));
      toast.success("School deleted.");
    } catch (e: any) {
      toast.error(e?.response?.data?.error ?? "Failed to delete school.");
    } finally {
      setLoading(false);
    }
  }, []);

  return { schools, loading, load, create, update, remove };
}