"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Calendar } from "@/core/components/ui/calendar";
import { Badge } from "@/core/components/ui/badge";
import { CheckCircle2, XCircle, Clock, TrendingUp } from "lucide-react";

interface AttendanceRecord {
  id: string;
  date: string;
  status: "PRESENT" | "ABSENT" | "LATE";
}

export default function StudentAttendance() {
  const { data: session } = useSession();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    rate: 0,
  });

  useEffect(() => {
    loadAttendance();
  }, []);

  async function loadAttendance() {
    setLoading(true);
    try {
      // Mock data - replace with actual API call
      const mockRecords: AttendanceRecord[] = [
        { id: "1", date: "2026-04-15", status: "PRESENT" },
        { id: "2", date: "2026-04-14", status: "PRESENT" },
        { id: "3", date: "2026-04-13", status: "LATE" },
        { id: "4", date: "2026-04-12", status: "PRESENT" },
        { id: "5", date: "2026-04-11", status: "ABSENT" },
      ];
      
      setRecords(mockRecords);
      
      const present = mockRecords.filter(r => r.status === "PRESENT").length;
      const absent = mockRecords.filter(r => r.status === "ABSENT").length;
      const late = mockRecords.filter(r => r.status === "LATE").length;
      const total = mockRecords.length;
      
      setStats({
        present,
        absent,
        late,
        rate: total > 0 ? Math.round((present / total) * 100) : 0,
      });
    } catch (error) {
      console.error("Failed to load attendance:", error);
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PRESENT": return "bg-green-100 text-green-700";
      case "ABSENT": return "bg-red-100 text-red-700";
      case "LATE": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PRESENT": return <CheckCircle2 className="h-4 w-4" />;
      case "ABSENT": return <XCircle className="h-4 w-4" />;
      case "LATE": return <Clock className="h-4 w-4" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-12 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-96 bg-muted animate-pulse rounded" />
          <div className="lg:col-span-2 h-96 bg-muted animate-pulse rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-black">My Attendance</h1>
        <p className="text-muted-foreground mt-1">View your attendance records and statistics.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Attendance Rate</p>
                <p className="text-3xl font-bold text-black mt-2">{stats.rate}%</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Present</p>
                <p className="text-3xl font-bold text-black mt-2">{stats.present}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Absent</p>
                <p className="text-3xl font-bold text-black mt-2">{stats.absent}</p>
              </div>
              <div className="bg-red-50 p-3 rounded-full">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Late</p>
                <p className="text-3xl font-bold text-black mt-2">{stats.late}</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar & Records */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-base">Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-lg border"
              modifiers={{
                present: records
                  .filter(r => r.status === "PRESENT")
                  .map(r => new Date(r.date)),
                absent: records
                  .filter(r => r.status === "ABSENT")
                  .map(r => new Date(r.date)),
                late: records
                  .filter(r => r.status === "LATE")
                  .map(r => new Date(r.date)),
              }}
              modifiersStyles={{
                present: { backgroundColor: '#dcfce7', color: '#166534', fontWeight: 'bold' },
                absent: { backgroundColor: '#fee2e2', color: '#991b1b', fontWeight: 'bold' },
                late: { backgroundColor: '#fef3c7', color: '#92400e', fontWeight: 'bold' },
              }}
            />
          </CardContent>
        </Card>

        {/* Attendance Records */}
        <Card className="lg:col-span-2 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-base">Recent Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {records.length === 0 ? (
                <p className="text-center py-10 text-muted-foreground">No attendance records found</p>
              ) : (
                records.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${getStatusColor(record.status)}`}>
                        {getStatusIcon(record.status)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-black">
                          {new Date(record.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {record.status === "PRESENT" && "You were present"}
                          {record.status === "ABSENT" && "You were absent"}
                          {record.status === "LATE" && "You arrived late"}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(record.status)}>
                      {record.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
