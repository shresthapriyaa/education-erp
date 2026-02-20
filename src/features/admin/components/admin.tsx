// "use client";

// import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";

// import {
//   GraduationCap,
//   Users,
//   UserCheck,
//   Wallet,

// } from "lucide-react";

// export default function AdminDashboard() {
//   return (
//     <div className="space-y-6">
//       {/* HEADER */}
//       <div>
//         <h1 className="text-2xl font-semibold">Dashboard</h1>
//         <p className="text-sm text-muted-foreground">
//           System overview and user statistics
//         </p>
//       </div>

//       {/* STATS */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard
//           title="Teachers"
//           icon={<GraduationCap className="w-6 h-6 text-blue-600" />}
//         />
//         <StatCard
//           title="Students"
//           icon={<Users className="w-6 h-6 text-green-600" />}
//         />
//         <StatCard
//           title="Parents"
//           icon={<UserCheck className="w-6 h-6 text-purple-600" />}

          
//         />
//         <StatCard
//           title="Accountants"
//           icon={<Wallet className="w-6 h-6 text-orange-600" />}
//         />
//       </div>
//     </div>
//   );
// }

// function StatCard({
//   title,
//   icon,
// }: {
//   title: string;
//   icon: React.ReactNode;
// }) {
//   return (
//     <Card>
//       <CardHeader className="flex flex-row items-center justify-between">
//         <CardTitle className="text-sm">{title}</CardTitle>
//         {icon}
//       </CardHeader>
//       <CardContent>
//         <p className="text-2xl font-bold">—</p>
//       </CardContent>

//     </Card>
//   );
// }






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







// "use client";

// import { useEffect, useState } from "react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/core/components/ui/card";
// import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
// import { Calendar } from "@/core/components/ui/calendar";
// import { Badge } from "@/core/components/ui/badge";
// import {
//   GraduationCap,
//   Users,
//   UserCheck,
//   Wallet,
//   Calendar as CalendarIcon,
//   TrendingUp,
// } from "lucide-react";

// type Event = { date: string; title: string; description?: string };
// type DashboardData = {
//   stats: {
//     teachers: number;
//     students: number;
//     parents: number;
//     accountants: number;
//     studentGender: { boys: number; girls: number };
//   };
//   events: Event[];
//   attendance?: {
//     day: string;
//     present: number;
//     absent: number;
//   }[];
// };

// export default function AdminDashboard() {
//   const [data, setData] = useState<DashboardData | null>(null);
//   const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     fetch("/api/dashboard")
//       .then((res) => {
//         if (!res.ok) throw new Error('Failed to fetch dashboard data');
//         return res.json();
//       })
//       .then((json) => {
//         setData(json);
//         setIsLoading(false);
//       })
//       .catch((err) => {
//         console.error(err);
//         setError(err.message);
//         setIsLoading(false);
//       });
//   }, []);

