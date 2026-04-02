"use client";
import { useState, useEffect, useCallback } from "react";
import type {
  AttendanceRecord,
  AttendanceStats,
  AttendanceFilters,
  AttendanceStatus,
} from "../types/attendance.types";
import { attendanceService } from "../services/attendance.services";

export function useAttendance(filters: AttendanceFilters = {}) {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [stats,   setStats]   = useState<AttendanceStats>({
    total: 0, present: 0, absent: 0, late: 0, excused: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await attendanceService.getAll(filters);
      setRecords(res.records);
      setStats(res.stats);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status, filters.dateFrom, filters.dateTo, filters.classId, filters.search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function editRecord(id: string, status: AttendanceStatus) {
    try {
      await attendanceService.update(id, { status });
      setRecords(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function deleteRecord(id: string) {
    try {
      await attendanceService.delete(id);
      setRecords(prev => prev.filter(r => r.id !== id));
      setStats(prev => ({ ...prev, total: prev.total - 1 }));
    } catch (err: any) {
      setError(err.message);
    }
  }

  return {
    records, stats, loading, error,
    refresh: fetchData,
    refetch: fetchData,
    editRecord,
    deleteRecord,
  };
}

// ─── useGeolocationState — device GPS ────────────────────────────────────────

interface GeolocationState {
  latitude:  number | null;
  longitude: number | null;
  accuracy:  number | null;
  loading:   boolean;
  error:     string | null;
}

export function useGeolocationState() {
  const [loc, setLoc] = useState<GeolocationState>({
    latitude: null, longitude: null, accuracy: null,
    loading: false, error: null,
  });

  const isSupported =
    typeof navigator !== "undefined" && "geolocation" in navigator;

  const request = useCallback(() => {
    if (!isSupported) {
      setLoc(s => ({ ...s, error: "Geolocation not supported." }));
      return;
    }
    setLoc(s => ({ ...s, loading: true, error: null }));
    navigator.geolocation.getCurrentPosition(
      (pos) => setLoc({
        latitude:  pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy:  pos.coords.accuracy,
        loading:   false,
        error:     null,
      }),
      (err) => {
        const message =
          err.code === 1 ? "Location permission denied." :
          err.code === 2 ? "Location unavailable." :
          err.code === 3 ? "Location timed out." : "Failed to get location.";
        setLoc(s => ({ ...s, loading: false, error: message }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [isSupported]);

  return { loc, request, isSupported };
}