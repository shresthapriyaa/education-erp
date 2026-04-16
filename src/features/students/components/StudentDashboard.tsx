"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Calendar } from "@/core/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/core/components/ui/avatar";
import { BookOpen, ClipboardList, Calendar as CalendarIcon, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { Progress } from "@/core/components/ui/progress";

interface StudentStats {
  totalLessons: number;
  totalAssignments: number;
  pendingAssignments: number;
  completedAssignments: number;
  attendanceRate: number;
  upcomingClasses: number;
}

interface Event {
  id: string;
  title: string;
  description: string;
  eventDate: string;
}

interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded";
}

export default function StudentDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<StudentStats>({
    totalLessons: 0,
    totalAssignments: 0,
    pendingAssignments: 0,
    completedAssignments: 0,
    attendanceRate: 0,
    upcomingClasses: 0,
  });
  const [events, setEvents] = useState<Event[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState<string>("Student");
  const [studentImage, setStudentImage] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      loadDashboardData();
    }
  }, [session]);

  async function loadDashboardData() {
    setLoading(true);
    try {
      const [lessonsRes, assignmentsRes, eventsRes] = await Promise.all([
        fetch("/api/lessons"),
        fetch("/api/assignments"),
        fetch("/api/events"),
      ]);

      const lessons = await lessonsRes.json();
      const assignmentsData = await assignmentsRes.json();
      const eventsData = await eventsRes.json();

      const assignmentsArray = Array.isArray(assignmentsData) ? assignmentsData : [];
      const pending = assignmentsArray.filter((a: any) => !a.submitted).length;
      const completed = assignmentsArray.filter((a: any) => a.submitted).length;

      setStats({
        totalLessons: Array.isArray(lessons) ? lessons.length : 0,
        totalAssignments: assignmentsArray.length,
        pendingAssignments: pending,
        completedAssignments: completed,
        attendanceRate: 94,
        upcomingClasses: 4,
      });

      setEvents(Array.isArray(eventsData) ? eventsData : []);
      setAssignments(assignmentsArray.slice(0, 3));

      // Load student info
      if (session?.user?.email) {
        try {
          const studentRes = await fetch(`/api/students?email=${encodeURIComponent(session.user.email)}`);
          if (studentRes.ok) {
            const studentData = await studentRes.json();
            const students = Array.isArray(studentData) ? studentData : (studentData.students || []);
            if (students.length > 0) {
              setStudentName(students[0].username || "Student");
              setStudentImage(students[0].img || null);
            }
          }
        } catch (error) {
          console.error("Failed to load student info:", error);
        }
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }

  const statCards = [
    { title: "My Lessons", value: stats.totalLessons, icon: BookOpen, color: "text-blue-600", bgColor: "bg-blue-50" },
    { title: "Total Assignments", value: stats.totalAssignments, icon: ClipboardList, color: "text-green-600", bgColor: "bg-green-50" },
    { title: "Pending", value: stats.pendingAssignments, icon: Clock, color: "text-orange-600", bgColor: "bg-orange-50" },
    { title: "Completed", value: stats.completedAssignments, icon: CheckCircle2, color: "text-purple-600", bgColor: "bg-purple-50" },
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background pb-4">
        <div className="flex items-center gap-4 mb-2">
          <Avatar className="h-16 w-16 border-2 border-primary">
            {studentImage && <AvatarImage src={studentImage} alt={studentName} />}
            <AvatarFallback className="text-xl font-bold">
              {studentName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-black flex items-center gap-2">
              Welcome back, {studentName}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">Here's your learning overview.</p>
          </div>
        </div>
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

      {/* Attendance & Upcoming Assignments */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Attendance Rate */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-base">My Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="10" fill="none" />
                  <circle
                    cx="64" cy="64" r="56" stroke="#10b981" strokeWidth="10" fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - stats.attendanceRate / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-black">{stats.attendanceRate}%</span>
                  <span className="text-xs text-muted-foreground">This Month</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 mt-3">
              <TrendingUp className="h-3.5 w-3.5 text-green-600" />
              <span className="text-xs text-green-600 font-medium">Excellent attendance!</span>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Assignments */}
        <Card className="lg:col-span-2 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-base">Upcoming Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {assignments.length > 0 ? (
                assignments.map((assignment) => (
                  <div key={assignment.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border">
                    <ClipboardList className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-black">{assignment.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded bg-orange-100 text-orange-700 font-medium">
                      Pending
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No pending assignments</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events & Announcements */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-base">Events & Announcements</CardTitle>
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

      {/* Quick Actions */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <a href="/student/lessons" className="flex flex-col items-center justify-center p-3 rounded-lg border hover:bg-muted/50 transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95">
              <BookOpen className="h-6 w-6 text-blue-600 mb-1.5" />
              <span className="text-xs font-medium text-center">View Lessons</span>
            </a>
            <a href="/student/assignments" className="flex flex-col items-center justify-center p-3 rounded-lg border hover:bg-muted/50 transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95">
              <ClipboardList className="h-6 w-6 text-green-600 mb-1.5" />
              <span className="text-xs font-medium text-center">Assignments</span>
            </a>
            <a href="/student/attendance" className="flex flex-col items-center justify-center p-3 rounded-lg border hover:bg-muted/50 transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95">
              <CheckCircle2 className="h-6 w-6 text-purple-600 mb-1.5" />
              <span className="text-xs font-medium text-center">My Attendance</span>
            </a>
            <a href="/student/routine" className="flex flex-col items-center justify-center p-3 rounded-lg border hover:bg-muted/50 transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95">
              <CalendarIcon className="h-6 w-6 text-orange-600 mb-1.5" />
              <span className="text-xs font-medium text-center">Class Routine</span>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
