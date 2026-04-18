"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Calendar } from "@/core/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/core/components/ui/avatar";
import { Users, BookOpen, ClipboardList, Calendar as CalendarIcon, TrendingUp, CheckCircle2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface TeacherStats {
  totalStudents: number;
  totalLessons: number;
  totalAssignments: number;
  upcomingClasses: number;
  attendanceRate: number;
}

interface Event {
  id: string;
  title: string;
  description: string;
  eventDate: string;
}

interface RecentActivity {
  id: string;
  type: string;
  message: string;
  time: string;
}

export default function TeacherDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<TeacherStats>({
    totalStudents: 0,
    totalLessons: 0,
    totalAssignments: 0,
    upcomingClasses: 0,
    attendanceRate: 0,
  });
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(true);
  const [teacherName, setTeacherName] = useState<string>("Teacher");
  const [teacherImage, setTeacherImage] = useState<string | null>(null);
  const [recentActivities] = useState<RecentActivity[]>([
    { id: "1", type: "assignment", message: "New assignment submitted by John Doe", time: "2 hours ago" },
    { id: "2", type: "lesson", message: "Lesson 'Introduction to React' completed", time: "5 hours ago" },
    { id: "3", type: "attendance", message: "Attendance marked for Class 10-A", time: "1 day ago" },
  ]);

  useEffect(() => {
    if (session) {
      loadDashboardData();
    }
  }, [session]);

  async function loadDashboardData() {
    setLoading(true);
    try {
      const [studentsRes, lessonsRes, assignmentsRes, eventsRes] = await Promise.all([
        fetch("/api/students"),
        fetch("/api/lessons"),
        fetch("/api/assignments"),
        fetch("/api/events"),
      ]);

      const students = await studentsRes.json();
      const lessons = await lessonsRes.json();
      const assignments = await assignmentsRes.json();
      const eventsData = await eventsRes.json();

      const studentsArray = Array.isArray(students) ? students : (students.students || []);

      setStats({
        totalStudents: studentsArray.length,
        totalLessons: Array.isArray(lessons) ? lessons.length : 0,
        totalAssignments: Array.isArray(assignments) ? assignments.length : 0,
        upcomingClasses: 3, // This should come from routine API
        attendanceRate: 92, // This should come from attendance API
      });

      setEvents(Array.isArray(eventsData) ? eventsData : []);

      // Load teacher info based on session email
      if (session?.user?.email) {
        try {
          const teacherRes = await fetch(`/api/teachers?email=${encodeURIComponent(session.user.email)}`);
          if (teacherRes.ok) {
            const teacherData = await teacherRes.json();
            const teachers = Array.isArray(teacherData) ? teacherData : (teacherData.teachers || []);
            if (teachers.length > 0) {
              setTeacherName(teachers[0].username || "Teacher");
              setTeacherImage(teachers[0].img || null);
            }
          }
        } catch (error) {
          console.error("Failed to load teacher info:", error);
        }
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }

  const statCards = [
    { title: "My Students", value: stats.totalStudents, icon: Users, color: "text-blue-600", bgColor: "bg-blue-50" },
    { title: "Lessons", value: stats.totalLessons, icon: BookOpen, color: "text-green-600", bgColor: "bg-green-50" },
    { title: "Assignments", value: stats.totalAssignments, icon: ClipboardList, color: "text-purple-600", bgColor: "bg-purple-50" },
    { title: "Upcoming Classes", value: stats.upcomingClasses, icon: CalendarIcon, color: "text-orange-600", bgColor: "bg-orange-50" },
  ];

  const weeklyData = [
    { day: "Mon", present: 45, absent: 5 },
    { day: "Tue", present: 48, absent: 2 },
    { day: "Wed", present: 46, absent: 4 },
    { day: "Thu", present: 49, absent: 1 },
    { day: "Fri", present: 47, absent: 3 },
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
      {/* Header - Sticky */}
      <div className="sticky top-0 z-10 bg-background pb-4">
        <div className="flex items-center gap-4 mb-2">
          <Avatar className="h-16 w-16 border-2 border-primary">
            {teacherImage && (
              <AvatarImage 
                src={teacherImage} 
                alt={teacherName}
                className="object-cover"
                style={{ filter: 'none' }}
              />
            )}
            <AvatarFallback className="text-xl font-bold">
              {teacherName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-black flex items-center gap-2">
              Welcome back, {teacherName}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">Here's your teaching overview.</p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="space-y-6">
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

        {/* Weekly Attendance & Calendar */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Weekly Attendance Chart */}
          <Card className="lg:col-span-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-base">Weekly Attendance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="present" fill="#3b82f6" name="Present" />
                  <Bar dataKey="absent" fill="#f97316" name="Absent" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Attendance Rate */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-base">Attendance Rate</CardTitle>
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
                    <span className="text-xs text-muted-foreground">This Week</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 mt-3">
                <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                <span className="text-xs text-green-600 font-medium">Great attendance!</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events & Recent Activity */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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

          {/* Recent Activity */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-black">{activity.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
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
              <a href="/teacher/lessons" className="flex flex-col items-center justify-center p-3 rounded-lg border hover:bg-muted/50 transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95">
                <BookOpen className="h-6 w-6 text-blue-600 mb-1.5" />
                <span className="text-xs font-medium text-center">Create Lesson</span>
              </a>
              <a href="/teacher/assignments" className="flex flex-col items-center justify-center p-3 rounded-lg border hover:bg-muted/50 transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95">
                <ClipboardList className="h-6 w-6 text-green-600 mb-1.5" />
                <span className="text-xs font-medium text-center">New Assignment</span>
              </a>
              <a href="/teacher/attendance" className="flex flex-col items-center justify-center p-3 rounded-lg border hover:bg-muted/50 transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95">
                <CheckCircle2 className="h-6 w-6 text-purple-600 mb-1.5" />
                <span className="text-xs font-medium text-center">Mark Attendance</span>
              </a>
              <a href="/teacher/students" className="flex flex-col items-center justify-center p-3 rounded-lg border hover:bg-muted/50 transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95">
                <Users className="h-6 w-6 text-orange-600 mb-1.5" />
                <span className="text-xs font-medium text-center">View Students</span>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}









