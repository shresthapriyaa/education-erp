"use client";

/**
 * src/features/attendance/hooks/useAttendance.ts
 */

import { useState, useCallback, useEffect } from "react";
import {
  fetchOpenSessions,
  fetchAttendanceList,
  fetchAttendanceById,
  markAttendance,
  createAttendance,
  updateAttendance,
  deleteAttendance,
} from "../services/attendance.api";
import type {
  AttendanceDTO,
  AttendanceFilters,
  AttendanceFormValues,
  AttendanceSummary,
  LocationState,
  MarkAttendanceBody,
  MarkAttendanceResponse,
  SessionDTO,
} from "../types/attendance.types";

// ─── Geolocation state (used inside AttendanceDialog) ────────────────────────

export function useGeolocationState() {
  const [loc, setLoc] = useState<LocationState>({
    latitude: null, longitude: null,
    accuracy: null, error: null,
    loading: false, timestamp: null,
  });

  const isSupported =
    typeof window !== "undefined" && "geolocation" in navigator;

  const request = useCallback(() => {
    if (!isSupported) {
      setLoc(p => ({ ...p, error: "Geolocation not supported by this browser.", loading: false }));
      return;
    }
    setLoc(p => ({ ...p, loading: true, error: null }));
    navigator.geolocation.getCurrentPosition(
      pos => setLoc({
        latitude:  pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy:  pos.coords.accuracy,
        error:     null,
        loading:   false,
        timestamp: pos.timestamp,
      }),
      err => {
        const msgs: Record<number, string> = {
          1: "Location denied. Allow location access in browser settings.",
          2: "Location unavailable. Enable GPS or WiFi.",
          3: "Location timed out. Move near a window and retry.",
        };
        setLoc(p => ({ ...p, error: msgs[err.code] ?? "Unknown error.", loading: false }));
      },
      { enableHighAccuracy: true, timeout: 15_000, maximumAge: 30_000 }
    );
  }, [isSupported]);

  const clear = useCallback(() =>
    setLoc({ latitude: null, longitude: null, accuracy: null, error: null, loading: false, timestamp: null }),
    []
  );

  return { loc, request, clear, isSupported };
}

// ─── Main hook ────────────────────────────────────────────────────────────────

interface UseAttendanceOptions {
  userId:             string;
  autoLoadSessions?:  boolean;
  autoLoadList?:      boolean;
  initialFilters?:    Partial<AttendanceFilters>;
}

export function useAttendance({
  userId,
  autoLoadSessions = false,
  autoLoadList     = false,
  initialFilters   = {},
}: UseAttendanceOptions) {

  // ── Open sessions (student) ───────────────────────────────────────────────
  const [sessions,        setSessions]        = useState<SessionDTO[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionsError,   setSessionsError]   = useState<string | null>(null);

  const loadSessions = useCallback(async () => {
    setSessionsLoading(true);
    setSessionsError(null);
    try {
      const data = await fetchOpenSessions(userId);
      setSessions(data);
    } catch (e: any) {
      setSessionsError(e.message);
    } finally {
      setSessionsLoading(false);
    }
  }, [userId]);

  // ── Attendance list (admin) ───────────────────────────────────────────────
  const [records,      setRecords]      = useState<AttendanceDTO[]>([]);
  const [summary,      setSummary]      = useState<AttendanceSummary | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [listLoading,  setListLoading]  = useState(false);
  const [listError,    setListError]    = useState<string | null>(null);

  const [filters, setFilters] = useState<AttendanceFilters>({
    status: "", classId: "", dateFrom: "", dateTo: "",
    search: "", page: 1, pageSize: 20,
    ...initialFilters,
  });

  const loadList = useCallback(async (f?: Partial<AttendanceFilters>) => {
    setListLoading(true);
    setListError(null);
    try {
      const merged = { ...filters, ...f };
      const data   = await fetchAttendanceList(userId, merged);
      setRecords(data.records);
      setSummary(data.summary);
      setTotalRecords(data.total);
    } catch (e: any) {
      setListError(e.message);
    } finally {
      setListLoading(false);
    }
  }, [userId, filters]);

  const updateFilter = useCallback(<K extends keyof AttendanceFilters>(
    key: K, value: AttendanceFilters[K]
  ) => {
    setFilters(p => ({ ...p, [key]: value, ...(key !== "page" ? { page: 1 } : {}) }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ status: "", classId: "", dateFrom: "", dateTo: "", search: "", page: 1, pageSize: 20 });
  }, []);

  // ── Single record ─────────────────────────────────────────────────────────
  const [selected,      setSelected]      = useState<AttendanceDTO | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadById = useCallback(async (id: string) => {
    setDetailLoading(true);
    try {
      const data = await fetchAttendanceById(userId, id);
      setSelected(data);
    } finally {
      setDetailLoading(false);
    }
  }, [userId]);

  // ── Mark attendance (student GPS) ─────────────────────────────────────────
  const [markResult, setMarkResult] = useState<MarkAttendanceResponse | null>(null);
  const [marking,    setMarking]    = useState(false);

  const mark = useCallback(async (body: MarkAttendanceBody) => {
    setMarking(true);
    setMarkResult(null);
    try {
      const res = await markAttendance(userId, body);
      setMarkResult(res);
      if (res.success) loadList();
      return res;
    } catch {
      const err: MarkAttendanceResponse = { success: false, error: "Network error." };
      setMarkResult(err);
      return err;
    } finally {
      setMarking(false);
    }
  }, [userId, loadList]);

  const clearMarkResult = useCallback(() => setMarkResult(null), []);

  // ── Admin CRUD ────────────────────────────────────────────────────────────
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(false);

  const create = useCallback(async (values: AttendanceFormValues) => {
    setSaving(true);
    try {
      const rec = await createAttendance(userId, values);
      setRecords(p => [rec, ...p]);
      return rec;
    } finally {
      setSaving(false);
    }
  }, [userId]);

  const update = useCallback(async (id: string, values: Partial<AttendanceFormValues>) => {
    setSaving(true);
    try {
      const rec = await updateAttendance(userId, id, values);
      setRecords(p => p.map(r => r.id === id ? rec : r));
      if (selected?.id === id) setSelected(rec);
      return rec;
    } finally {
      setSaving(false);
    }
  }, [userId, selected]);

  const remove = useCallback(async (id: string) => {
    setDeleting(true);
    try {
      await deleteAttendance(userId, id);
      setRecords(p => p.filter(r => r.id !== id));
      if (selected?.id === id) setSelected(null);
    } finally {
      setDeleting(false);
    }
  }, [userId, selected]);

  // ── Auto-load ─────────────────────────────────────────────────────────────
  useEffect(() => { if (autoLoadSessions) loadSessions(); }, [autoLoadSessions]);
  useEffect(() => { if (autoLoadList)     loadList();     }, [autoLoadList]);

  return {
    // sessions
    sessions, sessionsLoading, sessionsError, loadSessions,
    // list + filters
    records, summary, totalRecords, listLoading, listError,
    filters, updateFilter, resetFilters, loadList,
    // single
    selected, detailLoading, loadById, setSelected,
    // mark
    markResult, marking, mark, clearMarkResult,
    // admin crud
    saving, deleting, create, update, remove,
  };
}