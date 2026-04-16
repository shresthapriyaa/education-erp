"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Calendar } from "@/core/components/ui/calendar";
import { Badge } from "@/core/components/ui/badge";
import { CalendarDays, MapPin } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  eventDate: string;
}

export default function StudentEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    setLoading(true);
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load events:", error);
    } finally {
      setLoading(false);
    }
  }

  const upcomingEvents = events
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-12 bg-muted animate-pulse rounded" />
        <div className="h-96 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Events</h1>
        <p className="text-muted-foreground mt-1">View upcoming school events and activities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-lg border"
              modifiers={{
                hasEvent: events.map((e) => {
                  const d = new Date(e.eventDate);
                  d.setHours(0, 0, 0, 0);
                  return d;
                }),
              }}
              modifiersStyles={{
                hasEvent: {
                  fontWeight: "bold",
                  textDecoration: "underline",
                  color: "#3b82f6",
                },
              }}
            />
          </CardContent>
        </Card>

        {/* Events List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">All Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No upcoming events</p>
                </div>
              ) : (
                upcomingEvents.map((event) => {
                  const eventDate = new Date(event.eventDate);
                  return (
                    <div
                      key={event.id}
                      className="flex gap-4 p-4 rounded-lg border bg-muted/50 hover:shadow-md transition-all"
                    >
                      <div className="min-w-[60px] h-16 bg-blue-600 rounded-lg flex flex-col items-center justify-center text-white shrink-0">
                        <span className="text-2xl font-bold leading-none">
                          {eventDate.getDate()}
                        </span>
                        <span className="text-xs uppercase mt-1">
                          {eventDate.toLocaleString("default", { month: "short" })}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-black">{event.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <CalendarDays className="h-3 w-3" />
                          <span>
                            {eventDate.toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
