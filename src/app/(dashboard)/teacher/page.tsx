"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  UserCheck,
  CalendarDays,
  BookOpen,
  ChevronRight,
  Clock,
  MapPin,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import { Skeleton } from "@/core/components/ui/skeleton";
import { useRoutines } from "@/features/routines/hooks/useRoutines";
import { useLessons } from "@/features/lessons/hooks/useLessons";
import type { DayOfWeek } from "@/features/routines/types/routine.types";

const TODAY_DAY = new Date()
  .toLocaleDateString("en-US", { weekday: "long" })
  .toUpperCase() as DayOfWeek;

const SUBJECT_COLORS = [
  "bg-blue-50 border-blue-200 text-blue-700",
  "bg-purple-50 border-purple-200 text-purple-700",
  "bg-emerald-50 border-emerald-200 text-emerald-700",
  "bg-amber-50 border-amber-200 text-amber-700",
  "bg-rose-50 border-rose-200 text-rose-700",
  "bg-cyan-50 border-cyan-200 text-cyan-700",
];

function subjectColor(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h += id.charCodeAt(i);
  return SUBJECT_COLORS[h % SUBJECT_COLORS.length];
}

function formatTime(t: string) {
  const [h, m] = t.split(":");
  const hour = parseInt(h);
  return `${hour % 12 === 0 ? 12 : hour % 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
}

export default function TeacherDashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  const { routines, loading: routinesLoading, fetchRoutines } = useRoutines();
  const { lessons, loading: lessonsLoading, fetchLessons } = useLessons();

  useEffect(() => {
    fetchRoutines();
    fetchLessons();
  }, [fetchRoutines, fetchLessons]);

  const loading = routinesLoading || lessonsLoading;

  const todayClasses = routines
    .filter((r) => r.day === TODAY_DAY)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const publishedLessons = lessons.filter((l) => l.isPublished).length;
  const draftLessons = lessons.filter((l) => !l.isPublished).length;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const stats = [
    {
      label: "Classes Today",
      value: todayClasses.length,
      icon: CalendarDays,
      bg: "bg-blue-50",
      color: "text-blue-600",
    },
    {
      label: "Total Lessons",
      value: lessons.length,
      icon: BookOpen,
      bg: "bg-purple-50",
      color: "text-purple-600",
    },
    {
      label: "Published",
      value: publishedLessons,
      icon: Users,
      bg: "bg-emerald-50",
      color: "text-emerald-600",
    },
    {
      label: "Drafts",
      value: draftLessons,
      icon: Clock,
      bg: "bg-amber-50",
      color: "text-amber-600",
    },
  ];

  const quickActions = [
    {
      label: "Mark Attendance",
      desc: "Take attendance for your classes",
      icon: UserCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      href: "/teacher/attendance",
    },
    {
      label: "View Routine",
      desc: "See your weekly timetable",
      icon: CalendarDays,
      color: "text-blue-600",
      bg: "bg-blue-50",
      href: "/teacher/routine",
    },
    {
      label: "Lessons",
      desc: "Manage your lesson materials",
      icon: BookOpen,
      color: "text-purple-600",
      bg: "bg-purple-50",
      href: "/teacher/lessons",
    },
  ];

  return (
    <div
      className="max-w-5xl mx-auto py-8 px-6 space-y-8"
      style={{ fontFamily: "'Geist','DM Sans','Segoe UI',sans-serif" }}
    >
      {/* ── Header ── */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-1">
          Teacher Portal
        </p>
        <h1 className="text-2xl font-black tracking-tight text-foreground">
          {greeting()}, {session?.user?.name ?? "Teacher"} 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {new Date().toLocaleDateString([], {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(({ label, value, icon: Icon, bg, color }) => (
          <Card key={label} className="border border-border/60 shadow-none">
            <CardContent className="pt-4 pb-3 px-4 flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center shrink-0`}
              >
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                {loading ? (
                  <Skeleton className="h-6 w-8 mb-1" />
                ) : (
                  <p className="text-2xl font-black leading-none">{value}</p>
                )}
                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Today's Classes ── */}
      <Card className="border border-border/60 shadow-none">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold">Today's Classes</CardTitle>
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs gap-1.5"
            onClick={() => router.push("/teacher/schedule")}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            Full Routine
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          ) : todayClasses.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <CalendarDays className="w-9 h-9 text-muted-foreground/20 mx-auto" />
              <p className="text-sm font-medium text-muted-foreground">
                No classes today
              </p>
              <p className="text-xs text-muted-foreground/50">
                Enjoy your free day!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {todayClasses.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/60 hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`px-2.5 py-0.5 rounded text-xs font-bold border ${subjectColor(r.subjectId)}`}
                    >
                      {r.subject?.name ?? "—"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {r.class?.name ?? "—"}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock size={10} />
                          {formatTime(r.startTime)} – {formatTime(r.endTime)}
                        </span>
                        {r.room && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin size={10} />
                            {r.room}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    onClick={() => router.push("/teacher/attendance")}
                  >
                    <UserCheck className="w-3 h-3 mr-1" />
                    Attend
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Quick Actions ── */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Quick Actions
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quickActions.map(({ label, desc, icon: Icon, color, bg, href }) => (
            <button
              key={label}
              onClick={() => router.push(href)}
              className="group p-4 rounded-xl border border-border/60 hover:border-border hover:bg-muted/20 transition-all text-left"
            >
              <div
                className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}
              >
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
