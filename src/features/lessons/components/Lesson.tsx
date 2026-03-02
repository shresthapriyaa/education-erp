"use client";

import { useEffect } from "react";
import { useLessons } from "@/features/lessons/hooks/useLessons";
import { useLessonFilters } from "@/features/lessons/hooks/useLessonFilters";
import { LessonTable } from "@/features/lessons/components/LessonTable";
import type { Lesson } from "@/features/lessons/types/lesson.types";
import { SubmitMode } from "@/features/lessons/components/LessonForm";

type LessonPayload = Partial<Lesson>;

export default function LessonsPage() {
  const {
    lessons, loading, fetchLessons,
    createLesson, updateLesson, patchLesson, deleteLesson,
  } = useLessons();

  const { filters } = useLessonFilters();

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLessons(filters);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters, fetchLessons]);

  const handleAdd = async (values: LessonPayload) => {
    await createLesson(values);
  };

  const handleEdit = async (id: string, values: LessonPayload, mode: SubmitMode) => {
    if (mode === "patch") {
      await patchLesson(id, values);
    } else {
      await updateLesson(id, values);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteLesson(id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lessons</h1>
        <p className="text-muted-foreground">
          Manage lessons and their learning materials.
        </p>
      </div>
      <LessonTable
        lessons={lessons}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}