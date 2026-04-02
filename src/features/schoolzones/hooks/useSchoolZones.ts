"use client";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { SchoolZone } from "../types/Schoolzone.types";
// import { schoolZoneApi } from "../services/Schoolzone.api";
import { SchoolZonePayload } from "../components/SchoolzoneForm";
import { schoolZoneApi } from "../services/schoolzone.api";
export function useSchoolZones() {
  const [zones,   setZones]   = useState<SchoolZone[]>([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const fetchZones = useCallback(async (filters?: { search?: string }) => {
    setLoading(true);
    try {
      const data = await schoolZoneApi.getAll(filters);
      setZones(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch zones");
      toast.error("Failed to fetch school zones");
    } finally {
      setLoading(false);
    }
  }, []);

  const createZone = async (data: SchoolZonePayload) => {
    setLoading(true);
    try {
      await schoolZoneApi.create(data);
      toast.success("School zone created successfully");
      await fetchZones();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to create zone");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateZone = async (id: string, data: SchoolZonePayload) => {
    setLoading(true);
    try {
      await schoolZoneApi.update(id, data);
      toast.success("School zone updated successfully");
      await fetchZones();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to update zone");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteZone = async (id: string) => {
    setLoading(true);
    try {
      await schoolZoneApi.delete(id);
      toast.success("School zone deleted successfully");
      setZones((prev) => prev.filter((z) => z.id !== id));
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to delete zone");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    zones, loading, error,
    fetchZones, createZone, updateZone, deleteZone,
  };
}