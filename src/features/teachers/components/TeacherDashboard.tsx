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
            {teacherImage && <AvatarImage src={teacherImage} alt={teacherName} />}
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









// "use client";

// import { useEffect, useState } from "react";
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
//   ResponsiveContainer
// } from "recharts";

// interface TeacherStats {
//   totalStudents: number;
//   totalLessons: number;
//   totalAssignments: number;
//   upcomingClasses: number;
//   attendanceRate: number;
//   presentCount: number;
//   absentCount: number;
//   lateCount: number;
// }

// interface Event {
//   id: string;
//   title: string;
//   description: string;
//   eventDate: string;
//   location?: string;
//   tag?: "Exam" | "Meeting" | "Deadline";
// }

// interface RecentActivity {
//   id: string;
//   type: "assignment" | "lesson" | "attendance";
//   message: string;
//   highlight?: string;
//   time: string;
// }

// const NAV_ITEMS = [
//   {
//     section: "Overview",
//     items: [
//       { label: "Dashboard", href: "/teacher", icon: "grid", active: true },
//       { label: "Students", href: "/teacher/students", icon: "users" },
//       { label: "Lessons", href: "/teacher/lessons", icon: "book" },
//       { label: "Assignments", href: "/teacher/assignments", icon: "file" },
//     ],
//   },
//   {
//     section: "Manage",
//     items: [
//       { label: "Schedule", href: "/teacher/schedule", icon: "calendar" },
//       { label: "Attendance", href: "/teacher/attendance", icon: "check" },
//       { label: "Reports", href: "/teacher/reports", icon: "bar-chart" },
//     ],
//   },
// ];

// const ICONS: Record<string, JSX.Element> = {
//   grid: (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//       <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
//       <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
//     </svg>
//   ),
//   users: (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//       <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
//       <circle cx="9" cy="7" r="4"/>
//       <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
//     </svg>
//   ),
//   book: (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//       <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
//       <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
//     </svg>
//   ),
//   file: (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//       <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
//       <polyline points="14 2 14 8 20 8"/>
//       <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
//     </svg>
//   ),
//   calendar: (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//       <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
//       <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
//       <line x1="3" y1="10" x2="21" y2="10"/>
//     </svg>
//   ),
//   check: (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//       <polyline points="9 11 12 14 22 4"/>
//       <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
//     </svg>
//   ),
//   "bar-chart": (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//       <line x1="18" y1="20" x2="18" y2="10"/>
//       <line x1="12" y1="20" x2="12" y2="4"/>
//       <line x1="6" y1="20" x2="6" y2="14"/>
//     </svg>
//   ),
// };

// const weeklyData = [
//   { day: "Mon", present: 45, absent: 5 },
//   { day: "Tue", present: 48, absent: 2 },
//   { day: "Wed", present: 46, absent: 4 },
//   { day: "Thu", present: 49, absent: 1 },
//   { day: "Fri", present: 47, absent: 3 },
// ];

// const CIRCUMFERENCE = 2 * Math.PI * 46;

// function DonutChart({ rate }: { rate: number }) {
//   const presentOffset = CIRCUMFERENCE * (1 - rate / 100);
//   const absentOffset = CIRCUMFERENCE - (CIRCUMFERENCE * 0.05);
//   return (
//     <svg viewBox="0 0 110 110" width={110} height={110}>
//       <circle cx="55" cy="55" r="46" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
//       <circle cx="55" cy="55" r="46" fill="none" stroke="#2dd4bf" strokeWidth="12"
//         strokeDasharray={CIRCUMFERENCE} strokeDashoffset={presentOffset}
//         strokeLinecap="round" transform="rotate(-90 55 55)" />
//       <circle cx="55" cy="55" r="46" fill="none" stroke="#f87171" strokeWidth="12"
//         strokeDasharray={CIRCUMFERENCE} strokeDashoffset={absentOffset}
//         strokeLinecap="round" transform="rotate(198 55 55)" />
//     </svg>
//   );
// }

// function Sparkline({ color, points }: { color: string; points: string }) {
//   return (
//     <svg width="100%" height="28" viewBox="0 0 120 28" preserveAspectRatio="none">
//       <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" />
//       <polyline
//         points={`0,28 ${points} 120,28`}
//         fill={color.replace(")", ",0.08)")}
//         stroke="none"
//       />
//     </svg>
//   );
// }

