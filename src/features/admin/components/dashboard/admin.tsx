"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Calendar } from "@/core/components/ui/calendar";
import {
  Users,
  GraduationCap,
  BookOpen,
  ClipboardList,
  TrendingUp,
  TrendingDown,
  UserCheck,
  Wallet,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalAssignments: number;
  totalParents: number;
  totalAccountants: number;
  attendanceRate: number;
  attendanceTrend: "up" | "down";
  studentGender: {
    boys: number;
    girls: number;
  };
}

interface AttendanceData {
  date: string;
  present: number;
  absent: number;
  late: number;
}

interface Event {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  createdAt: string;
  updatedAt: string;
}

export default function Admin() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    totalAssignments: 0,
    totalParents: 0,
    totalAccountants: 0,
    attendanceRate: 0,
    attendanceTrend: "up",
    studentGender: { boys: 0, girls: 0 },
  });
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setLoading(true);
    try {
      const [
        studentsRes,
        teachersRes,
        classesRes,
        assignmentsRes,
        attendanceRes,
        parentsRes,
        accountantsRes,
        eventsRes,
      ] = await Promise.all([
        fetch("/api/students"),
        fetch("/api/teachers"),
        fetch("/api/classes"),
        fetch("/api/assignments"),
        fetch("/api/attendance/stats"),
        fetch("/api/parents"),
        fetch("/api/accountants"),
        fetch("/api/events"),
      ]);

      const students = await studentsRes.json();
      const teachers = await teachersRes.json();
      const classes = await classesRes.json();
      const assignments = await assignmentsRes.json();
      const attendance = await attendanceRes.json();
      const parents = await parentsRes.json();
      const accountants = await accountantsRes.json();
      const eventsData = await eventsRes.json();

      const studentsArray = Array.isArray(students)
        ? students
        : students.students || [];
      const boys = studentsArray.filter((s: any) => s.sex === "MALE").length;
      const girls = studentsArray.filter((s: any) => s.sex === "FEMALE").length;

      setStats({
        totalStudents: studentsArray.length,
        totalTeachers: Array.isArray(teachers) ? teachers.length : 0,
        totalClasses: Array.isArray(classes) ? classes.length : 0,
        totalAssignments: Array.isArray(assignments) ? assignments.length : 0,
        totalParents: Array.isArray(parents) ? parents.length : 0,
        totalAccountants: Array.isArray(accountants) ? accountants.length : 0,
        attendanceRate: attendance.rate || 0,
        attendanceTrend: attendance.trend || "up",
        studentGender: { boys, girls },
      });

      setAttendanceData(attendance.weeklyData || []);
      setEvents(Array.isArray(eventsData) ? eventsData : []);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }

  const statCards = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Teachers",
      value: stats.totalTeachers,
      icon: GraduationCap,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Parents",
      value: stats.totalParents,
      icon: UserCheck,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Accountants",
      value: stats.totalAccountants,
      icon: Wallet,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const genderData = [
    { name: "Boys", value: stats.studentGender.boys, color: "#3b82f6" },
    { name: "Girls", value: stats.studentGender.girls, color: "#ec4899" },
  ];

  const filteredEvents = events
    .map((e) => {
      const eventDate = new Date(e.eventDate);
      return { ...e, date: eventDate };
    })
    .filter((e) => {
      if (!selectedDate) return false;
      const eventYear = e.date.getFullYear();
      const eventMonth = e.date.getMonth();
      const eventDay = e.date.getDate();

      const selectedYear = selectedDate.getFullYear();
      const selectedMonth = selectedDate.getMonth();
      const selectedDay = selectedDate.getDate();

      return (
        eventYear === selectedYear &&
        eventMonth === selectedMonth &&
        eventDay === selectedDay
      );
    });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-12 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header - Sticky */}
      <div className="sticky top-0 z-10 bg-background pb-4">
        <h1 className="text-3xl font-bold text-black">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => (
            <Card
              key={card.title}
              className="hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {card.title}
                    </p>
                    <p className="text-3xl font-bold text-black mt-2">
                      {card.value}
                    </p>
                  </div>
                  <div className={`${card.bgColor} p-3 rounded-full`}>
                    <card.icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Gender Distribution & Events Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Student Gender Distribution */}
          <Card className="lg:col-span-1 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                Student Gender Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-2">
              {genderData[0].value === 0 && genderData[1].value === 0 ? (
                <div className="h-[140px] flex items-center justify-center text-muted-foreground">
                  <p className="text-xs">No data</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={genderData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      label={({ percent }) => `${(percent! * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: "10px" }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Events & Announcements */}
          <Card className="lg:col-span-2 hover:shadow-lg transition-shadow gap-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Events & Announcements
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex justify-center">
                  <div className="scale-100 origin-top">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-lg border p-1"
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
                  </div>
                </div>
                <div className="space-y-2">
                  {filteredEvents.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-black mb-1">
                        {selectedDate?.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </h3>
                      {filteredEvents.slice(0, 1).map((e, i) => (
                        <div
                          key={i}
                          className="p-2.5 bg-blue-50 rounded border border-blue-200"
                        >
                          <p className="text-xs font-medium text-black truncate">
                            {e.title}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  {events.length > 0 && (
                    <div
                      className={
                        filteredEvents.length > 0 ? "pt-2 border-t" : ""
                      }
                    >
                      <h3 className="text-lg font-semibold text-black mb-1">
                        Upcoming
                      </h3>
                      <div className="space-y-1 max-h-[100px] overflow-y-auto pr-1">
                        {events
                          .sort(
                            (a, b) =>
                              new Date(a.eventDate).getTime() -
                              new Date(b.eventDate).getTime(),
                          )
                          .slice(0, 3)
                          .map((e, i) => {
                            const eventDate = new Date(e.eventDate);
                            const isToday =
                              eventDate.toDateString() ===
                              new Date().toDateString();
                            return (
                              <div
                                key={i}
                                className={`p-1 rounded border flex items-center gap-1.5 ${
                                  isToday
                                    ? "bg-green-50 border-green-200"
                                    : "bg-muted border-gray-200"
                                }`}
                              >
                                <span className="text-lg">
                                  {isToday ? "🔔" : "📌"}
                                </span>
                                <p className="text-xs font-medium text-black truncate flex-1">
                                  {e.title}
                                </p>
                                <p
                                  className={`text-xs shrink-0 ${isToday ? "text-green-600" : "text-blue-600"}`}
                                >
                                  {eventDate.getDate()}/
                                  {eventDate.getMonth() + 1}
                                </p>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                  {events.length === 0 && filteredEvents.length === 0 && (
                    <div className="h-[140px] flex items-center justify-center text-muted-foreground">
                      <p className="text-xs">No events</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Attendance Rate Card */}
          <Card className="lg:col-span-1 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-base">Attendance Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#e5e7eb"
                      strokeWidth="10"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#10b981"
                      strokeWidth="10"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - stats.attendanceRate / 100)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-black">
                      {stats.attendanceRate}%
                    </span>
                    <span className="text-xs text-muted-foreground">
                      This Week
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 mt-3">
                {stats.attendanceTrend === "up" ? (
                  <>
                    <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                    <span className="text-xs text-green-600 font-medium">
                      Trending up
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-3.5 w-3.5 text-red-600" />
                    <span className="text-xs text-red-600 font-medium">
                      Trending down
                    </span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Attendance Chart */}
          <Card className="lg:col-span-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-base">Weekly Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              {attendanceData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                    <Bar dataKey="present" fill="#22c55e" name="Present" />
                    <Bar dataKey="late" fill="#eab308" name="Late" />
                    <Bar dataKey="absent" fill="#ef4444" name="Absent" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">
                  No attendance data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <a
                href="/admin/students"
                className="flex flex-col items-center justify-center p-3 rounded-lg border hover:bg-muted/50 transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95"
              >
                <Users className="h-6 w-6 text-blue-600 mb-1.5" />
                <span className="text-xs font-medium text-center">
                  Manage Students
                </span>
              </a>
              <a
                href="/admin/teachers"
                className="flex flex-col items-center justify-center p-3 rounded-lg border hover:bg-muted/50 transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95"
              >
                <GraduationCap className="h-6 w-6 text-green-600 mb-1.5" />
                <span className="text-xs font-medium text-center">
                  Manage Teachers
                </span>
              </a>
              <a
                href="/admin/classes"
                className="flex flex-col items-center justify-center p-3 rounded-lg border hover:bg-muted/50 transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95"
              >
                <BookOpen className="h-6 w-6 text-purple-600 mb-1.5" />
                <span className="text-xs font-medium text-center">
                  Manage Classes
                </span>
              </a>
              <a
                href="/admin/assignments"
                className="flex flex-col items-center justify-center p-3 rounded-lg border hover:bg-muted/50 transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95"
              >
                <ClipboardList className="h-6 w-6 text-orange-600 mb-1.5" />
                <span className="text-xs font-medium text-center">
                  View Assignments
                </span>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
