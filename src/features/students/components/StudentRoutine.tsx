"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Badge } from "@/core/components/ui/badge";
import { Clock, MapPin, User } from "lucide-react";
import { ScrollArea } from "@/core/components/ui/scroll-area";

interface RoutineEntry {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  subject: { name: string };
  teacher?: { username: string };
  room?: string;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function StudentRoutine() {
  const [routine, setRoutine] = useState<RoutineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(DAYS[new Date().getDay() - 1] || "Monday");

  useEffect(() => {
    loadRoutine();
  }, []);

  async function loadRoutine() {
    setLoading(true);
    try {
      // Mock data - replace with actual API call
      const mockRoutine: RoutineEntry[] = [
        {
          id: "1",
          day: "Monday",
          startTime: "09:00",
          endTime: "10:00",
          subject: { name: "Mathematics" },
          teacher: { username: "Mr. Smith" },
          room: "Room 101",
        },
        {
          id: "2",
          day: "Monday",
          startTime: "10:15",
          endTime: "11:15",
          subject: { name: "English" },
          teacher: { username: "Ms. Johnson" },
          room: "Room 205",
        },
        {
          id: "3",
          day: "Tuesday",
          startTime: "09:00",
          endTime: "10:00",
          subject: { name: "Science" },
          teacher: { username: "Dr. Brown" },
          room: "Lab 1",
        },
        {
          id: "4",
          day: "Tuesday",
          startTime: "10:15",
          endTime: "11:15",
          subject: { name: "History" },
          teacher: { username: "Mr. Davis" },
          room: "Room 302",
        },
      ];
      
      setRoutine(mockRoutine);
    } catch (error) {
      console.error("Failed to load routine:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredRoutine = routine.filter((entry) => entry.day === selectedDay);

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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-black">Class Routine</h1>
        <p className="text-muted-foreground mt-1">View your weekly class schedule.</p>
      </div>

      {/* Day Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedDay === day
                    ? "bg-black text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Schedule */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-base">{selectedDay}'s Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            {filteredRoutine.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No classes scheduled for {selectedDay}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRoutine.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-4 rounded-lg border bg-gradient-to-r from-blue-50 to-purple-50 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-black">{entry.subject.name}</h3>
                        
                        <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>
                              {entry.startTime} - {entry.endTime}
                            </span>
                          </div>
                          
                          {entry.teacher && (
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span>{entry.teacher.username}</span>
                            </div>
                          )}
                          
                          {entry.room && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{entry.room}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                        {entry.subject.name}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Weekly Overview */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-base">Weekly Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {DAYS.map((day) => {
              const dayClasses = routine.filter((r) => r.day === day).length;
              return (
                <div
                  key={day}
                  className="p-4 rounded-lg border text-center hover:bg-muted/50 transition-colors"
                >
                  <p className="text-sm font-medium text-black">{day.substring(0, 3)}</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">{dayClasses}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {dayClasses === 1 ? "class" : "classes"}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
