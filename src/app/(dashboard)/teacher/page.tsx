"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import { useRouter } from "next/navigation";
import {
  UserCheck, Calendar, Clock,
  CheckCircle, XCircle, AlertCircle, Users,
} from "lucide-react";

interface SessionSummary {
  id:        string;
  isOpen:    boolean;
  startTime: string;
  date:      string;
  class:     { name: string };
  school:    { name: string };
  _count:    { attendance: number };
}

interface Stats {
  totalSessions:  number;
  openSessions:   number;
  totalPresent:   number;
  totalLate:      number;
  totalAbsent:    number;
  attendanceRate: number;
}

export default function TeacherDashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  const [todaySessions, setTodaySessions] = useState<SessionSummary[]>([]);
  const [stats,         setStats]         = useState<Stats | null>(null);
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const today = new Date().toISOString().split("T")[0];
        const res   = await fetch(
          `/api/sessions?dateFrom=${today}&dateTo=${today}`,
          { credentials: "include" }
        );
        const data  = await res.json();
        const sessions: SessionSummary[] = data.sessions ?? [];
        setTodaySessions(sessions);

        // Calculate stats from sessions
        const totalAttendance = sessions.reduce((sum, s) => sum + s._count.attendance, 0);
        setStats({
          totalSessions:  sessions.length,
          openSessions:   sessions.filter(s => s.isOpen).length,
          totalPresent:   0,
          totalLate:      0,
          totalAbsent:    0,
          attendanceRate: 0,
        });
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          {greeting()}, {session?.user?.name ?? "Teacher"} 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {new Date().toLocaleDateString([], {
            weekday: "long", year: "numeric",
            month: "long", day: "numeric",
          })}
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-4 pb-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{todaySessions.length}</p>
              <p className="text-xs text-muted-foreground">Today's Sessions</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {todaySessions.filter(s => s.isOpen).length}
              </p>
              <p className="text-xs text-muted-foreground">Open Sessions</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {todaySessions.reduce((sum, s) => sum + s._count.attendance, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Marked Today</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {todaySessions.filter(s => !s.isOpen && s._count.attendance > 0).length}
              </p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's sessions */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base">Today's Sessions</CardTitle>
          <Button
            size="sm"
            onClick={() => router.push("/teacher/attendance")}
          >
            <UserCheck className="w-4 h-4 mr-1.5" />
            Mark Attendance
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground text-sm py-4">
              <div className="w-4 h-4 border-2 border-t-transparent border-primary rounded-full animate-spin" />
              Loading sessions…
            </div>
          ) : todaySessions.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <Calendar className="w-8 h-8 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground text-sm">
                No sessions scheduled for today.
              </p>
              <p className="text-xs text-muted-foreground">
                Contact admin to create a session.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {todaySessions.map(s => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      s.isOpen ? "bg-emerald-500" : "bg-muted-foreground"
                    }`} />
                    <div>
                      <p className="text-sm font-medium">{s.class.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(s.startTime).toLocaleTimeString([], {
                          hour: "2-digit", minute: "2-digit",
                        })}
                        {" · "}{s.school.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {s._count.attendance} marked
                    </span>
                    <Badge variant={s.isOpen ? "default" : "secondary"}>
                      {s.isOpen ? "Open" : "Closed"}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs"
                      onClick={() => router.push("/teacher/attendance")}
                    >
                      Mark
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => router.push("/teacher/attendance")}
          className="p-4 rounded-xl border hover:bg-muted/30 transition-colors text-left space-y-1"
        >
          <UserCheck className="w-6 h-6 text-emerald-600" />
          <p className="font-medium text-sm">Mark Attendance</p>
          <p className="text-xs text-muted-foreground">
            GPS verify and mark students
          </p>
        </button>

        <button
          onClick={() => router.push("/teacher/schedule")}
          className="p-4 rounded-xl border hover:bg-muted/30 transition-colors text-left space-y-1"
        >
          <Calendar className="w-6 h-6 text-blue-600" />
          <p className="font-medium text-sm">View Schedule</p>
          <p className="text-xs text-muted-foreground">
            See your weekly timetable
          </p>
        </button>

        <button
          onClick={() => router.push("/teacher/lessons")}
          className="p-4 rounded-xl border hover:bg-muted/30 transition-colors text-left space-y-1"
        >
          <CheckCircle className="w-6 h-6 text-purple-600" />
          <p className="font-medium text-sm">Lessons</p>
          <p className="text-xs text-muted-foreground">
            Manage your lesson plans
          </p>
        </button>
      </div>
    </div>
  );
}