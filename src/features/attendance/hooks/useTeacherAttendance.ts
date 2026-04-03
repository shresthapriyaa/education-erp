"use client";

import { useState, useEffect } from "react";
import type { AttendanceStatus } from "../types/attendance.types";

export type ClassItem = {
  id:        string;
  name:      string;
  teacherId: string;
  _count:    { students: number };
};

export type StudentRow = {
  studentId: string;
  username:  string;
  email:     string;
  status:    AttendanceStatus;
};

export function useTeacherAttendance() {
  const [classes,       setClasses]       = useState<ClassItem[]>([]);
  const [classesLoading, setClassesLoading] = useState(true);
  const [classesError,  setClassesError]  = useState<string | null>(null);

  const [activeClass,   setActiveClass]   = useState<ClassItem | null>(null);
  const [students,      setStudents]      = useState<StudentRow[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState<string | null>(null);

  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

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

  // Fetch students when a class is selected
  async function selectClass(cls: ClassItem) {
    setActiveClass(cls);
    setStudentsLoading(true);
    setStudentsError(null);
    setSaved(false);
    setSaveError(null);
    try {
      const res = await fetch(`/api/students?classId=${cls.id}&pageSize=200`);
      if (!res.ok) throw new Error("Failed to load students");
      const data = await res.json();
      const list = (data.students ?? data.data ?? data ?? []).map((s: any) => ({
        studentId: s.id,
        username:  s.username,
        email:     s.email,
        status:    "PRESENT" as AttendanceStatus,
      }));
      setStudents(list);
    } catch (e: any) {
      setStudentsError(e.message);
    } finally {
      setStudentsLoading(false);
    }
  }

  function setStatus(studentId: string, status: AttendanceStatus) {
    setStudents(prev => prev.map(s => s.studentId === studentId ? { ...s, status } : s));
    setSaved(false);
  }

  function markAll(status: AttendanceStatus) {
    setStudents(prev => prev.map(s => ({ ...s, status })));
    setSaved(false);
  }

  async function saveAttendance() {
    if (!activeClass) return;
    setSaving(true);
    setSaveError(null);
    try {
      const now   = new Date();
      const today = now.toISOString().split("T")[0];

      // Auto-create session in background
      const sessionRes = await fetch("/api/sessions", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          classId:   activeClass.id,
          schoolId:  await getFirstSchoolId(),
          date:      today,
          startTime: now.toISOString(),
          isOpen:    false,
        }),
      });
      if (!sessionRes.ok) throw new Error("Failed to create session");
      const session = await sessionRes.json();

      // Save attendance records
      const attRes = await fetch("/api/attendance", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          sessionId: session.id,
          records:   students.map(({ studentId, status }) => ({ studentId, status })),
        }),
      });
      if (!attRes.ok) throw new Error("Failed to save attendance");

      setSaved(true);
    } catch (e: any) {
      setSaveError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function getFirstSchoolId(): Promise<string> {
    const res  = await fetch("/api/schools?pageSize=1");
    const data = await res.json();
    const list = data.schools ?? data.data ?? data ?? [];
    if (!list[0]) throw new Error("No school found. Please add a school first.");
    return list[0].id;
  }

  return {
    classes, classesLoading, classesError,
    activeClass, setActiveClass,
    students, studentsLoading, studentsError,
    saving, saved, saveError,
    selectClass, setStatus, markAll, saveAttendance,
  };
}
