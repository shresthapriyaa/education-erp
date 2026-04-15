"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { TeacherStudentTable } from "./TeacherStudentTable";
import type { Student } from "../../types/student.types";
import { AlertCircle } from "lucide-react";

export default function TeacherStudentsPage() {
  const { data: session } = useSession();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [classInfo, setClassInfo] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/teacher/students");
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to load students");
      }
      const data = await res.json();
      setStudents(data.students || []);
      setClassInfo(data.classInfo || null);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error && error.includes("not a class teacher")) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-amber-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-amber-900 mb-2">Access Restricted</h2>
          <p className="text-amber-800">
            Only class teachers can view students. Please contact your admin if you believe this is an error.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Students</h1>
        <p className="text-muted-foreground">
          {classInfo ? `View students for ${classInfo.name}` : "Loading..."}
        </p>
      </div>

      <TeacherStudentTable
        students={students}
        loading={loading}
        readOnly={true}
      />
    </div>
  );
}
