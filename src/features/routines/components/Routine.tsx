"use client";
import { useEffect } from "react";
import { RoutineTable } from "@/features/routines/components/RoutineTable";
import type { Routine } from "@/features/routines/types/routine.types";
import { SubmitMode } from "@/features/routines/components/RoutineForm";
import { useRoutines } from "../hooks/useRoutines";

type RoutinePayload = Partial<Routine>;

export default function RoutinesPage() {
  const { routines, loading, fetchRoutines, createRoutine, updateRoutine, deleteRoutine } = useRoutines();

  useEffect(() => { fetchRoutines(); }, [fetchRoutines]);

  const handleAdd = async (values: RoutinePayload) => {
    await createRoutine(values);
  };

  const handleEdit = async (id: string, values: RoutinePayload, _mode: SubmitMode) => {
    await updateRoutine(id, values);
  };

  const handleDelete = async (id: string) => {
    await deleteRoutine(id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Routines</h1>
        <p className="text-muted-foreground">Manage class timetables and schedules.</p>
      </div>
      <RoutineTable
        routines={routines}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}