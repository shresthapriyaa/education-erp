
"use client";

import { useEffect } from "react";
import { useGrades } from "@/features/grades/hooks/useGrades";
// import { GradeTable } from "@/features/grades/components/GradeTable";
import type { SubmitMode, GradePayload } from "@/features/grades/components/GradeForm";
import { GradeTable } from "./Gradetable";

export default function GradesPage() {
  const {
    grades, loading,
    fetchGrades, createGrade, updateGrade, deleteGrade,
  } = useGrades();

  useEffect(() => {
    fetchGrades();
  }, [fetchGrades]);

  const handleAdd = async (values: GradePayload) => {
    await createGrade(values);
  };

  const handleEdit = async (id: string, values: GradePayload, _mode: SubmitMode) => {
    await updateGrade(id, values);
  };

  const handleDelete = async (id: string) => {
    await deleteGrade(id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Grades</h1>
        <p className="text-muted-foreground">
          Manage student grades per assignment.
        </p>
      </div>
      <GradeTable
        grades={grades}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}