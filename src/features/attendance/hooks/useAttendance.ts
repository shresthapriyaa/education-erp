// "use client";

// import { useState, useEffect, useCallback } from "react";
// import {
//   getAttendanceRecords,
//   getAttendanceSummary,
//   markStudentAttendance,
//   bulkMarkAttendance,
// } from "../services/attendance.api";
// import type {
//   AttendanceRecord,
//   AttendanceSummary,
//   AttendanceFilters,
//   MarkAttendancePayload,
//   BulkMarkAttendancePayload,
// } from "../types/attendance.types";

// // ─── Hook: fetch + filter attendance records ─────────────────────────────────
// export function useAttendance(filters: AttendanceFilters) {
//   const [records, setRecords] = useState<AttendanceRecord[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetch = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const data = await getAttendanceRecords(filters);
//       setRecords(data);
//     } catch (err: any) {
//       setError(err.message || "Failed to load attendance");
//     } finally {
//       setLoading(false);
//     }
//   }, [JSON.stringify(filters)]);

//   useEffect(() => {
//     fetch();
//   }, [fetch]);

//   return { records, loading, error, refetch: fetch };
// }

// // ─── Hook: attendance summary for a student ──────────────────────────────────
// export function useAttendanceSummary(studentId: string, month?: string) {
//   const [summary, setSummary] = useState<AttendanceSummary | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!studentId) return;
//     setLoading(true);
//     getAttendanceSummary(studentId, month)
//       .then(setSummary)
//       .catch((err) => setError(err.message))
//       .finally(() => setLoading(false));
//   }, [studentId, month]);

//   return { summary, loading, error };
// }

// // ─── Hook: mark own attendance (student) ─────────────────────────────────────
// export function useMarkAttendance() {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState(false);

//   const mark = async (payload: MarkAttendancePayload) => {
//     setLoading(true);
//     setError(null);
//     setSuccess(false);
//     try {
//       await markStudentAttendance(payload);
//       setSuccess(true);
//     } catch (err: any) {
//       setError(err.message || "Failed to mark attendance");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { mark, loading, error, success };
// }

// // ─── Hook: bulk mark attendance (teacher) ────────────────────────────────────
// export function useBulkMarkAttendance() {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState(false);

//   const bulkMark = async (payload: BulkMarkAttendancePayload) => {
//     setLoading(true);
//     setError(null);
//     setSuccess(false);
//     try {
//       await bulkMarkAttendance(payload);
//       setSuccess(true);
//     } catch (err: any) {
//       setError(err.message || "Failed to submit attendance");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { bulkMark, loading, error, success };
// }



"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getAttendanceRecords,
  getAttendanceSummary,
  markStudentAttendance,
  bulkMarkAttendance,
} from "../services/attendance.api";
import type {
  AttendanceRecord,
  AttendanceSummary,
  AttendanceFilters,
  MarkAttendancePayload,
  BulkMarkAttendancePayload,
} from "../types/attendance.types";

// ─── Hook: fetch + filter attendance records ─────────────────────────────────
export function useAttendance(filters: AttendanceFilters) {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAttendanceRecords(filters);
      setRecords(data);
    } catch (err: any) {
      setError(err.message || "Failed to load attendance");
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { records, loading, error, refetch: fetch };
}

// ─── Hook: attendance summary for a student ──────────────────────────────────
export function useAttendanceSummary(studentId: string, month?: string) {
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!studentId) return;
    setLoading(true);
    getAttendanceSummary(studentId, month)
      .then(setSummary)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [studentId, month]);

  return { summary, loading, error };
}

// ─── Hook: mark own attendance (student) ─────────────────────────────────────
export function useMarkAttendance() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const mark = async (payload: MarkAttendancePayload) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await markStudentAttendance(payload);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to mark attendance");
    } finally {
      setLoading(false);
    }
  };

  return { mark, loading, error, success };
}

// ─── Hook: bulk mark attendance (teacher) ────────────────────────────────────
export function useBulkMarkAttendance() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const bulkMark = async (payload: BulkMarkAttendancePayload) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await bulkMarkAttendance(payload);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to submit attendance");
    } finally {
      setLoading(false);
    }
  };

  return { bulkMark, loading, error, success };
}

// ─── Hook: geolocation state ─────────────────────────────────────────────────
interface GeolocationState {
  latitude:  number | null;
  longitude: number | null;
  accuracy:  number | null;
  loading:   boolean;
  error:     string | null;
}

export function useGeolocationState() {
  const [loc, setLoc] = useState<GeolocationState>({
    latitude:  null,
    longitude: null,
    accuracy:  null,
    loading:   false,
    error:     null,
  });

  const isSupported =
    typeof navigator !== "undefined" && "geolocation" in navigator;

  const request = useCallback(() => {
    if (!isSupported) {
      setLoc(s => ({ ...s, error: "Geolocation is not supported by this browser." }));
      return;
    }
    setLoc(s => ({ ...s, loading: true, error: null }));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoc({
          latitude:  pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy:  pos.coords.accuracy,
          loading:   false,
          error:     null,
        });
      },
      (err) => {
        const message =
          err.code === 1
            ? "Location permission denied. Please allow access in your browser settings."
            : err.code === 2
            ? "Location unavailable. Please try again."
            : err.code === 3
            ? "Location request timed out. Please try again."
            : "Failed to get location.";
        setLoc(s => ({ ...s, loading: false, error: message }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [isSupported]);

  return { loc, request, isSupported };
}