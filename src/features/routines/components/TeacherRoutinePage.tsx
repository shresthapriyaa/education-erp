"use client";
import { useEffect } from "react";
import { RoutineTable } from "@/features/routines/components/RoutineTable";
import { useRoutines } from "../hooks/useRoutines";

export default function TeacherRoutinePage() {
  const { routines, loading, fetchRoutines } = useRoutines();

  useEffect(() => { fetchRoutines(); }, [fetchRoutines]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Routine</h1>
        <p className="text-muted-foreground">View your class timetables and schedules.</p>
      </div>
      <RoutineTable
        routines={routines}
        loading={loading}
        readOnly={true}
      />
    </div>
  );
}
