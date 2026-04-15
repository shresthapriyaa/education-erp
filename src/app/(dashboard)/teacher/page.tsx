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
  FileText,
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
    {
      label: "Assignments",
      desc: "Upload and manage assignments",
      icon: FileText,
      color: "text-rose-600",
      bg: "bg-rose-50",
      href: "/teacher/assignments",
    },
    {
      label: "View Students",
      desc: "See your class students",
      icon: Users,
      color: "text-cyan-600",
      bg: "bg-cyan-50",
      href: "/teacher/students",
    },
  ];

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ fontFamily: "'Geist','DM Sans','Segoe UI',sans-serif" }}
    >
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
        {/* ── Header ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-2">
                Teacher Portal
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                {greeting()}, {session?.user?.name ?? "Teacher"} 👋
              </h1>
              <p className="text-sm text-slate-600 mt-2 flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                {new Date().toLocaleDateString([], {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {(session?.user?.name ?? "T").charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon, bg, color }) => (
            <div
              key={label}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center shadow-sm`}
                >
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
              </div>
              {loading ? (
                <Skeleton className="h-8 w-16 mb-2" />
              ) : (
                <p className="text-3xl font-bold text-slate-900 mb-1">{value}</p>
              )}
              <p className="text-sm font-medium text-slate-600">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Today's Classes ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Today's Classes</h2>
              <p className="text-sm text-slate-600 mt-0.5">Your schedule for today</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="h-9 gap-2 border-slate-300 hover:bg-slate-50"
              onClick={() => router.push("/teacher/routine")}
            >
              <CalendarDays className="w-4 h-4" />
              Full Routine
            </Button>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-xl" />
                ))}
              </div>
            ) : todayClasses.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
                  <CalendarDays className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-base font-semibold text-slate-900">
                  No classes today
                </p>
                <p className="text-sm text-slate-600">
                  Enjoy your free day! 🎉
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayClasses.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className={`px-3 py-1.5 rounded-lg text-sm font-bold border-2 ${subjectColor(r.subjectId)} shadow-sm`}
                      >
                        {r.subject?.name ?? "—"}
                      </div>
                      <div className="flex-1">
                        <p className="text-base font-semibold text-slate-900">
                          {r.class?.name ?? "—"}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1.5 text-sm text-slate-600">
                            <Clock className="w-3.5 h-3.5" />
                            {formatTime(r.startTime)} – {formatTime(r.endTime)}
                          </span>
                          {r.room && (
                            <span className="flex items-center gap-1.5 text-sm text-slate-600">
                              <MapPin className="w-3.5 h-3.5" />
                              {r.room}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-black hover:bg-gray-800 text-white shadow-sm h-9 gap-2"
                      onClick={() => router.push("/teacher/attendance")}
                    >
                      <UserCheck className="w-4 h-4" />
                      Mark Attendance
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
            <p className="text-sm text-slate-600 mt-1">Access your most used features</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map(({ label, desc, icon: Icon, color, bg, href }) => (
              <button
                key={label}
                onClick={() => router.push(href)}
                className="group bg-white rounded-xl border border-slate-200 p-6 transition-all duration-300 text-left hover:shadow-lg hover:-translate-y-2 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className={`w-6 h-6 ${color}`} />
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all duration-300" />
                </div>
                <div>
                  <p className="font-bold text-base text-slate-900 mb-1">{label}</p>
                  <p className="text-sm text-slate-600">{desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}





