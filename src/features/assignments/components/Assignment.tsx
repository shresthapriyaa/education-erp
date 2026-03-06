"use client";

import { useEffect } from "react";
import { useAssignments } from "@/features/assignments/hooks/useAssignments";
import { useAssignmentFilters } from "@/features/assignments/hooks/useAssignmentFilters";
import { AssignmentTable } from "@/features/assignments/components/AssignmentTable";
import type { Assignment } from "@/features/assignments/types/assignment.types";
import { SubmitMode } from "@/features/assignments/components/AssignmentForm";

type AssignmentPayload = Partial<Assignment>;

export default function AssignmentsPage() {
  const {
    assignments, loading, fetchAssignments,
    createAssignment, updateAssignment, patchAssignment, deleteAssignment,
  } = useAssignments();

  const { filters } = useAssignmentFilters();

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAssignments(filters);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters, fetchAssignments]);

  const handleAdd = async (values: AssignmentPayload) => {
    await createAssignment(values);
  };

  const handleEdit = async (id: string, values: AssignmentPayload, mode: SubmitMode) => {
    if (mode === "patch") {
      await patchAssignment(id, values);
    } else {
      await updateAssignment(id, values);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteAssignment(id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
        <p className="text-muted-foreground">
          Manage assignments and their due dates.
        </p>
      </div>
      <AssignmentTable
        assignments={assignments}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}