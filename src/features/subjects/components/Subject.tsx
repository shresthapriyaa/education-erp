"use client";

import { useEffect } from "react";
import { useSubjects } from "@/features/subjects/hooks/useSubjects";
import { useSubjectFilters } from "@/features/subjects/hooks/useSubjectFilters";
import { SubjectTable } from "@/features/subjects/components/SubjectTable";
import type { Subject } from "@/features/subjects/types/subject.types";
import { SubmitMode } from "@/features/subjects/components/SubjectForm";

type SubjectPayload = Partial<Subject>;

export default function SubjectsPage() {
  const {
    subjects, loading, fetchSubjects,
    createSubject, updateSubject, patchSubject, deleteSubject,
  } = useSubjects();

  const { filters } = useSubjectFilters();

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSubjects(filters);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters, fetchSubjects]);

  const handleAdd = async (values: SubjectPayload) => {
    await createSubject(values);
  };

  const handleEdit = async (id: string, values: SubjectPayload, mode: SubmitMode) => {
    if (mode === "patch") {
      await patchSubject(id, values);
    } else {
      await updateSubject(id, values);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteSubject(id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Subjects</h1>
        <p className="text-muted-foreground">
          Manage subjects offered at the school.
        </p>
      </div>
      <SubjectTable
        subjects={subjects}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}