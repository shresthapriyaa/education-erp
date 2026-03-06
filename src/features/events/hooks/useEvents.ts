"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { Event } from "../types/event.types";
import { eventApi } from "../services/event.api";

type EventPayload = Partial<Event>;

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async (filters?: { search?: string }) => {
    setLoading(true);
    try {
      const data = await eventApi.getAll(filters);
      setEvents(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch events");
      toast.error(err?.response?.data?.error || "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  }, []);

  const createEvent = async (data: EventPayload) => {
    setLoading(true);
    try {
      await eventApi.create(data);
      toast.success("Event created successfully");
      await fetchEvents();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to create event");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (id: string, data: EventPayload) => {
    setLoading(true);
    try {
      await eventApi.update(id, data);
      toast.success("Event updated successfully");
      await fetchEvents();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to update event");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const patchEvent = async (id: string, data: EventPayload) => {
    setLoading(true);
    try {
      await eventApi.patch(id, data);
      toast.success("Event updated successfully");
      await fetchEvents();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to update event");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id: string) => {
    setLoading(true);
    try {
      await eventApi.delete(id);
      toast.success("Event deleted successfully");
      setEvents((prev) => prev.filter((e) => e.id !== id));
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to delete event");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    patchEvent,
    deleteEvent,
  };
}