// const TAG_STYLES: Record<string, string> = {
//   Exam: "bg-blue-500/15 text-blue-300",
//   Meeting: "bg-amber-500/10 text-amber-400",
//   Deadline: "bg-teal-500/10 text-teal-400",
// };

// const ACT_ICON_BG: Record<string, string> = {
//   assignment: "bg-purple-500/15",
//   lesson: "bg-teal-500/10",
//   attendance: "bg-amber-500/10",
// };

// const ACT_ICON_EMOJI: Record<string, string> = {
//   assignment: "📋",
//   lesson: "📖",
//   attendance: "✅",
// };

// const DEMO_EVENTS: Event[] = [
//   {
//     id: "e1",
//     title: "Mid-term Exam — Math",
//     description: "Hall B · 9:00 AM – 11:00 AM",
//     eventDate: "2026-04-18",
//     tag: "Exam",
//   },
//   {
//     id: "e2",
//     title: "Parent-Teacher Conference",
//     description: "Room 204 · 2:00 PM – 5:00 PM",
//     eventDate: "2026-04-20",
//     tag: "Meeting",
//   },
//   {
//     id: "e3",
//     title: "Science Project Submission",
//     description: "Online Portal · Deadline 11:59 PM",
//     eventDate: "2026-04-22",
//     tag: "Deadline",
//   },
// ];

// export default function TeacherDashboard() {
//   const [stats, setStats] = useState<TeacherStats>({
//     totalStudents: 0,
//     totalLessons: 0,
//     totalAssignments: 0,
//     upcomingClasses: 0,
//     attendanceRate: 0,
//     presentCount: 0,
//     absentCount: 0,
//     lateCount: 0,
//   });
//   const [events, setEvents] = useState<Event[]>([]);
//   const [loading, setLoading] = useState(true);

//   const recentActivities: RecentActivity[] = [
//     {
//       id: "1",
//       type: "assignment",
//       message: "Assignment submitted by John Doe —",
//       highlight: "Chapter 5 Problems",
//       time: "2 hours ago",
//     },
//     {
//       id: "2",
//       type: "lesson",
//       message: "Lesson",
//       highlight: "Intro to Algebra",
//       time: "5 hours ago",
//     },
//     {
//       id: "3",
//       type: "attendance",
//       message: "Attendance marked for",
//       highlight: "Class 10-A",
//       time: "Yesterday, 8:30 AM",
//     },
//     {
//       id: "4",
//       type: "assignment",
//       message: "New grade posted —",
//       highlight: "Maya Patel",
//       time: "Yesterday, 3:15 PM",
//     },
//   ];

//   useEffect(() => {
//     loadDashboardData();
//   }, []);

//   async function loadDashboardData() {
//     setLoading(true);
//     try {
//       const [studentsRes, lessonsRes, assignmentsRes, eventsRes] = await Promise.all([
//         fetch("/api/students"),
//         fetch("/api/lessons"),
//         fetch("/api/assignments"),
//         fetch("/api/events"),
//       ]);

//       const students = await studentsRes.json();
//       const lessons = await lessonsRes.json();
//       const assignments = await assignmentsRes.json();
//       const eventsData = await eventsRes.json();

//       const studentsArray = Array.isArray(students) ? students : students.students || [];

//       setStats({
//         totalStudents: studentsArray.length,
//         totalLessons: Array.isArray(lessons) ? lessons.length : 0,
//         totalAssignments: Array.isArray(assignments) ? assignments.length : 0,
//         upcomingClasses: 3,
//         attendanceRate: 92,
//         presentCount: 235,
//         absentCount: 15,
//         lateCount: 4,
//       });

//       setEvents(Array.isArray(eventsData) ? eventsData : []);
//     } catch (error) {
//       console.error("Failed to load dashboard data:", error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   const statCards = [
//     {
//       label: "My Students",
//       value: stats.totalStudents,
//       change: "↑ 4 new this week",
//       changeType: "up",
//       sparkColor: "rgba(45,212,191,0.5)",
//       sparkPoints: "0,22 20,18 40,20 60,14 80,10 100,8 120,5",
//     },
//     {
//       label: "Lessons",
//       value: stats.totalLessons,
//       change: "↑ 2 published",
//       changeType: "up",
//       sparkColor: "rgba(245,166,35,0.5)",
//       sparkPoints: "0,20 20,22 40,16 60,14 80,12 100,10 120,8",
//     },
//     {
//       label: "Assignments",
//       value: stats.totalAssignments,
//       change: "3 ungraded",
//       changeType: "warn",
//       sparkColor: "rgba(248,113,113,0.5)",
//       sparkPoints: "0,15 20,18 40,12 60,16 80,10 100,13 120,9",
//     },
//     {
//       label: "Upcoming Classes",
//       value: stats.upcomingClasses,
//       change: "Next: 10:00 AM",
//       changeType: "up",
//       sparkColor: "rgba(139,92,246,0.5)",
//       sparkPoints: "0,20 40,20 40,8 80,8 80,20 120,20",
//     },
//   ];

