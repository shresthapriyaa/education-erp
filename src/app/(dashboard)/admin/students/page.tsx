"use client";

import { useEffect } from "react";
import { useState } from "react";
import { StudentTable } from "@/features/students/components/StudentTable";
import { useStudents } from "@/features/students/hooks/useStudents";
import { useStudentFilters } from "@/features/students/hooks/useStudentFilters";
import type { Student } from "@/features/students/types/student.types";
import { StudentForm, type SubmitMode } from "@/features/students/components/StudentForm";

type StudentPayload = Partial<Student> & { password?: string };

export default function StudentsPage() {
  const {
    students,
    loading,
    fetchStudents,
    createStudent,
    updateStudent,
    patchStudent,
    deleteStudent,
  } = useStudents();

  const { filters } = useStudentFilters();

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents(filters);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters, fetchStudents]);

  const handleAdd = async (values: StudentPayload) => {
    await createStudent(values);
  };

  const handleEdit = async (id: string, values: StudentPayload, mode: SubmitMode) => {
    if (mode === "patch") {
      await patchStudent(id, values);
    } else {
      await updateStudent(id, values);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteStudent(id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Students</h1>
        <p className="text-muted-foreground">
          Manage student records, details, and assignments.
        </p>
      </div>

      <StudentTable
        students={students}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    
    </div>
  );
}