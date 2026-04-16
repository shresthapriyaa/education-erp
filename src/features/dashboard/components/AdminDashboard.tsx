"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Calendar } from "@/core/components/ui/calendar";
import { Users, GraduationCap, BookOpen, ClipboardList, TrendingUp, TrendingDown, UserCheck, Wallet } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

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

export function AdminDashboard() {
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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setLoading(true);
    try {
      const [studentsRes, teachersRes, classesRes, assignmentsRes, attendanceRes, parentsRes, accountantsRes, eventsRes] = await Promise.all([
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

      // Handle students API response (can be array or object with students property)
      const studentsArray = Array.isArray(students) ? students : (students.students || []);
      const boys = studentsArray.filter((s: any) => s.sex === "MALE").length;
      const girls = studentsArray.filter((s: any) => s.sex === "FEMALE").length;

      console.log("Students data:", { studentsArray, boys, girls, eventsData });

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
    { title: "Total Students", value: stats.totalStudents, icon: Users, color: "text-blue-600", bgColor: "bg-blue-50" },
    { title: "Total Teachers", value: stats.totalTeachers, icon: GraduationCap, color: "text-green-600", bgColor: "bg-green-50" },
    { title: "Total Parents", value: stats.totalParents, icon: UserCheck, color: "text-purple-600", bgColor: "bg-purple-50" },
    { title: "Accountants", value: stats.totalAccountants, icon: Wallet, color: "text-orange-600", bgColor: "bg-orange-50" },
  ];

  const genderData = [
    { name: "Boys", value: stats.studentGender.boys, color: "#3b82f6" },
    { name: "Girls", value: stats.studentGender.girls, color: "#ec4899" },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-12 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 bg-muted animate-pulse rounded" />
          <div className="h-96 bg-muted animate-pulse rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-black">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.title} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                  <p className="text-3xl font-bold text-black mt-2">{card.value}</p>
                </div>
                <div className={`${card.bgColor} p-3 rounded-full`}>
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Events & Announcements */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg">Events & Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
            {/* Calendar */}
            <div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-lg border"
                modifiers={{
                  hasEvent: events.map(e => {
                    const d = new Date(e.eventDate);
                    d.setHours(0, 0, 0, 0);
                    return d;
                  })
                }}
                modifiersStyles={{
                  hasEvent: { 
                    fontWeight: 'bold', 
                    textDecoration: 'underline',
                    color: '#3b82f6'
                  }
                }}
              />
            </div>

            {/* Events List */}
            <div className="space-y-4">
              {/* Today's Events */}
              {selectedDate && (() => {
                const todayEvents = events.filter(e => {
                  const eventDate = new Date(e.eventDate);
                  eventDate.setHours(0, 0, 0, 0);
                  const selected = new Date(selectedDate);
                  selected.setHours(0, 0, 0, 0);
                  return eventDate.getTime() === selected.getTime();
                });
                
                if (todayEvents.length > 0) {
                  return (
                    <div>
                      <h3 className="text-lg font-semibold text-black mb-2">
                        {selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </h3>
                      <div className="space-y-2">
                        {todayEvents.map((e) => (
                          <div 
                            key={e.id}
                            className="p-3 bg-blue-50 rounded-lg border border-blue-200 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95"
                          >
                            <p className="text-sm font-medium text-black">{e.title}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Upcoming Events */}
              <div>
                <h3 className="text-lg font-semibold text-black mb-2">Upcoming</h3>
                <div className="space-y-2">
                  {events.slice(0, 3).map((e) => {
                    const eventDate = new Date(e.eventDate);
                    const eventIcon = e.title.toLowerCase().includes("sport") ? "🎯" : 
                                    e.title.toLowerCase().includes("football") ? "🔔" :
                                    e.title.toLowerCase().includes("exam") ? "📝" :
                                    e.title.toLowerCase().includes("meeting") ? "👥" : "📅";
                    
                    return (
                      <div 
                        key={e.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{eventIcon}</span>
                          <span className="text-sm font-medium text-black">{e.title}</span>
                        </div>
                        <span className="text-sm font-semibold text-green-600">
                          {eventDate.getDate()}/{eventDate.getMonth() + 1}
                        </span>
                      </div>
                    );
                  })}
                  {events.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-4">No upcoming events</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Attendance Rate Card */}
        <Card className="lg:col-span-1 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                  <circle
                    cx="80" cy="80" r="70" stroke="#10b981" strokeWidth="12" fill="none"
                    strokeDasharray={`${2 * Math.PI * 70}`}
                    strokeDashoffset={`${2 * Math.PI * 70 * (1 - stats.attendanceRate / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-black">{stats.attendanceRate}%</span>
                  <span className="text-xs text-muted-foreground">This Week</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 mt-4">
              {stats.attendanceTrend === "up" ? (
                <>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">Trending up</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-600 font-medium">Trending down</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Attendance Chart */}
        <Card className="lg:col-span-2 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Weekly Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <AttendanceBarChart data={attendanceData} />
          </CardContent>
        </Card>
      </div>

      {/* Gender Distribution */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg">Student Gender Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          {genderData[0].value === 0 && genderData[1].value === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              <p>No student data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={genderData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name}: ${(percent! * 100).toFixed(0)}%`}
                >
                  {genderData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <a href="/admin/students" className="flex flex-col items-center justify-center p-4 rounded-lg border hover:bg-muted/50 transition-colors">
              <Users className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium">Manage Students</span>
            </a>
            <a href="/admin/teachers" className="flex flex-col items-center justify-center p-4 rounded-lg border hover:bg-muted/50 transition-colors">
              <GraduationCap className="h-8 w-8 text-green-600 mb-2" />
              <span className="text-sm font-medium">Manage Teachers</span>
            </a>
            <a href="/admin/classes" className="flex flex-col items-center justify-center p-4 rounded-lg border hover:bg-muted/50 transition-colors">
              <BookOpen className="h-8 w-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium">Manage Classes</span>
            </a>
            <a href="/admin/assignments" className="flex flex-col items-center justify-center p-4 rounded-lg border hover:bg-muted/50 transition-colors">
              <ClipboardList className="h-8 w-8 text-orange-600 mb-2" />
              <span className="text-sm font-medium">View Assignments</span>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AttendanceBarChart({ data }: { data: AttendanceData[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No attendance data available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((day, index) => {
        const total = day.present + day.absent + day.late;
        const presentPercent = total > 0 ? (day.present / total) * 100 : 0;
        const absentPercent = total > 0 ? (day.absent / total) * 100 : 0;
        const latePercent = total > 0 ? (day.late / total) * 100 : 0;

        return (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-black">{day.date}</span>
              <span className="text-muted-foreground">{total} students</span>
            </div>
            <div className="flex h-8 w-full overflow-hidden rounded-full bg-gray-100">
              {day.present > 0 && (
                <div
                  className="bg-green-500 flex items-center justify-center text-xs text-white font-medium"
                  style={{ width: `${presentPercent}%` }}
                >
                  {presentPercent > 10 && `${day.present}`}
                </div>
              )}
              {day.late > 0 && (
                <div
                  className="bg-yellow-500 flex items-center justify-center text-xs text-white font-medium"
                  style={{ width: `${latePercent}%` }}
                >
                  {latePercent > 10 && `${day.late}`}
                </div>
              )}
              {day.absent > 0 && (
                <div
                  className="bg-red-500 flex items-center justify-center text-xs text-white font-medium"
                  style={{ width: `${absentPercent}%` }}
                >
                  {absentPercent > 10 && `${day.absent}`}
                </div>
              )}
            </div>
          </div>
        );
      })}
      <div className="flex items-center justify-center gap-6 pt-4 border-t">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-xs text-muted-foreground">Present</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-xs text-muted-foreground">Late</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-xs text-muted-foreground">Absent</span>
        </div>
      </div>
    </div>
  );
}
