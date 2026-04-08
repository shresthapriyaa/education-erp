"use client";

import { useState, useEffect, useCallback } from "react";

import type {
  SessionRecord,
  SessionFilters,
  CreateSessionPayload,
} from "../types/attendance.types";
import { sessionService } from "../services/sessions.service";

export function useSession(filters: SessionFilters = {}) {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await sessionService.getAll(filters);
      setSessions(res.sessions);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.classId, filters.teacherId, filters.dateFrom, filters.dateTo]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function createSession(
    payload: CreateSessionPayload,
  ): Promise<SessionRecord | null> {
    try {
      const session = await sessionService.create(payload);
      setSessions((prev) => [session, ...prev]);
      return session;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  }

  async function endSession(id: string) {
    try {
      const updated = await sessionService.endSession(id);
      setSessions((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, isOpen: false, endTime: updated.endTime } : s,
        ),
      );
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function deleteSession(id: string) {
    try {
      await sessionService.delete(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  }

  return {
    sessions,
    loading,
    error,
    refresh: fetchData,
    createSession,
    endSession,
    deleteSession,
  };
}




