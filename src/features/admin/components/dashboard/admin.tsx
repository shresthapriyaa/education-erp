"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/core/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Calendar } from "@/core/components/ui/calendar";
import {
  GraduationCap,
  Users,
  UserCheck,
  Wallet,
} from "lucide-react";

type Event = { date: string; title: string };
type DashboardData = {
  stats: {
    teachers: number;
    students: number;
    parents: number;
    accountants: number;
    studentGender: { boys: number; girls: number };
  };
  events: Event[];
};

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch dashboard data');
        return res.json();
      })
      .then((json) => {
        setData(json);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
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

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>No data available</p>
      </div>
    );
  }

  const studentGenderData = [
    { name: "Boys", value: data.stats.studentGender.boys, color: "#3b82f6" },
    { name: "Girls", value: data.stats.studentGender.girls, color: "#ec4899" },
  ];

  const events = data.events.map((e) => ({ ...e, date: new Date(e.date) }));

  const filteredEvents = events.filter(
    (e) => selectedDate && e.date.toDateString() === selectedDate.toDateString()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">System overview and user statistics</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Teachers" 
          value={data.stats.teachers}
          icon={<GraduationCap className="w-6 h-6 text-blue-600" />}
        />
        <StatCard 
          title="Students" 
          value={data.stats.students}
          icon={<Users className="w-6 h-6 text-green-600" />}
        />
        <StatCard 
          title="Parents" 
          value={data.stats.parents}
          icon={<UserCheck className="w-6 h-6 text-purple-600" />}
        />
        <StatCard 
          title="Accountants" 
          value={data.stats.accountants}
          icon={<Wallet className="w-6 h-6 text-orange-600" />}
        />
      </div>

      {/* Chart + Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Gender Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Student Gender Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {studentGenderData[0].value === 0 && studentGenderData[1].value === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <p>No student data available</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={studentGenderData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) => `${name}: ${(percent! * 100).toFixed(0)}%`}
                  >
                    {studentGenderData.map((entry, index) => (
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

        {/* Events Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>2026 Events & Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-lg border"
            />

            <div className="mt-4 space-y-2">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((e, i) => (
                  <div key={i} className="p-2 bg-muted rounded-md">
                    <p className="text-sm font-medium">📌 {e.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {e.date.toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No events on this date
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  icon 
}: { 
  title: string; 
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value.toLocaleString()}</p>
      </CardContent>
    </Card>
  );
}







// // "use client";

// // import { useEffect, useState } from "react";
// // import { Card, CardHeader, CardTitle, CardContent } from "@/core/components/ui/card";
// // import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
// // import { Calendar } from "@/core/components/ui/calendar";
// // import { Badge } from "@/core/components/ui/badge";
// // import {
// //   GraduationCap,
// //   Users,
// //   UserCheck,
// //   Wallet,
// //   Calendar as CalendarIcon,
// //   TrendingUp,
// // } from "lucide-react";

// // type Event = { date: string; title: string; description?: string };
// // type DashboardData = {
// //   stats: {
// //     teachers: number;
// //     students: number;
// //     parents: number;
// //     accountants: number;
// //     studentGender: { boys: number; girls: number };
// //   };
// //   events: Event[];
// //   attendance?: {
// //     day: string;
// //     present: number;
// //     absent: number;
// //   }[];
// // };

// // export default function AdminDashboard() {
// //   const [data, setData] = useState<DashboardData | null>(null);
// //   const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);

// //   useEffect(() => {
// //     fetch("/api/dashboard")
// //       .then((res) => {
// //         if (!res.ok) throw new Error('Failed to fetch dashboard data');
// //         return res.json();
// //       })
// //       .then((json) => {
// //         setData(json);
// //         setIsLoading(false);
// //       })
// //       .catch((err) => {
// //         console.error(err);
// //         setError(err.message);
// //         setIsLoading(false);
// //       });
// //   }, []);

// //   if (isLoading) {
// //     return (
// //       <div className="space-y-6">
// //         <div className="h-12 bg-muted animate-pulse rounded" />
// //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
// //           {[1, 2, 3, 4].map((i) => (
// //             <div key={i} className="h-32 bg-muted animate-pulse rounded" />
// //           ))}
// //         </div>
// //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// //           <div className="h-96 bg-muted animate-pulse rounded" />
// //           <div className="h-96 bg-muted animate-pulse rounded" />
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="flex items-center justify-center h-64">
// //         <p className="text-red-500">Error: {error}</p>
// //       </div>
// //     );
// //   }

// //   if (!data) {
// //     return (
// //       <div className="flex items-center justify-center h-64">
// //         <p>No data available</p>
// //       </div>
// //     );
// //   }

// //   const studentGenderData = [
// //     { name: "Boys", value: data.stats.studentGender.boys, color: "#3b82f6" },
// //     { name: "Girls", value: data.stats.studentGender.girls, color: "#ec4899" },
// //   ];

// //   // Mock attendance data (replace with real data from API)
// //   const attendanceData = data.attendance || [
// //     { day: "Mon", present: 320, absent: 30 },
// //     { day: "Tue", present: 335, absent: 15 },
// //     { day: "Wed", present: 310, absent: 40 },
// //     { day: "Thu", present: 340, absent: 10 },
// //     { day: "Fri", present: 325, absent: 25 },
// //   ];

// //   const events = data.events.map((e) => ({ ...e, date: new Date(e.date) }));
  
// //   // Get upcoming events (sorted by date)
// //   const upcomingEvents = events
// //     .filter((e) => e.date >= new Date())
// //     .sort((a, b) => a.date.getTime() - b.date.getTime())
// //     .slice(0, 5);

// //   const filteredEvents = events.filter(
// //     (e) => selectedDate && e.date.toDateString() === selectedDate.toDateString()
// //   );

// //   return (
// //     <div className="space-y-6">
// //       {/* Header */}
// //       <div>
// //         <h1 className="text-2xl font-semibold">Dashboard</h1>
// //         <p className="text-sm text-muted-foreground">System overview and user statistics</p>
// //       </div>

// //       {/* Stats */}
// //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
// //         <StatCard 
// //           title="Teachers" 
// //           value={data.stats.teachers}
// //           icon={<GraduationCap className="w-6 h-6 text-blue-600" />}
// //         />
// //         <StatCard 
// //           title="Students" 
// //           value={data.stats.students}
// //           icon={<Users className="w-6 h-6 text-green-600" />}
// //         />
// //         <StatCard 
// //           title="Parents" 
// //           value={data.stats.parents}
// //           icon={<UserCheck className="w-6 h-6 text-purple-600" />}
// //         />
// //         <StatCard 
// //           title="Accountants" 
// //           value={data.stats.accountants}
// //           icon={<Wallet className="w-6 h-6 text-orange-600" />}
// //         />
// //       </div>

// //       {/* Charts Row */}
// //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// //         {/* Student Gender Pie Chart */}
// //         <Card>
// //           <CardHeader>
// //             <CardTitle>Student Gender Distribution</CardTitle>
// //           </CardHeader>
// //           <CardContent>
// //             {studentGenderData[0].value === 0 && studentGenderData[1].value === 0 ? (
// //               <div className="h-[300px] flex items-center justify-center text-muted-foreground">
// //                 <p>No student data available</p>
// //               </div>
// //             ) : (
// //               <ResponsiveContainer width="100%" height={300}>
// //                 <PieChart>
// //                   <Pie
// //                     data={studentGenderData}
// //                     dataKey="value"
// //                     nameKey="name"
// //                     cx="50%"
// //                     cy="50%"
// //                     outerRadius={100}
// //                     label={({ name, percent }) => `${name}: ${(percent! * 100).toFixed(0)}%`}
// //                   >
// //                     {studentGenderData.map((entry, index) => (
// //                       <Cell key={index} fill={entry.color} />
// //                     ))}
// //                   </Pie>
// //                   <Tooltip />
// //                   <Legend />
// //                 </PieChart>
// //               </ResponsiveContainer>
// //             )}
// //           </CardContent>
// //         </Card>

// //         {/* Attendance Bar Chart */}
// //         <Card>
// //           <CardHeader>
// //             <CardTitle className="flex items-center gap-2">
// //               <TrendingUp className="w-5 h-5" />
// //               Weekly Attendance
// //             </CardTitle>
// //           </CardHeader>
// //           <CardContent>
// //             <ResponsiveContainer width="100%" height={300}>
// //               <BarChart data={attendanceData}>
// //                 <CartesianGrid strokeDasharray="3 3" />
// //                 <XAxis dataKey="day" />
// //                 <YAxis />
// //                 <Tooltip />
// //                 <Legend />
// //                 <Bar dataKey="present" fill="#22c55e" name="Present" />
// //                 <Bar dataKey="absent" fill="#ef4444" name="Absent" />
// //               </BarChart>
// //             </ResponsiveContainer>
// //           </CardContent>
// //         </Card>
// //       </div>

// //       {/* Calendar and Events Row */}
// //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// //         {/* Events Calendar */}
// //         <Card>
// //           <CardHeader>
// //             <CardTitle className="flex items-center gap-2">
// //               <CalendarIcon className="w-5 h-5" />
// //               Events Calendar
// //             </CardTitle>
// //           </CardHeader>
// //           <CardContent>
// //             <Calendar
// //               mode="single"
// //               selected={selectedDate}
// //               onSelect={setSelectedDate}
// //               className="rounded-lg border"
// //             />

// //             <div className="mt-4 space-y-2">
// //               <p className="text-sm font-medium">
// //                 Events on {selectedDate?.toLocaleDateString()}:
// //               </p>
// //               {filteredEvents.length > 0 ? (
// //                 filteredEvents.map((e, i) => (
// //                   <div key={i} className="p-2 bg-muted rounded-md">
// //                     <p className="text-sm font-medium">📌 {e.title}</p>
// //                     {e.description && (
// //                       <p className="text-xs text-muted-foreground mt-1">
// //                         {e.description}
// //                       </p>
// //                     )}
// //                   </div>
// //                 ))
// //               ) : (
// //                 <p className="text-sm text-muted-foreground text-center py-4">
// //                   No events on this date
// //                 </p>
// //               )}
// //             </div>
// //           </CardContent>
// //         </Card>

// //         {/* Upcoming Events */}
// //         <Card>
// //           <CardHeader>
// //             <CardTitle className="flex items-center gap-2">
// //               <CalendarIcon className="w-5 h-5" />
// //               Upcoming Events
// //             </CardTitle>
// //           </CardHeader>
// //           <CardContent>
// //             <div className="space-y-3">
// //               {upcomingEvents.length > 0 ? (
// //                 upcomingEvents.map((event, i) => (
// //                   <div 
// //                     key={i} 
// //                     className="p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
// //                   >
// //                     <div className="flex items-start justify-between gap-2">
// //                       <div className="flex-1 space-y-1">
// //                         <p className="text-sm font-medium leading-none">
// //                           {event.title}
// //                         </p>
// //                         {event.description && (
// //                           <p className="text-xs text-muted-foreground">
// //                             {event.description}
// //                           </p>
// //                         )}
// //                         <p className="text-xs text-muted-foreground flex items-center gap-1">
// //                           <CalendarIcon className="w-3 h-3" />
// //                           {event.date.toLocaleDateString('en-US', { 
// //                             weekday: 'short', 
// //                             month: 'short', 
// //                             day: 'numeric',
// //                             year: 'numeric'
// //                           })}
// //                         </p>
// //                       </div>
// //                       <Badge variant="secondary">
// //                         {Math.ceil((event.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
// //                       </Badge>
// //                     </div>
// //                   </div>
// //                 ))
// //               ) : (
// //                 <div className="text-center py-8">
// //                   <CalendarIcon className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
// //                   <p className="text-sm text-muted-foreground">
// //                     No upcoming events
// //                   </p>
// //                 </div>
// //               )}
// //             </div>
// //           </CardContent>
// //         </Card>
// //       </div>
// //     </div>
// //   );
// // }

// // function StatCard({ 
// //   title, 
// //   value, 
// //   icon 
// // }: { 
// //   title: string; 
// //   value: number;
// //   icon: React.ReactNode;
// // }) {
// //   return (
// //     <Card>
// //       <CardHeader className="flex flex-row items-center justify-between pb-2">
// //         <CardTitle className="text-sm font-medium">{title}</CardTitle>
// //         {icon}
// //       </CardHeader>
// //       <CardContent>
// //         <p className="text-3xl font-bold">{value.toLocaleString()}</p>
// //       </CardContent>
// //     </Card>
// //   );
// // }




// "use client";

// import { useEffect, useState } from "react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/core/components/ui/card";
// import {
//   PieChart, Pie, Cell, Tooltip, Legend,
//   ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
// } from "recharts";
// import { Calendar } from "@/core/components/ui/calendar";
// import {
//   GraduationCap, Users, UserCheck, Wallet,
//   TrendingUp, Clock, AlertCircle, CheckCircle2,
// } from "lucide-react";

// // Types 

// type Event = { date: string; title: string };

// type DashboardData = {
//   stats: {
//     teachers:      number;
//     students:      number;
//     parents:       number;
//     accountants:   number;
//     studentGender: { boys: number; girls: number };
//   };
//   attendance: {
//     todayPresent:   number;
//     todayAbsent:    number;
//     todayLate:      number;
//     todayTotal:     number;
//     weeklyTrend:    { day: string; present: number; absent: number; late: number }[];
//     recentSessions: {
//       id:          string;
//       className:   string;
//       teacher:     string;
//       time:        string;
//       present:     number;
//       total:       number;
//       status:      "active" | "ended";
//     }[];
//   };
//   events: Event[];
// };

// // Skeleton

// function Skeleton({ className = "" }: { className?: string }) {
//   return <div className={`bg-muted animate-pulse rounded-xl ${className}`} />;
// }

// //  Stat Card

// function StatCard({
//   title, value, icon, sub, accent,
// }: {
//   title:   string;
//   value:   number | string;
//   icon:    React.ReactNode;
//   sub?:    string;
//   accent?: string;
// }) {
//   return (
//     <Card className="relative overflow-hidden border border-border/60 shadow-sm">
//       <div
//         className="absolute inset-0 opacity-[0.04] pointer-events-none"
//         style={{ background: accent ?? "#6366f1" }}
//       />
//       <CardContent className="pt-5 pb-4 px-5">
//         <div className="flex items-start justify-between">
//           <div>
//             <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
//               {title}
//             </p>
//             <p className="text-3xl font-black tracking-tight" style={{ color: accent ?? "#111827" }}>
//               {typeof value === "number" ? value.toLocaleString() : value}
//             </p>
//             {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
//           </div>
//           <div
//             className="p-2 rounded-lg"
//             style={{ background: (accent ?? "#6366f1") + "15" }}
//           >
//             {icon}
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// // Attendance Rate Ring

// function AttendanceRing({ present, total }: { present: number; total: number }) {
//   const pct   = total > 0 ? Math.round((present / total) * 100) : 0;
//   const color = pct >= 80 ? "#16a34a" : pct >= 60 ? "#ca8a04" : "#dc2626";
//   const r     = 44;
//   const circ  = 2 * Math.PI * r;
//   const dash  = (pct / 100) * circ;

//   return (
//     <div className="flex flex-col items-center justify-center gap-1">
//       <svg width={110} height={110} viewBox="0 0 110 110">
//         <circle cx="55" cy="55" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
//         <circle
//           cx="55" cy="55" r={r} fill="none"
//           stroke={color} strokeWidth="10"
//           strokeDasharray={`${dash} ${circ}`}
//           strokeLinecap="round"
//           transform="rotate(-90 55 55)"
//           style={{ transition: "stroke-dasharray 0.6s ease" }}
//         />
//         <text x="55" y="52" textAnchor="middle" fontSize="20" fontWeight="800" fill={color}>{pct}%</text>
//         <text x="55" y="66" textAnchor="middle" fontSize="9" fill="#9ca3af">attendance</text>
//       </svg>
//       <p className="text-xs text-muted-foreground">{present} / {total} students</p>
//     </div>
//   );
// }

// // ─── Main ─────────────────────────────────────────────────────────────────────

// export default function AdminDashboard() {
//   const [data,         setData]         = useState<DashboardData | null>(null);
//   const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
//   const [isLoading,    setIsLoading]    = useState(true);
//   const [error,        setError]        = useState<string | null>(null);

//   useEffect(() => {
//     fetch("/api/dashboard")
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to fetch dashboard data");
//         return res.json();
//       })
//       .then((json) => { setData(json); setIsLoading(false); })
//       .catch((err) => { setError(err.message); setIsLoading(false); });
//   }, []);

//   // Loading 
//   if (isLoading) return (
//     <div className="space-y-6 p-6">
//       <Skeleton className="h-10 w-64" />
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         {[1,2,3,4].map(i => <Skeleton key={i} className="h-28" />)}
//       </div>
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         {[1,2,3,4].map(i => <Skeleton key={i} className="h-28" />)}
//       </div>
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <Skeleton className="h-72 lg:col-span-2" />
//         <Skeleton className="h-72" />
//       </div>
//     </div>
//   );

//   //  Error 
//   if (error) return (
//     <div className="flex items-center justify-center h-64 gap-2 text-red-500">
//       <AlertCircle className="w-5 h-5" /> <p>{error}</p>
//     </div>
//   );

//   if (!data) return (
//     <div className="flex items-center justify-center h-64 text-muted-foreground">
//       No data available
//     </div>
//   );

//   const { stats, attendance, events } = data;

//   const genderData = [
//     { name: "Boys",  value: stats.studentGender.boys,  color: "#3b82f6" },
//     { name: "Girls", value: stats.studentGender.girls, color: "#ec4899" },
//   ];

//   const parsedEvents  = events.map(e => ({ ...e, date: new Date(e.date) }));
//   const filteredEvents = parsedEvents.filter(
//     e => selectedDate && e.date.toDateString() === selectedDate.toDateString()
//   );

//   const todayRate = attendance.todayTotal > 0
//     ? Math.round((attendance.todayPresent / attendance.todayTotal) * 100)
//     : 0;

//   return (
//     <div className="space-y-6 p-6" style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>

//       {/* ── Header ── */}
//       <div className="flex items-end justify-between">
//         <div>
//           <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
//             Admin Panel
//           </p>
//           <h1 className="text-2xl font-black tracking-tight text-foreground">Dashboard</h1>
//         </div>
//         <span className="text-xs text-muted-foreground">
//           {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
//         </span>
//       </div>

//       {/* ── User Stats ── */}
//       <div>
//         <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
//           Users
//         </p>
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//           <StatCard title="Teachers"    value={stats.teachers}    accent="#3b82f6" icon={<GraduationCap className="w-5 h-5 text-blue-500" />} />
//           <StatCard title="Students"    value={stats.students}    accent="#16a34a" icon={<Users className="w-5 h-5 text-green-600" />} />
//           <StatCard title="Parents"     value={stats.parents}     accent="#8b5cf6" icon={<UserCheck className="w-5 h-5 text-purple-500" />} />
//           <StatCard title="Accountants" value={stats.accountants} accent="#f59e0b" icon={<Wallet className="w-5 h-5 text-amber-500" />} />
//         </div>
//       </div>

//       {/* ── Today's Attendance ── */}
//       <div>
//         <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
//           Today's Attendance
//         </p>
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//           <StatCard
//             title="Present"
//             value={attendance.todayPresent}
//             accent="#16a34a"
//             icon={<CheckCircle2 className="w-5 h-5 text-green-600" />}
//             sub={`${todayRate}% attendance rate`}
//           />
//           <StatCard
//             title="Absent"
//             value={attendance.todayAbsent}
//             accent="#dc2626"
//             icon={<AlertCircle className="w-5 h-5 text-red-500" />}
//             sub="not checked in"
//           />
//           <StatCard
//             title="Late"
//             value={attendance.todayLate}
//             accent="#ca8a04"
//             icon={<Clock className="w-5 h-5 text-yellow-600" />}
//             sub="arrived after threshold"
//           />
//           <StatCard
//             title="Total Sessions"
//             value={attendance.recentSessions.length}
//             accent="#6366f1"
//             icon={<TrendingUp className="w-5 h-5 text-indigo-500" />}
//             sub="active today"
//           />
//         </div>
//       </div>

//       {/* ── Charts Row ── */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//         {/* Weekly Trend Bar Chart */}
//         <Card className="lg:col-span-2 border border-border/60 shadow-sm">
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-bold">Weekly Attendance Trend</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={240}>
//               <BarChart data={attendance.weeklyTrend} barCategoryGap="30%">
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                 <XAxis dataKey="day" tick={{ fontSize: 12 }} />
//                 <YAxis tick={{ fontSize: 12 }} />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="present" fill="#16a34a" radius={[4,4,0,0]} name="Present" />
//                 <Bar dataKey="late"    fill="#ca8a04" radius={[4,4,0,0]} name="Late" />
//                 <Bar dataKey="absent"  fill="#dc2626" radius={[4,4,0,0]} name="Absent" />
//               </BarChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         {/* Today's Ring + Gender Pie */}
//         <Card className="border border-border/60 shadow-sm">
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-bold">Today's Overview</CardTitle>
//           </CardHeader>
//           <CardContent className="flex flex-col items-center gap-4">
//             <AttendanceRing present={attendance.todayPresent} total={attendance.todayTotal} />
//             <div className="w-full h-px bg-border" />
//             <div className="w-full">
//               <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2 text-center">
//                 Gender Split
//               </p>
//               <ResponsiveContainer width="100%" height={130}>
//                 <PieChart>
//                   <Pie data={genderData} dataKey="value" cx="50%" cy="50%" outerRadius={50}
//                     label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                     labelLine={false}
//                   >
//                     {genderData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
//                   </Pie>
//                   <Tooltip />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* ── Recent Sessions + Calendar ── */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//         {/* Recent Sessions Table */}
//         <Card className="lg:col-span-2 border border-border/60 shadow-sm">
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-bold">Recent Sessions</CardTitle>
//           </CardHeader>
//           <CardContent>
//             {attendance.recentSessions.length === 0 ? (
//               <p className="text-sm text-muted-foreground text-center py-8">No sessions today</p>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full text-sm">
//                   <thead>
//                     <tr className="border-b border-border/50">
//                       <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Class</th>
//                       <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Teacher</th>
//                       <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Time</th>
//                       <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Attendance</th>
//                       <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {attendance.recentSessions.map((s) => {
//                       const rate = s.total > 0 ? Math.round((s.present / s.total) * 100) : 0;
//                       return (
//                         <tr key={s.id} className="border-b border-border/30 hover:bg-muted/40 transition-colors">
//                           <td className="py-2.5 px-3 font-medium">{s.className}</td>
//                           <td className="py-2.5 px-3 text-muted-foreground">{s.teacher}</td>
//                           <td className="py-2.5 px-3 text-muted-foreground">{s.time}</td>
//                           <td className="py-2.5 px-3">
//                             <div className="flex items-center gap-2">
//                               <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden w-16">
//                                 <div
//                                   className="h-full rounded-full"
//                                   style={{
//                                     width: `${rate}%`,
//                                     background: rate >= 80 ? "#16a34a" : rate >= 60 ? "#ca8a04" : "#dc2626"
//                                   }}
//                                 />
//                               </div>
//                               <span className="text-xs font-medium">{s.present}/{s.total}</span>
//                             </div>
//                           </td>
//                           <td className="py-2.5 px-3">
//                             <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
//                               s.status === "active"
//                                 ? "bg-green-100 text-green-700"
//                                 : "bg-muted text-muted-foreground"
//                             }`}>
//                               {s.status === "active" ? "● Live" : "Ended"}
//                             </span>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Events Calendar */}
//         <Card className="border border-border/60 shadow-sm">
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-bold">Events & Announcements</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <Calendar
//               mode="single"
//               selected={selectedDate}
//               onSelect={setSelectedDate}
//               className="rounded-lg border"
//             />
//             <div className="mt-3 space-y-2">
//               {filteredEvents.length > 0 ? (
//                 filteredEvents.map((e, i) => (
//                   <div key={i} className="p-2 bg-muted rounded-md">
//                     <p className="text-sm font-medium">📌 {e.title}</p>
//                     <p className="text-xs text-muted-foreground">{e.date.toLocaleDateString()}</p>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-sm text-muted-foreground text-center py-3">
//                   No events on this date
//                 </p>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }



// "use client";

// import { useEffect, useState } from "react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/core/components/ui/card";
// import {
//   PieChart, Pie, Cell, Tooltip, Legend,
//   ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
// } from "recharts";
// import { Calendar } from "@/core/components/ui/calendar";
// import {
//   GraduationCap, Users, UserCheck, Wallet,
//   TrendingUp, Clock, AlertCircle, CheckCircle2,
// } from "lucide-react";

// // ─── Types ────────────────────────────────────────────────────────────────────

// type Event = { date: string; title: string };

// type DashboardData = {
//   stats: {
//     teachers:      number;
//     students:      number;
//     parents:       number;
//     accountants:   number;
//     studentGender: { boys: number; girls: number };
//   };
//   attendance: {
//     todayPresent:   number;
//     todayAbsent:    number;
//     todayLate:      number;
//     todayTotal:     number;
//     weeklyTrend:    { day: string; present: number; absent: number; late: number }[];
//     recentSessions: {
//       id:        string;
//       className: string;
//       teacher:   string;
//       time:      string;
//       present:   number;
//       total:     number;
//       status:    "active" | "ended";
//     }[];
//   };
//   events: Event[];
// };

// // ─── Skeleton ─────────────────────────────────────────────────────────────────

// function Skeleton({ className = "" }: { className?: string }) {
//   return <div className={`bg-muted animate-pulse rounded-xl ${className}`} />;
// }

// // ─── Stat Card ────────────────────────────────────────────────────────────────

// function StatCard({
//   title, value, icon, sub, accent,
// }: {
//   title:   string;
//   value:   number | string;
//   icon:    React.ReactNode;
//   sub?:    string;
//   accent?: string;
// }) {
//   return (
//     <Card className="relative overflow-hidden border border-border/60 shadow-sm">
//       <div
//         className="absolute inset-0 opacity-[0.04] pointer-events-none"
//         style={{ background: accent ?? "#6366f1" }}
//       />
//       <CardContent className="pt-5 pb-4 px-5">
//         <div className="flex items-start justify-between">
//           <div>
//             <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
//               {title}
//             </p>
//             {/* ✅ Fixed: text-foreground instead of accent color */}
//             <p className="text-3xl font-black tracking-tight text-foreground">
//               {typeof value === "number" ? value.toLocaleString() : value}
//             </p>
//             {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
//           </div>
//           <div
//             className="p-2 rounded-lg"
//             style={{ background: (accent ?? "#6366f1") + "15" }}
//           >
//             {icon}
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// // ─── Attendance Rate Ring ─────────────────────────────────────────────────────

// function AttendanceRing({ present, total }: { present: number; total: number }) {
//   const pct   = total > 0 ? Math.round((present / total) * 100) : 0;
//   const color = pct >= 80 ? "#16a34a" : pct >= 60 ? "#ca8a04" : "#dc2626";
//   const r     = 44;
//   const circ  = 2 * Math.PI * r;
//   const dash  = (pct / 100) * circ;

//   return (
//     <div className="flex flex-col items-center justify-center gap-1">
//       <svg width={110} height={110} viewBox="0 0 110 110">
//         <circle cx="55" cy="55" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
//         <circle
//           cx="55" cy="55" r={r} fill="none"
//           stroke={color} strokeWidth="10"
//           strokeDasharray={`${dash} ${circ}`}
//           strokeLinecap="round"
//           transform="rotate(-90 55 55)"
//           style={{ transition: "stroke-dasharray 0.6s ease" }}
//         />
//         <text x="55" y="52" textAnchor="middle" fontSize="20" fontWeight="800" fill={color}>{pct}%</text>
//         <text x="55" y="66" textAnchor="middle" fontSize="9" fill="#9ca3af">attendance</text>
//       </svg>
//       <p className="text-xs text-muted-foreground">{present} / {total} students</p>
//     </div>
//   );
// }

// // ─── Main ─────────────────────────────────────────────────────────────────────

// export default function AdminDashboard() {
//   const [data,         setData]         = useState<DashboardData | null>(null);
//   const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
//   const [isLoading,    setIsLoading]    = useState(true);
//   const [error,        setError]        = useState<string | null>(null);

//   useEffect(() => {
//     fetch("/api/dashboard")
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to fetch dashboard data");
//         return res.json();
//       })
//       .then((json) => { setData(json); setIsLoading(false); })
//       .catch((err) => { setError(err.message); setIsLoading(false); });
//   }, []);

//   // ── Loading ──
//   if (isLoading) return (
//     <div className="space-y-6 p-6">
//       <Skeleton className="h-10 w-64" />
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         {[1,2,3,4].map(i => <Skeleton key={i} className="h-28" />)}
//       </div>
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         {[1,2,3,4].map(i => <Skeleton key={i} className="h-28" />)}
//       </div>
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <Skeleton className="h-72 lg:col-span-2" />
//         <Skeleton className="h-72" />
//       </div>
//     </div>
//   );

//   // ── Error ──
//   if (error) return (
//     <div className="flex items-center justify-center h-64 gap-2 text-red-500">
//       <AlertCircle className="w-5 h-5" /> <p>{error}</p>
//     </div>
//   );

//   // ── No data ──
//   if (!data) return (
//     <div className="flex items-center justify-center h-64 text-muted-foreground">
//       No data available
//     </div>
//   );

//   const { stats, attendance, events } = data;

//   const genderData = [
//     { name: "Boys",  value: stats.studentGender.boys,  color: "#3b82f6" },
//     { name: "Girls", value: stats.studentGender.girls, color: "#ec4899" },
//   ];

//   const parsedEvents   = events.map(e => ({ ...e, date: new Date(e.date) }));
//   const filteredEvents = parsedEvents.filter(
//     e => selectedDate && e.date.toDateString() === selectedDate.toDateString()
//   );

//   const todayRate = attendance.todayTotal > 0
//     ? Math.round((attendance.todayPresent / attendance.todayTotal) * 100)
//     : 0;

//   return (
//     <div className="space-y-6 p-6" style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>

//       {/* ── Header ── */}
//       <div className="flex items-end justify-between">
//         <div>
//           <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
//             Admin Panel
//           </p>
//           <h1 className="text-2xl font-black tracking-tight text-foreground">Dashboard</h1>
//         </div>
//         <span className="text-xs text-muted-foreground">
//           {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
//         </span>
//       </div>

//       {/* ── User Stats ── */}
//       <div>
//         <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
//           Users
//         </p>
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//           <StatCard title="Teachers"    value={stats.teachers}    accent="#3b82f6" icon={<GraduationCap className="w-5 h-5 text-blue-500" />} />
//           <StatCard title="Students"    value={stats.students}    accent="#16a34a" icon={<Users className="w-5 h-5 text-green-600" />} />
//           <StatCard title="Parents"     value={stats.parents}     accent="#8b5cf6" icon={<UserCheck className="w-5 h-5 text-purple-500" />} />
//           <StatCard title="Accountants" value={stats.accountants} accent="#f59e0b" icon={<Wallet className="w-5 h-5 text-amber-500" />} />
//         </div>
//       </div>

//       {/* ── Today's Attendance ── */}
//       <div>
//         <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
//           Today's Attendance
//         </p>
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//           <StatCard
//             title="Present"
//             value={attendance.todayPresent}
//             accent="#16a34a"
//             icon={<CheckCircle2 className="w-5 h-5 text-green-600" />}
//             sub={`${todayRate}% attendance rate`}
//           />
//           <StatCard
//             title="Absent"
//             value={attendance.todayAbsent}
//             accent="#dc2626"
//             icon={<AlertCircle className="w-5 h-5 text-red-500" />}
//             sub="not checked in"
//           />
//           <StatCard
//             title="Late"
//             value={attendance.todayLate}
//             accent="#ca8a04"
//             icon={<Clock className="w-5 h-5 text-yellow-600" />}
//             sub="arrived after threshold"
//           />
//           <StatCard
//             title="Total Sessions"
//             value={attendance.recentSessions.length}
//             accent="#6366f1"
//             icon={<TrendingUp className="w-5 h-5 text-indigo-500" />}
//             sub="active today"
//           />
//         </div>
//       </div>

//       {/* ── Charts Row ── */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//         {/* Weekly Trend Bar Chart */}
//         <Card className="lg:col-span-2 border border-border/60 shadow-sm">
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-bold">Weekly Attendance Trend</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={240}>
//               <BarChart data={attendance.weeklyTrend} barCategoryGap="30%">
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                 <XAxis dataKey="day" tick={{ fontSize: 12 }} />
//                 <YAxis tick={{ fontSize: 12 }} />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="present" fill="#16a34a" radius={[4,4,0,0]} name="Present" />
//                 <Bar dataKey="late"    fill="#ca8a04" radius={[4,4,0,0]} name="Late" />
//                 <Bar dataKey="absent"  fill="#dc2626" radius={[4,4,0,0]} name="Absent" />
//               </BarChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         {/* Today's Ring + Gender Pie */}
//         <Card className="border border-border/60 shadow-sm">
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-bold">Today's Overview</CardTitle>
//           </CardHeader>
//           <CardContent className="flex flex-col items-center gap-4">
//             <AttendanceRing present={attendance.todayPresent} total={attendance.todayTotal} />
//             <div className="w-full h-px bg-border" />
//             <div className="w-full">
//               <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2 text-center">
//                 Gender Split
//               </p>
//               {stats.studentGender.boys === 0 && stats.studentGender.girls === 0 ? (
//                 <p className="text-sm text-muted-foreground text-center py-4">No student data</p>
//               ) : (
//                 <ResponsiveContainer width="100%" height={130}>
//                   <PieChart>
//                     <Pie
//                       data={genderData}
//                       dataKey="value"
//                       cx="50%" cy="50%"
//                       outerRadius={50}
//                       label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                       labelLine={false}
//                     >
//                       {genderData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
//                     </Pie>
//                     <Tooltip />
//                   </PieChart>
//                 </ResponsiveContainer>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* ── Recent Sessions + Calendar ── */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//         {/* Recent Sessions Table */}
//         <Card className="lg:col-span-2 border border-border/60 shadow-sm">
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-bold">Recent Sessions</CardTitle>
//           </CardHeader>
//           <CardContent>
//             {attendance.recentSessions.length === 0 ? (
//               <div className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground">
//                 <TrendingUp className="w-8 h-8 opacity-30" />
//                 <p className="text-sm font-medium">No sessions today</p>
//                 <p className="text-xs opacity-70">Sessions will appear here once created for today</p>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full text-sm">
//                   <thead>
//                     <tr className="border-b border-border/50">
//                       <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Class</th>
//                       <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Teacher</th>
//                       <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Time</th>
//                       <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Attendance</th>
//                       <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {attendance.recentSessions.map((s) => {
//                       const rate = s.total > 0 ? Math.round((s.present / s.total) * 100) : 0;
//                       return (
//                         <tr key={s.id} className="border-b border-border/30 hover:bg-muted/40 transition-colors">
//                           <td className="py-2.5 px-3 font-medium">{s.className}</td>
//                           <td className="py-2.5 px-3 text-muted-foreground">{s.teacher}</td>
//                           <td className="py-2.5 px-3 text-muted-foreground">{s.time}</td>
//                           <td className="py-2.5 px-3">
//                             <div className="flex items-center gap-2">
//                               <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden w-16">
//                                 <div
//                                   className="h-full rounded-full"
//                                   style={{
//                                     width:      `${rate}%`,
//                                     background: rate >= 80 ? "#16a34a" : rate >= 60 ? "#ca8a04" : "#dc2626",
//                                   }}
//                                 />
//                               </div>
//                               <span className="text-xs font-medium">{s.present}/{s.total}</span>
//                             </div>
//                           </td>
//                           <td className="py-2.5 px-3">
//                             <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
//                               s.status === "active"
//                                 ? "bg-green-100 text-green-700"
//                                 : "bg-muted text-muted-foreground"
//                             }`}>
//                               {s.status === "active" ? "● Live" : "Ended"}
//                             </span>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Events Calendar */}
//         <Card className="border border-border/60 shadow-sm">
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-bold">Events & Announcements</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <Calendar
//               mode="single"
//               selected={selectedDate}
//               onSelect={setSelectedDate}
//               className="rounded-lg border"
//             />
//             <div className="mt-3 space-y-2">
//               {filteredEvents.length > 0 ? (
//                 filteredEvents.map((e, i) => (
//                   <div key={i} className="p-2 bg-muted rounded-md">
//                     <p className="text-sm font-medium">📌 {e.title}</p>
//                     <p className="text-xs text-muted-foreground">{e.date.toLocaleDateString()}</p>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-sm text-muted-foreground text-center py-3">
//                   No events on this date
//                 </p>
//               )}
//             </div>
//           </CardContent>
//         </Card>

//       </div>
//     </div>
//   );
// }