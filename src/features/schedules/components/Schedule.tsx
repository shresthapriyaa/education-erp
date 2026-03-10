"use client";

import { useEffect } from "react";
import { useSchedules } from "@/features/schedules/hooks/useSchedules";
import { ScheduleTable } from "@/features/schedules/components/ScheduleTable";
import type { Schedule } from "@/features/schedules/types/schedule.types";

type SchedulePayload = Partial<Schedule> & { classId?: string; subjectId?: string };

export default function SchedulesPage() {
  const { schedules, loading, fetchSchedules, createSchedule, updateSchedule, patchSchedule, deleteSchedule } = useSchedules();

  useEffect(() => { fetchSchedules(); }, [fetchSchedules]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
        <p className="text-muted-foreground">Manage class schedules and timetables.</p>
      </div>
      <ScheduleTable
        schedules={schedules}
        loading={loading}
        onAdd={async (values) => { await createSchedule(values); }}
        onEdit={async (id, values, mode) => {
          if (mode === "patch") await patchSchedule(id, values);
          else await updateSchedule(id, values);
        }}
        onDelete={async (id) => { await deleteSchedule(id); }}
      />
    </div>
  );
}