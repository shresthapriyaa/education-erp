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

interface StudentAttendanceProps {
  studentEmail?: string; // Optional: if provided, fetch for this student; otherwise use session
}

export default function StudentAttendance({ studentEmail }: StudentAttendanceProps = {}) {
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

  const emailToUse = studentEmail || session?.user?.email;

  useEffect(() => {
    if (emailToUse) {
      loadAttendance();
    }
  }, [emailToUse, studentEmail]); // Re-fetch when studentEmail changes

  async function loadAttendance() {
    if (!emailToUse) {
      console.log("No email to fetch attendance for");
      return;
    }
    
    setLoading(true);
    try {
      console.log("Fetching attendance for email:", emailToUse);
      
      // Fetch real attendance data for the specific student
      const response = await fetch(`/api/attendance?studentEmail=${encodeURIComponent(emailToUse)}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch attendance");
      }
      
      const data = await response.json();
      console.log("Attendance data received:", data);
      
      const fetchedRecords = data.records || [];
      
      // Transform API data to match our interface
      const transformedRecords: AttendanceRecord[] = fetchedRecords.map((r: any) => ({
        id: r.id,
        date: new Date(r.date).toISOString().split('T')[0],
        status: r.status,
      }));
      
      setRecords(transformedRecords);
      
      const present = transformedRecords.filter(r => r.status === "PRESENT").length;
      const absent = transformedRecords.filter(r => r.status === "ABSENT").length;
      const late = transformedRecords.filter(r => r.status === "LATE").length;
      const total = transformedRecords.length;
      
      setStats({
        present,
        absent,
        late,
        rate: total > 0 ? Math.round((present / total) * 100) : 0,
      });
    } catch (error) {
      console.error("Failed to load attendance:", error);
      // Set empty data on error
      setRecords([]);
      setStats({ present: 0, absent: 0, late: 0, rate: 0 });
    } finally {
      setLoading(false);
    }
  }

  // Filter records based on selected date
  const filteredRecords = selectedDate
    ? records.filter(r => {
        const recordDate = new Date(r.date);
        const selected = new Date(selectedDate);
        return (
          recordDate.getFullYear() === selected.getFullYear() &&
          recordDate.getMonth() === selected.getMonth() &&
          recordDate.getDate() === selected.getDate()
        );
      })
    : records;

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar - Made larger */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-base">Calendar</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Click a date to filter attendance records
            </p>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-lg border scale-110"
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

        {/* Attendance Records - Filtered by selected date */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">
                  {selectedDate 
                    ? `Attendance for ${new Date(selectedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                    : "All Attendance Records"
                  }
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  {filteredRecords.length} {filteredRecords.length === 1 ? 'record' : 'records'} found
                </p>
              </div>
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate(undefined)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Show All
                </button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {filteredRecords.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground text-sm">
                    {selectedDate 
                      ? "No attendance record for this date"
                      : "No attendance records found"
                    }
                  </p>
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-muted/50 hover:bg-muted transition-colors"
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
