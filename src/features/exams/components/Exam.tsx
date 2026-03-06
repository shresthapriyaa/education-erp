"use client";

import { useEffect } from "react";
import { useExams } from "@/features/exams/hooks/useExams";
import { useExamFilters } from "@/features/exams/hooks/useExamFilters";
import { ExamTable } from "@/features/exams/components/ExamTable";
import type { Exam } from "@/features/exams/types/exam.types";
import { SubmitMode } from "@/features/exams/components/ExamForm";

type ExamPayload = Partial<Exam> & { subjectId?: string };

export default function ExamsPage() {
  const {
    exams, loading, fetchExams,
    createExam, updateExam, patchExam, deleteExam,
  } = useExams();

  const { filters } = useExamFilters();

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchExams(filters);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters, fetchExams]);

  const handleAdd = async (values: ExamPayload) => {
    await createExam(values);
  };

  const handleEdit = async (id: string, values: ExamPayload, mode: SubmitMode) => {
    if (mode === "patch") {
      await patchExam(id, values);
    } else {
      await updateExam(id, values);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteExam(id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Exams</h1>
        <p className="text-muted-foreground">
          Manage exams and their scheduled dates.
        </p>
      </div>
      <ExamTable
        exams={exams}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}