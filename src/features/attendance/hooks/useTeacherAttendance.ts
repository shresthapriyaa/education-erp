"use client";

import { useState, useEffect } from "react";
import type { AttendanceStatus } from "../types/attendance.types";
import { haversineDistance } from "@/core/lib/haversineDistance";

export type ClassItem = {
  id:        string;
  name:      string;
  teacherId: string;
  teacher?:  { id: string; username: string; email: string };
  schedules?: Array<{
    subject: { name: string };
    day: string;
    startTime: string;
    endTime: string;
  }>;
  _count:    { students: number };
};

export type StudentRow = {
  studentId: string;
  username:  string;
  email:     string;
  status:    AttendanceStatus | null; // null = not yet marked
};

export type GeofenceState =
  | "idle"
  | "requesting"
  | "verifying"
  | "success"
  | "failed";

export function useTeacherAttendance(editDate?: Date) {
  const [classes,        setClasses]        = useState<ClassItem[]>([]);
  const [classesLoading, setClassesLoading] = useState(true);
  const [classesError,   setClassesError]   = useState<string | null>(null);

  const [activeClass,    setActiveClass]    = useState<ClassItem | null>(null);
  const [students,       setStudents]       = useState<StudentRow[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError,  setStudentsError]  = useState<string | null>(null);

  // One-by-one index
  const [currentIndex,   setCurrentIndex]   = useState(0);

  // Geofence
  const [geoState,       setGeoState]       = useState<GeofenceState>("idle");
  const [geoError,       setGeoError]       = useState<string | null>(null);
  const [geoDistance,    setGeoDistance]    = useState<number | null>(null);

  // Save
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const isEditMode = !!editDate;

  // Fetch teacher's classes
  useEffect(() => {
    async function load() {
      setClassesLoading(true);
      setClassesError(null);
      try {
        const res = await fetch("/api/classes?teacherOnly=true");
        if (!res.ok) throw new Error("Failed to load classes");
        const data = await res.json();
        setClasses(data);
      } catch (e: any) {
        setClassesError(e.message);
      } finally {
        setClassesLoading(false);
      }
    }
    load();
  }, []);

  // Step 1: teacher clicks "Take Attendance" → verify location (skip in edit mode)
  async function selectClass(cls: ClassItem) {
    setActiveClass(cls);
    setSaved(false);
    setSaveError(null);
    setCurrentIndex(0);
    setStudents([]);

    // Skip geofence in edit mode
    if (isEditMode) {
      setGeoState("success");
      await loadStudents(cls);
      return;
    }

    // Normal mode - verify location
    setGeoState("requesting");
    setGeoError(null);
    setGeoDistance(null);

    if (!navigator.geolocation) {
      setGeoState("failed");
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setGeoState("verifying");
        try {
          // Fetch school zone settings
          const res = await fetch("/api/attendance/geofence");
          if (!res.ok) {
            throw new Error("Could not load school zone settings.");
          }
          const school = await res.json();

          if (!school.latitude || !school.longitude || !school.radiusMeters) {
            throw new Error("School GPS zone not configured. Ask admin to set it up.");
          }

          const dist = haversineDistance(
            { latitude: pos.coords.latitude, longitude: pos.coords.longitude },
            { latitude: school.latitude,     longitude: school.longitude },
          );
          setGeoDistance(Math.round(dist));

          // Enhanced accuracy check for Nepal conditions
          const gpsAccuracy = pos.coords.accuracy || 0;
          const buffer = gpsAccuracy > 0 ? Math.min(gpsAccuracy * 0.7, 30) : 15;
          const effectiveRadius = school.radiusMeters + buffer;

          if (dist > effectiveRadius) {
            setGeoState("failed");
            setGeoError(
              `You are ${Math.round(dist)}m from school (allowed: ${school.radiusMeters}m + ${Math.round(buffer)}m GPS buffer = ${Math.round(effectiveRadius)}m total). ` +
              `GPS accuracy: ±${Math.round(gpsAccuracy)}m. Please move closer to school.`
            );
            return;
          }

          // Location verified — load students
          setGeoState("success");
          await loadStudents(cls);
        } catch (e: any) {
          setGeoState("failed");
          setGeoError(e.message);
        }
      },
      (err) => {
        const msgs: Record<number, string> = {
          1: "Location permission denied. Please allow location access and try again.",
          2: "Location unavailable. Please try again.",
          3: "Location request timed out. Please try again.",
        };
        setGeoState("failed");
        setGeoError(msgs[err.code] ?? "Failed to get your location.");
      },
      { 
        enableHighAccuracy: true, 
        timeout: 15000, 
        maximumAge: 0,
      }
    );
  }

  // Bypass location check and proceed anyway
  async function continueAnyway() {
    if (!activeClass) return;
    setGeoState("success");
    await loadStudents(activeClass);
  }

  async function loadStudents(cls: ClassItem) {
    setStudentsLoading(true);
    setStudentsError(null);
    try {
      const res = await fetch(`/api/students?classId=${cls.id}&pageSize=200`);
      if (!res.ok) throw new Error("Failed to load students");
      const data = await res.json();
      const list = (data.students ?? data.data ?? data ?? []).map((s: any) => ({
        studentId: s.id,
        username:  s.username,
        email:     s.email,
        status:    null,
      }));

      // If in edit mode, load existing attendance
      if (isEditMode && editDate) {
        const dateStr = editDate.toISOString().split("T")[0];
        console.log("🔍 Edit mode: Loading attendance for", dateStr, "classId:", cls.id);
        try {
          const attRes = await fetch(`/api/attendance?classId=${cls.id}&date=${dateStr}`);
          if (attRes.ok) {
            const attData = await attRes.json();
            console.log("📊 Attendance data received:", attData);
            // API returns {records: [...], stats: {...}, total: number}
            const records = attData.records || [];
            console.log("📝 Found", records.length, "attendance records");
            if (records.length > 0) {
              // Map existing attendance to students
              const attMap = new Map(records.map((a: any) => [a.studentId, a.status]));
              list.forEach((student: StudentRow) => {
                const existingStatus = attMap.get(student.studentId);
                if (existingStatus) {
                  student.status = existingStatus;
                  console.log("✅ Loaded status for", student.username, ":", existingStatus);
                }
              });
            }
          } else {
            console.log("⚠️ Attendance API returned error:", attRes.status);
          }
        } catch (e) {
          console.error("❌ Failed to load existing attendance:", e);
        }
      }

      setStudents(list);
      setCurrentIndex(0);
    } catch (e: any) {
      setStudentsError(e.message);
    } finally {
      setStudentsLoading(false);
    }
  }

  // Mark current student and advance
  function markStudent(status: AttendanceStatus) {
    setStudents(prev =>
      prev.map((s, i) => i === currentIndex ? { ...s, status } : s)
    );
    setCurrentIndex(prev => prev + 1);
    setSaved(false);
  }

  // Toggle status for a specific student (for edit mode)
  function toggleStudentStatus(studentId: string, newStatus: AttendanceStatus) {
    setStudents(prev =>
      prev.map(s => s.studentId === studentId ? { ...s, status: newStatus } : s)
    );
    setSaved(false);
  }

  // Go back to previous student
  function prevStudent() {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  }

  const isComplete = students.length > 0 && currentIndex >= students.length;

  async function saveAttendance() {
    if (!activeClass) return;
    setSaving(true);
    setSaveError(null);
    try {
      const dateToSave = isEditMode && editDate 
        ? editDate.toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];
      
      const marked = students.filter(s => s.status !== null);

      const attRes = await fetch("/api/attendance", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          classId: activeClass.id,
          date:    dateToSave,
          records: marked.map(({ studentId, status }) => ({ studentId, status })),
        }),
      });
      
      if (!attRes.ok) {
        const error = await attRes.json();
        throw new Error(error.error || "Failed to save attendance");
      }

      setSaved(true);
    } catch (e: any) {
      setSaveError(e.message);
    } finally {
      setSaving(false);
    }
  }

  function resetClass() {
    setActiveClass(null);
    setGeoState("idle");
    setGeoError(null);
    setGeoDistance(null);
    setStudents([]);
    setCurrentIndex(0);
    setSaved(false);
    setSaveError(null);
  }

  return {
    classes, classesLoading, classesError,
    activeClass, resetClass,
    students, studentsLoading, studentsError,
    currentIndex, isComplete,
    geoState, geoError, geoDistance,
    saving, saved, saveError,
    selectClass, markStudent, toggleStudentStatus, prevStudent, saveAttendance, continueAnyway,
  };
}
