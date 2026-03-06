"use client";

import { useEffect } from "react";
import { useEvents } from "@/features/events/hooks/useEvents";
import { useEventFilters } from "@/features/events/hooks/useEventFilters";
import { EventTable } from "@/features/events/components/EventTable";
import type { Event } from "@/features/events/types/event.types";
import { SubmitMode } from "@/features/events/components/EventForm";

type EventPayload = Partial<Event>;

export default function EventsPage() {
  const {
    events, loading, fetchEvents,
    createEvent, updateEvent, patchEvent, deleteEvent,
  } = useEvents();

  const { filters } = useEventFilters();

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEvents(filters);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters, fetchEvents]);

  const handleAdd = async (values: EventPayload) => {
    await createEvent(values);
  };

  const handleEdit = async (id: string, values: EventPayload, mode: SubmitMode) => {
    if (mode === "patch") {
      await patchEvent(id, values);
    } else {
      await updateEvent(id, values);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteEvent(id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Events</h1>
        <p className="text-muted-foreground">
          Manage school events and activities.
        </p>
      </div>
      <EventTable
        events={events}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}