"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { ScrollArea } from "@/core/components/ui/scroll-area";
import { Badge } from "@/core/components/ui/badge";
import { Calendar } from "@/core/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/core/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/core/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/components/ui/select";
import { CheckCircle2, XCircle, Clock, Calendar as CalendarIcon, Search, Save, Users, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface Student {
  id: string;
  username: string;
  email: string;
  img?: string | null;
}

interface Class {
  id: string;
  name: string;
  _count?: { students: number };
}

interface AttendanceRecord {
  studentId: string;
  status: "PRESENT" | "ABSENT" | "LATE";
}

export default function ImprovedTeacherAttendance() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Map<string, "PRESENT" | "ABSENT" | "LATE">>(new Map());
  const [date, setDate] = useState<Date>(new Date());
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [existingAttendance, setExistingAttendance] = useState(false);

  // Load classes
  useEffect(() => {
    loadClasses();
  }, []);

  // Load students when class is selected
  useEffect(() => {
    if (selectedClass) {
      loadStudents();
      loadExistingAttendance();
    }
  }, [selectedClass, date]);

  async function loadClasses() {
    try {
      const res = await fetch("/api/classes");
      const data = await res.json();
      setClasses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load classes:", error);
    }
  }

  async function loadStudents() {
    setLoading(true);
    try {
      const res = await fetch(`/api/students?classId=${selectedClass}`);
      const data = await res.json();
      const studentsArray = Array.isArray(data) ? data : (data.students || []);
      setStudents(studentsArray);
    } catch (error) {
      console.error("Failed to load students:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadExistingAttendance() {
    try {
      const dateStr = format(date, "yyyy-MM-dd");
      const res = await fetch(`/api/attendance?classId=${selectedClass}&date=${dateStr}`);
      const data = await res.json();
      
      if (Array.isArray(data) && data.length > 0) {
        const attendanceMap = new Map<string, "PRESENT" | "ABSENT" | "LATE">();
        data.forEach((record: any) => {
          attendanceMap.set(record.studentId, record.status);
        });
        setAttendance(attendanceMap);
        setExistingAttendance(true);
      } else {
        setAttendance(new Map());
        setExistingAttendance(false);
      }
    } catch (error) {
      console.error("Failed to load existing attendance:", error);
      setAttendance(new Map());
      setExistingAttendance(false);
    }
  }

  function markStudent(studentId: string, status: "PRESENT" | "ABSENT" | "LATE") {
    setAttendance(prev => {
      const newMap = new Map(prev);
      newMap.set(studentId, status);
      return newMap;
    });
  }

  function markAllPresent() {
    const newMap = new Map<string, "PRESENT" | "ABSENT" | "LATE">();
    students.forEach(student => {
      newMap.set(student.id, "PRESENT");
    });
    setAttendance(newMap);
  }

  function markAllAbsent() {
    const newMap = new Map<string, "PRESENT" | "ABSENT" | "LATE">();
    students.forEach(student => {
      newMap.set(student.id, "ABSENT");
    });
    setAttendance(newMap);
  }

  async function saveAttendance() {
    if (!selectedClass || attendance.size === 0) return;

    setSaving(true);
    try {
      const records = Array.from(attendance.entries()).map(([studentId, status]) => ({
        studentId,
        status,
        classId: selectedClass,
        date: format(date, "yyyy-MM-dd"),
      }));

      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ records }),
      });

      if (res.ok) {
        alert("Attendance saved successfully!");
        setExistingAttendance(true);
      } else {
        alert("Failed to save attendance");
      }
    } catch (error) {
      console.error("Failed to save attendance:", error);
      alert("Failed to save attendance");
    } finally {
      setSaving(false);
    }
  }

  const filteredStudents = students.filter(s =>
    s.username.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    present: Array.from(attendance.values()).filter(s => s === "PRESENT").length,
    absent: Array.from(attendance.values()).filter(s => s === "ABSENT").length,
    late: Array.from(attendance.values()).filter(s => s === "LATE").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-black">Attendance Management</h1>
        <p className="text-muted-foreground mt-1">Mark and manage student attendance</p>
      </div>

      {/* Class & Date Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Select Class & Date</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Class</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map(cls => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name} {cls._count?.students ? `(${cls._count.students} students)` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(date, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {existingAttendance && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <p className="text-sm text-blue-800">
                Attendance already exists for this date. You can edit and save changes.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedClass && students.length > 0 && (
        <>
          {/* Stats & Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">{students.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Present</p>
                    <p className="text-2xl font-bold text-green-600">{stats.present}</p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Absent</p>
                    <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Late</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Search */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                <div className="flex gap-2 w-full md:w-auto">
                  <Button onClick={markAllPresent} variant="outline" size="sm" className="flex-1 md:flex-none">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                    Mark All Present
                  </Button>
                  <Button onClick={markAllAbsent} variant="outline" size="sm" className="flex-1 md:flex-none">
                    <XCircle className="mr-2 h-4 w-4 text-red-600" />
                    Mark All Absent
                  </Button>
                </div>

                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search students..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Student Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10">
                          Loading students...
                        </TableCell>
                      </TableRow>
                    ) : filteredStudents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                          No students found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStudents.map((student, index) => {
                        const status = attendance.get(student.id);
                        return (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                {student.img ? (
                                  <img src={student.img} alt={student.username} className="h-8 w-8 rounded-full object-cover" />
                                ) : (
                                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-xs font-semibold">{student.username.charAt(0).toUpperCase()}</span>
                                  </div>
                                )}
                                <span className="font-medium">{student.username}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">{student.email}</TableCell>
                            <TableCell>
                              {status === "PRESENT" && <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Present</Badge>}
                              {status === "ABSENT" && <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Absent</Badge>}
                              {status === "LATE" && <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Late</Badge>}
                              {!status && <Badge variant="outline">Not Marked</Badge>}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-1 justify-end">
                                <Button
                                  size="sm"
                                  variant={status === "PRESENT" ? "default" : "outline"}
                                  className={status === "PRESENT" ? "bg-green-600 hover:bg-green-700" : ""}
                                  onClick={() => markStudent(student.id, "PRESENT")}
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant={status === "LATE" ? "default" : "outline"}
                                  className={status === "LATE" ? "bg-yellow-600 hover:bg-yellow-700" : ""}
                                  onClick={() => markStudent(student.id, "LATE")}
                                >
                                  <Clock className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant={status === "ABSENT" ? "default" : "outline"}
                                  className={status === "ABSENT" ? "bg-red-600 hover:bg-red-700" : ""}
                                  onClick={() => markStudent(student.id, "ABSENT")}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={saveAttendance}
              disabled={saving || attendance.size === 0}
              className="bg-black hover:bg-gray-800"
              size="lg"
            >
              {saving ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {existingAttendance ? "Update Attendance" : "Save Attendance"}
                </>
              )}
            </Button>
          </div>
        </>
      )}

      {selectedClass && students.length === 0 && !loading && (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Students Found</h3>
            <p className="text-muted-foreground">This class doesn't have any students yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
