"use client";

import { useEffect } from "react";
import { useParents } from "@/features/parents/hooks/useParents";
import { useParentFilters } from "@/features/parents/hooks/useParentFilters";
import { ParentTable } from "@/features/parents/components/ParentTable";
import type { Parent } from "@/features/parents/types/parent.types";
import { SubmitMode } from "@/features/parents/components/ParentForm";

type ParentPayload = Partial<Parent>;

export default function ParentsPage() {
  const {
    parents, loading, fetchParents,
    createParent, updateParent, patchParent, deleteParent,
  } = useParents();

  const { filters } = useParentFilters();

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchParents(filters);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters, fetchParents]);

  const handleAdd = async (values: ParentPayload) => {
    await createParent(values);
  };

  const handleEdit = async (id: string, values: ParentPayload, mode: SubmitMode) => {
    if (mode === "patch") {
      await patchParent(id, values);
    } else {
      await updateParent(id, values);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteParent(id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Parents</h1>
        <p className="text-muted-foreground">
          Manage parent records and their linked students.
        </p>
      </div>
      <ParentTable
        parents={parents}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}