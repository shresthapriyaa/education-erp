"use client";

import { useEffect } from "react";
import { useClasses } from "@/features/classes/hooks/useClasses";
import { useClassFilters } from "@/features/classes/hooks/useClassFilters";
import { ClassTable } from "@/features/classes/components/ClassTable";
import type { Class } from "@/features/classes/types/class.types";
import { SubmitMode } from "@/features/classes/components/ClassForm";

type ClassPayload = Partial<Class> & { teacherId?: string };

export default function ClassesPage() {
  const {
    classes, loading, fetchClasses,
    createClass, updateClass, patchClass, deleteClass,
  } = useClasses();

  const { filters } = useClassFilters();

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchClasses(filters);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters, fetchClasses]);

  const handleAdd = async (values: ClassPayload) => {
    await createClass(values);
  };

  const handleEdit = async (id: string, values: ClassPayload, mode: SubmitMode) => {
    if (mode === "patch") {
      await patchClass(id, values);
    } else {
      await updateClass(id, values);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteClass(id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Classes</h1>
        <p className="text-muted-foreground">
          Manage classes and their assigned teachers.
        </p>
      </div>
      <ClassTable
        classes={classes}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}