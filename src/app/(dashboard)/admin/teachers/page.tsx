"use client";

import { useEffect } from "react";
import { useTeachers } from "@/features/teachers/hooks/useTeachers";
import { useTeacherFilters } from "@/features/teachers/hooks/useTeacherFilters";
import { TeacherTable } from "@/features/teachers/components/TeacherTable";
import type { Teacher } from "@/features/teachers/types/teacher.types";
import { SubmitMode } from "@/features/teachers/components/TeacherForm";

type TeacherPayload = Partial<Teacher>;

export default function TeachersPage() {
  const {
    teachers, loading, fetchTeachers,
    createTeacher, updateTeacher, patchTeacher, deleteTeacher,
  } = useTeachers();

  const { filters } = useTeacherFilters();

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTeachers(filters);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters, fetchTeachers]);

  const handleAdd = async (values: TeacherPayload) => {
    await createTeacher(values);
  };

  const handleEdit = async (id: string, values: TeacherPayload, mode: SubmitMode) => {
    if (mode === "patch") {
      await patchTeacher(id, values);
    } else {
      await updateTeacher(id, values);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteTeacher(id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Teachers</h1>
        <p className="text-muted-foreground">
          Manage teacher records and their assigned classes.
        </p>
      </div>
      <TeacherTable
        teachers={teachers}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}