//   // ── FIX: extract display events into a variable before JSX ──
//   const displayEvents = events.length === 0 ? DEMO_EVENTS : events.slice(0, 4);

//   if (loading) {
//     return (
//       <div className="flex min-h-screen bg-[#0f1117]">
//         <div className="w-[220px] bg-[#181c27] border-r border-white/5 animate-pulse" />
//         <div className="flex-1 p-8 space-y-6">
//           <div className="h-12 bg-white/5 rounded-lg animate-pulse" />
//           <div className="grid grid-cols-4 gap-4">
//             {[1, 2, 3, 4].map((i) => (
//               <div key={i} className="h-36 bg-white/5 rounded-2xl animate-pulse" />
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex min-h-screen bg-[#0f1117] text-[#e8eaf0]" style={{ fontFamily: "'DM Sans', sans-serif" }}>

//       {/* ── SIDEBAR ── */}
//       <nav className="w-[220px] shrink-0 bg-[#181c27] border-r border-white/[0.07] flex flex-col">
//         {/* Logo */}
//         <div className="px-6 py-7 border-b border-white/[0.07]">
//           <div style={{ fontFamily: "'Lora', serif" }} className="text-xl font-semibold text-[#f5a623]">
//             Edu<span className="text-white">Desk</span>
//           </div>
//           <div className="text-[10px] tracking-[2px] uppercase text-[#8890a4] mt-1">Teacher Portal</div>
//         </div>

//         {/* Nav */}
//         <div className="flex-1 py-4">
//           {NAV_ITEMS.map((section) => (
//             <div key={section.section}>
//               <div className="px-6 py-3 text-[10px] tracking-[1.5px] uppercase text-[#8890a4] opacity-50">
//                 {section.section}
//               </div>
//               {section.items.map((item) => (
//                 <a
//                   key={item.label}
//                   href={item.href}
//                   className={`flex items-center gap-3 px-6 py-[11px] text-[13px] font-medium border-l-[3px] transition-all duration-200 no-underline
//                     ${item.active
//                       ? "text-[#f5a623] bg-[#f5a623]/[0.08] border-[#f5a623]"
//                       : "text-[#8890a4] border-transparent hover:text-[#e8eaf0] hover:bg-white/[0.04]"
//                     }`}
//                 >
//                   <span className="opacity-70">{ICONS[item.icon]}</span>
//                   {item.label}
//                 </a>
//               ))}
//             </div>
//           ))}
//         </div>

//         {/* Teacher card */}
//         <div className="mx-4 mb-6 p-4 bg-gradient-to-br from-[#f5a623]/15 to-[#f5a623]/[0.04] border border-[#f5a623]/20 rounded-xl">
//           <div className="w-10 h-10 rounded-full bg-[#f5a623] flex items-center justify-center font-semibold text-sm text-black mb-2.5">
//             SR
//           </div>
//           <div className="text-[13px] font-medium text-white">Sarah Reynolds</div>
//           <div className="text-[11px] text-[#f5a623] mt-0.5">Senior Teacher · Grade 10</div>
//         </div>
//       </nav>

//       {/* ── MAIN ── */}
//       <div className="flex-1 flex flex-col min-w-0">

//         {/* Topbar */}
//         <div className="flex items-center justify-between px-8 py-5 border-b border-white/[0.07] sticky top-0 bg-[#0f1117] z-10">
//           <div>
//             <h1 style={{ fontFamily: "'Lora', serif" }} className="text-[22px] font-semibold text-white">
//               Good morning, Sarah ✦
//             </h1>
//             <p className="text-xs text-[#8890a4] mt-0.5">
//               {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} · Semester 2, Week 11
//             </p>
//           </div>
//           <div className="flex items-center gap-3">
//             <span className="bg-[#f5a623]/10 border border-[#f5a623]/25 text-[#f5a623] text-[11px] px-3 py-1.5 rounded-full font-medium cursor-pointer">
//               3 pending reviews
//             </span>
//             <span className="bg-[#1f2435] border border-white/[0.07] text-[11px] text-[#8890a4] px-3 py-1.5 rounded-full">
//               Today: 3 classes
//             </span>
//           </div>
//         </div>

//         {/* Scrollable content */}
//         <div className="flex-1 overflow-y-auto p-8 space-y-6">

//           {/* ── STAT CARDS ── */}
//           <div className="grid grid-cols-4 gap-4">
//             {statCards.map((card) => (
//               <div
//                 key={card.label}
//                 className="bg-[#181c27] border border-white/[0.07] rounded-2xl p-5 relative overflow-hidden hover:-translate-y-0.5 hover:border-white/[0.14] transition-all duration-200 cursor-default"
//               >
//                 <div className="text-[11px] uppercase tracking-[1px] text-[#8890a4] font-medium">{card.label}</div>
//                 <div style={{ fontFamily: "'Lora', serif" }} className="text-[32px] font-light text-white mt-2.5 mb-1.5 leading-none">
//                   {card.value}
//                 </div>
//                 <div className={`text-[11px] font-medium ${card.changeType === "up" ? "text-[#2dd4bf]" : "text-[#f5a623]"}`}>
//                   {card.change}
//                 </div>
//                 <div className="mt-3 h-7">
//                   <Sparkline color={card.sparkColor} points={card.sparkPoints} />
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* ── CHART + DONUT ── */}
//           <div className="grid grid-cols-[1fr_280px] gap-5">
//             {/* Bar chart */}
//             <div className="bg-[#181c27] border border-white/[0.07] rounded-2xl p-6">
//               <div className="text-[13px] font-medium text-white mb-0.5">Weekly Attendance</div>
//               <div className="text-[11px] text-[#8890a4] mb-4">Present vs absent · This week</div>
//               <div className="flex gap-4 mb-3">
//                 {[{ color: "#2dd4bf", label: "Present" }, { color: "#f87171", label: "Absent" }].map((l) => (
//                   <span key={l.label} className="flex items-center gap-1.5 text-[11px] text-[#8890a4]">
//                     <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: l.color }} />
//                     {l.label}
//                   </span>
//                 ))}
//               </div>
//               <ResponsiveContainer width="100%" height={200}>
//                 <BarChart data={weeklyData} barCategoryGap="30%">
//                   <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
//                   <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#8890a4" }} axisLine={false} tickLine={false} />
//                   <YAxis tick={{ fontSize: 11, fill: "#8890a4" }} axisLine={false} tickLine={false} domain={[0, 55]} />
//                   <Tooltip
//                     contentStyle={{ background: "#1f2435", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
//                     labelStyle={{ color: "#e8eaf0" }}
//                     itemStyle={{ color: "#8890a4" }}
//                     cursor={{ fill: "rgba(255,255,255,0.03)" }}
//                   />
//                   <Bar dataKey="present" fill="#2dd4bf" fillOpacity={0.75} radius={[4, 4, 4, 4]} />
//                   <Bar dataKey="absent" fill="#f87171" fillOpacity={0.65} radius={[4, 4, 4, 4]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>

