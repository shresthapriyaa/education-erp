"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { SessionDTO, SessionFormValues } from "../types/session.types";
import { createSession,   deleteSession, fetchSessions, toggleSession,  updateSession } from "../services/session.api";
export function useSessions() {
  const [sessions, setSessions] = useState<SessionDTO[]>([]);
  const [loading,  setLoading]  = useState(false);

  const load = useCallback(async (params?: {
    classId?:  string;
    schoolId?: string;
  }) => {
    setLoading(true);
    try {
      const data = await fetchSessions(params);
      setSessions(data);
    } catch {
      toast.error("Failed to load sessions.");
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (values: SessionFormValues) => {
    setLoading(true);
    try {
      const created = await createSession(values);
      setSessions(p => [created, ...p]);
      toast.success("Session created.");
    } catch (e: any) {
      toast.error(e?.response?.data?.error ?? "Failed to create session.");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (id: string, values: Partial<SessionFormValues>) => {
    setLoading(true);
    try {
      const updated = await updateSession(id, values);
      setSessions(p => p.map(s => s.id === id ? updated : s));
      toast.success("Session updated.");
    } catch (e: any) {
      toast.error(e?.response?.data?.error ?? "Failed to update session.");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggle = useCallback(async (id: string, isOpen: boolean) => {
    try {
      const updated = await toggleSession(id, isOpen);
      setSessions(p => p.map(s => s.id === id ? updated : s));
      toast.success(isOpen ? "Session opened." : "Session closed.");
    } catch {
      toast.error("Failed to update session.");
    }
  }, []);

  const remove = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await deleteSession(id);
      setSessions(p => p.filter(s => s.id !== id));
      toast.success("Session deleted.");
    } catch {
      toast.error("Failed to delete session.");
    } finally {
      setLoading(false);
    }
  }, []);

  return { sessions, loading, load, create, update, toggle, remove };
}