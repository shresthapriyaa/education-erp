"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { Assignment } from "../types/assignment.types";
import { assignmentApi } from "../services/assignment.api";

type AssignmentPayload = Partial<Assignment>;

export function useAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAssignments = useCallback(async (filters?: { search?: string }) => {
    setLoading(true);
    try {
      const data = await assignmentApi.getAll(filters);
      setAssignments(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch assignments");
      toast.error(err?.response?.data?.error || "Failed to fetch assignments");
    } finally {
      setLoading(false);
    }
  }, []);

  const createAssignment = async (data: AssignmentPayload) => {
    setLoading(true);
    try {
      await assignmentApi.create(data);
      toast.success("Assignment created successfully");
      await fetchAssignments();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to create assignment");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateAssignment = async (id: string, data: AssignmentPayload) => {
    setLoading(true);
    try {
      await assignmentApi.update(id, data);
      toast.success("Assignment updated successfully");
      await fetchAssignments();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to update assignment");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const patchAssignment = async (id: string, data: AssignmentPayload) => {
    setLoading(true);
    try {
      await assignmentApi.patch(id, data);
      toast.success("Assignment updated successfully");
      await fetchAssignments();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to update assignment");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteAssignment = async (id: string) => {
    setLoading(true);
    try {
      await assignmentApi.delete(id);
      toast.success("Assignment deleted successfully");
      setAssignments((prev) => prev.filter((a) => a.id !== id));
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to delete assignment");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    assignments,
    loading,
    error,
    fetchAssignments,
    createAssignment,
    updateAssignment,
    patchAssignment,
    deleteAssignment,
  };
}