//   if (isLoading) {
//     return (
//       <div className="space-y-6">
//         <div className="h-12 bg-muted animate-pulse rounded" />
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           {[1, 2, 3, 4].map((i) => (
//             <div key={i} className="h-32 bg-muted animate-pulse rounded" />
//           ))}
//         </div>
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <div className="h-96 bg-muted animate-pulse rounded" />
//           <div className="h-96 bg-muted animate-pulse rounded" />
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <p className="text-red-500">Error: {error}</p>
//       </div>
//     );
//   }

//   if (!data) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <p>No data available</p>
//       </div>
//     );
//   }

//   const studentGenderData = [
//     { name: "Boys", value: data.stats.studentGender.boys, color: "#3b82f6" },
//     { name: "Girls", value: data.stats.studentGender.girls, color: "#ec4899" },
//   ];

//   // Mock attendance data (replace with real data from API)
//   const attendanceData = data.attendance || [
//     { day: "Mon", present: 320, absent: 30 },
//     { day: "Tue", present: 335, absent: 15 },
//     { day: "Wed", present: 310, absent: 40 },
//     { day: "Thu", present: 340, absent: 10 },
//     { day: "Fri", present: 325, absent: 25 },
//   ];

//   const events = data.events.map((e) => ({ ...e, date: new Date(e.date) }));
  
//   // Get upcoming events (sorted by date)
//   const upcomingEvents = events
//     .filter((e) => e.date >= new Date())
//     .sort((a, b) => a.date.getTime() - b.date.getTime())
//     .slice(0, 5);

//   const filteredEvents = events.filter(
//     (e) => selectedDate && e.date.toDateString() === selectedDate.toDateString()
//   );

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-2xl font-semibold">Dashboard</h1>
//         <p className="text-sm text-muted-foreground">System overview and user statistics</p>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard 
//           title="Teachers" 
//           value={data.stats.teachers}
//           icon={<GraduationCap className="w-6 h-6 text-blue-600" />}
//         />
//         <StatCard 
//           title="Students" 
//           value={data.stats.students}
//           icon={<Users className="w-6 h-6 text-green-600" />}
//         />
//         <StatCard 
//           title="Parents" 
//           value={data.stats.parents}
//           icon={<UserCheck className="w-6 h-6 text-purple-600" />}
//         />
//         <StatCard 
//           title="Accountants" 
//           value={data.stats.accountants}
//           icon={<Wallet className="w-6 h-6 text-orange-600" />}
//         />
//       </div>

//       {/* Charts Row */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Student Gender Pie Chart */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Student Gender Distribution</CardTitle>
//           </CardHeader>
//           <CardContent>
//             {studentGenderData[0].value === 0 && studentGenderData[1].value === 0 ? (
//               <div className="h-[300px] flex items-center justify-center text-muted-foreground">
//                 <p>No student data available</p>
//               </div>
//             ) : (
//               <ResponsiveContainer width="100%" height={300}>
//                 <PieChart>
//                   <Pie
//                     data={studentGenderData}
//                     dataKey="value"
//                     nameKey="name"
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={100}
//                     label={({ name, percent }) => `${name}: ${(percent! * 100).toFixed(0)}%`}
//                   >
//                     {studentGenderData.map((entry, index) => (
//                       <Cell key={index} fill={entry.color} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             )}
//           </CardContent>
//         </Card>

//         {/* Attendance Bar Chart */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <TrendingUp className="w-5 h-5" />
//               Weekly Attendance
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={attendanceData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="day" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="present" fill="#22c55e" name="Present" />
//                 <Bar dataKey="absent" fill="#ef4444" name="Absent" />
//               </BarChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Calendar and Events Row */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Events Calendar */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <CalendarIcon className="w-5 h-5" />
//               Events Calendar
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <Calendar
//               mode="single"
//               selected={selectedDate}
//               onSelect={setSelectedDate}
//               className="rounded-lg border"
//             />

//             <div className="mt-4 space-y-2">
//               <p className="text-sm font-medium">
//                 Events on {selectedDate?.toLocaleDateString()}:
//               </p>
//               {filteredEvents.length > 0 ? (
//                 filteredEvents.map((e, i) => (
//                   <div key={i} className="p-2 bg-muted rounded-md">
//                     <p className="text-sm font-medium">📌 {e.title}</p>
//                     {e.description && (
//                       <p className="text-xs text-muted-foreground mt-1">
//                         {e.description}
//                       </p>
//                     )}
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-sm text-muted-foreground text-center py-4">
//                   No events on this date
//                 </p>
//               )}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Upcoming Events */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <CalendarIcon className="w-5 h-5" />
//               Upcoming Events
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-3">
//               {upcomingEvents.length > 0 ? (
//                 upcomingEvents.map((event, i) => (
//                   <div 
//                     key={i} 
//                     className="p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
//                   >
//                     <div className="flex items-start justify-between gap-2">
//                       <div className="flex-1 space-y-1">
//                         <p className="text-sm font-medium leading-none">
//                           {event.title}
//                         </p>
//                         {event.description && (
//                           <p className="text-xs text-muted-foreground">
//                             {event.description}
//                           </p>
//                         )}
//                         <p className="text-xs text-muted-foreground flex items-center gap-1">
//                           <CalendarIcon className="w-3 h-3" />
//                           {event.date.toLocaleDateString('en-US', { 
//                             weekday: 'short', 
//                             month: 'short', 
//                             day: 'numeric',
//                             year: 'numeric'
//                           })}
//                         </p>
//                       </div>
//                       <Badge variant="secondary">
//                         {Math.ceil((event.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
//                       </Badge>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-8">
//                   <CalendarIcon className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
//                   <p className="text-sm text-muted-foreground">
//                     No upcoming events
//                   </p>
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

// function StatCard({ 
//   title, 
//   value, 
//   icon 
// }: { 
//   title: string; 
//   value: number;
//   icon: React.ReactNode;
// }) {
//   return (
//     <Card>
//       <CardHeader className="flex flex-row items-center justify-between pb-2">
//         <CardTitle className="text-sm font-medium">{title}</CardTitle>
//         {icon}
//       </CardHeader>
//       <CardContent>
//         <p className="text-3xl font-bold">{value.toLocaleString()}</p>
//       </CardContent>
//     </Card>
//   );
// }