//             {/* Donut */}
//             <div className="bg-[#181c27] border border-white/[0.07] rounded-2xl p-6 flex flex-col">
//               <div className="text-[13px] font-medium text-white mb-0.5">Attendance Rate</div>
//               <div className="text-[11px] text-[#8890a4] mb-4">This week&apos;s overview</div>
//               <div className="flex flex-col items-center gap-4 flex-1">
//                 <div className="relative">
//                   <DonutChart rate={stats.attendanceRate} />
//                   <div className="absolute inset-0 flex flex-col items-center justify-center">
//                     <span style={{ fontFamily: "'Lora', serif" }} className="text-[22px] font-light text-white">{stats.attendanceRate}%</span>
//                     <span className="text-[9px] tracking-widest uppercase text-[#8890a4] mt-0.5">rate</span>
//                   </div>
//                 </div>
//                 <div className="w-full space-y-2">
//                   {[
//                     { color: "#2dd4bf", label: "Present", value: `${stats.presentCount} students` },
//                     { color: "#f87171", label: "Absent", value: `${stats.absentCount} students` },
//                     { color: "#f5a623", label: "Late", value: `${stats.lateCount} students` },
//                   ].map((row) => (
//                     <div key={row.label} className="flex justify-between items-center text-xs">
//                       <span className="flex items-center gap-1.5 text-[#8890a4]">
//                         <span className="w-2 h-2 rounded-full inline-block" style={{ background: row.color }} />
//                         {row.label}
//                       </span>
//                       <span className="font-medium text-white">{row.value}</span>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="w-full bg-[#2dd4bf]/[0.08] border border-[#2dd4bf]/15 rounded-lg py-2 text-center text-[11px] text-[#2dd4bf] font-medium mt-auto">
//                   Outstanding attendance this week!
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* ── EVENTS + ACTIVITY ── */}
//           <div className="grid grid-cols-2 gap-5">
//             {/* Upcoming Events */}
//             <div className="bg-[#181c27] border border-white/[0.07] rounded-2xl p-6">
//               <div className="text-[13px] font-medium text-white mb-0.5">Upcoming Events</div>
//               <div className="text-[11px] text-[#8890a4] mb-4">Next 7 days</div>
//               <div className="space-y-0">
//                 {displayEvents.map((ev) => {
//                   const d = new Date(ev.eventDate);
//                   return (
//                     <div key={ev.id} className="flex items-start gap-3 py-3 border-b border-white/[0.07] last:border-0">
//                       <div className="min-w-[40px] h-11 bg-[#f5a623]/10 border border-[#f5a623]/20 rounded-lg flex flex-col items-center justify-center shrink-0">
//                         <span style={{ fontFamily: "'Lora', serif" }} className="text-base font-semibold text-[#f5a623] leading-none">
//                           {d.getDate()}
//                         </span>
//                         <span className="text-[9px] uppercase tracking-widest text-[#b8741a]">
//                           {d.toLocaleString("default", { month: "short" })}
//                         </span>
//                       </div>
//                       <div>
//                         <div className="text-[13px] font-medium text-white">{ev.title}</div>
//                         <div className="text-[11px] text-[#8890a4] mt-0.5">{ev.description}</div>
//                         {ev.tag && (
//                           <span className={`inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-medium ${TAG_STYLES[ev.tag] ?? ""}`}>
//                             {ev.tag}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Recent Activity */}
//             <div className="bg-[#181c27] border border-white/[0.07] rounded-2xl p-6">
//               <div className="text-[13px] font-medium text-white mb-0.5">Recent Activity</div>
//               <div className="text-[11px] text-[#8890a4] mb-4">Latest updates from your classes</div>
//               <div className="space-y-0">
//                 {recentActivities.map((activity) => (
//                   <div key={activity.id} className="flex gap-3 py-2.5 border-b border-white/[0.07] last:border-0 items-start">
//                     <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-[13px] ${ACT_ICON_BG[activity.type]}`}>
//                       {ACT_ICON_EMOJI[activity.type]}
//                     </div>
//                     <div>
//                       <div className="text-xs text-[#e8eaf0] leading-snug">
//                         {activity.message}{" "}
//                         {activity.highlight && (
//                           <span className="text-[#f5a623] font-medium">{activity.highlight}</span>
//                         )}
//                       </div>
//                       <div className="text-[10px] text-[#8890a4] mt-0.5">{activity.time}</div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Quick actions */}
//               <div className="mt-5 pt-4 border-t border-white/[0.07]">
//                 <div className="text-[10px] uppercase tracking-[1px] text-[#8890a4] mb-3">Quick actions</div>
//                 <div className="grid grid-cols-4 gap-2">
//                   {[
//                     { emoji: "📚", label: "New Lesson", href: "/teacher/lessons", bg: "bg-blue-500/10" },
//                     { emoji: "📝", label: "Assignment", href: "/teacher/assignments", bg: "bg-[#f5a623]/10" },
//                     { emoji: "✅", label: "Attendance", href: "/teacher/attendance", bg: "bg-teal-500/10" },
//                     { emoji: "👥", label: "Students", href: "/teacher/students", bg: "bg-purple-500/10" },
//                   ].map((qa) => (
//                     <a
//                       key={qa.label}
//                       href={qa.href}
//                       className="flex flex-col items-center justify-center gap-2 p-3 border border-white/[0.07] rounded-xl cursor-pointer hover:bg-[#1f2435] hover:border-white/[0.14] hover:-translate-y-0.5 transition-all duration-200 no-underline"
//                     >
//                       <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center text-base ${qa.bg}`}>
//                         {qa.emoji}
//                       </div>
//                       <span className="text-[11px] font-medium text-[#8890a4] text-center leading-tight">{qa.label}</span>
//                     </a>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }