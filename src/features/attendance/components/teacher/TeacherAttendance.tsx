"use client";

import { useTeacherAttendance } from "@/features/attendance/hooks/useTeacherAttendance";
import ClassCard      from "./ClassCard";
import StudentSwiper  from "./StudentSwiper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/button";
import { Alert, AlertDescription } from "@/core/components/ui/alert";
import { Loader2, Edit, Calendar as CalendarIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";

type AttendanceRecord = {
  date: string;
  present: number;
  absent: number;
  total: number;
};

export default function TeacherAttendance() {
  const [editMode, setEditMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  
  const {
    classes, classesLoading, classesError,
    activeClass, resetClass,
    students, studentsLoading, studentsError,
    currentIndex, isComplete,
    geoState, geoError, geoDistance,
    saving, saved, saveError,
    selectClass, markStudent, toggleStudentStatus, prevStudent, saveAttendance, continueAnyway,
  } = useTeacherAttendance(selectedDate || undefined);

  // Load attendance history when a class is selected in edit mode
  useEffect(() => {
    if (editMode && activeClass && !selectedDate) {
      loadAttendanceHistory(activeClass.id);
    }
  }, [editMode, activeClass, selectedDate]);

  async function loadAttendanceHistory(classId: string) {
    setHistoryLoading(true);
    try {
      const res = await fetch(`/api/attendance?classId=${classId}&pageSize=50`);
      if (res.ok) {
        const data = await res.json();
        const records = data.records || [];
        
        // Group by date
        const dateMap = new Map<string, { present: number; absent: number; total: number }>();
        records.forEach((r: any) => {
          const dateStr = new Date(r.date).toISOString().split("T")[0];
          if (!dateMap.has(dateStr)) {
            dateMap.set(dateStr, { present: 0, absent: 0, total: 0 });
          }
          const stats = dateMap.get(dateStr)!;
          stats.total++;
          if (r.status === "PRESENT") stats.present++;
          if (r.status === "ABSENT") stats.absent++;
        });

        const history = Array.from(dateMap.entries())
          .map(([date, stats]) => ({ date, ...stats }))
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        setAttendanceHistory(history);
      }
    } catch (e) {
      console.error("Failed to load attendance history:", e);
    } finally {
      setHistoryLoading(false);
    }
  }

  // Helper to retry location for the same class
  const retryLocation = () => {
    if (activeClass) selectClass(activeClass);
  };

  const toggleEditMode = () => {
    const newEditMode = !editMode;
    setEditMode(newEditMode);
    setSelectedDate(null);
    setAttendanceHistory([]);
    if (newEditMode && activeClass) {
      // Stay on class but show history
      loadAttendanceHistory(activeClass.id);
    } else {
      // Exit edit mode
      resetClass();
    }
  };

  const handleEditDate = (date: string) => {
    setSelectedDate(new Date(date));
  };

  const handleBackFromEdit = () => {
    setSelectedDate(null);
    if (activeClass) {
      loadAttendanceHistory(activeClass.id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Geist','DM Sans','Segoe UI',sans-serif" }}>
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* Dark Professional Header */}
        {!activeClass ? (
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 text-white shadow-lg mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <CalendarIcon className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Attendance</h1>
                <p className="text-gray-300 text-sm mt-0.5">
                  Select a class to mark attendance
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 text-white shadow-lg mb-8">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <CalendarIcon className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-1 h-4 bg-white/60 rounded-full"></div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                      Teacher · Attendance
                    </p>
                  </div>
                  <h1 className="text-2xl font-bold">{activeClass.name}</h1>
                  <p className="text-gray-300 text-sm mt-1">
                    {editMode && selectedDate 
                      ? `Editing attendance for ${format(selectedDate, "MMMM d, yyyy")}`
                      : editMode 
                      ? "Select a date to edit attendance"
                      : "Mark attendance for your students"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {selectedDate ? (
                  <Button 
                    onClick={handleBackFromEdit}
                    variant="secondary"
                    size="sm"
                    className="bg-white/10 hover:bg-white/20 text-white border-0"
                  >
                    ← Back to History
                  </Button>
                ) : (
                  <Button
                    onClick={toggleEditMode}
                    variant="secondary"
                    size="sm"
                    className={editMode ? "bg-white text-gray-900 hover:bg-gray-100" : "bg-white/10 hover:bg-white/20 text-white border-0"}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    {editMode ? "Mark New" : "Edit Past"}
                  </Button>
                )}
                {!selectedDate && (
                  <Button 
                    onClick={resetClass}
                    variant="secondary"
                    size="sm"
                    className="bg-white/10 hover:bg-white/20 text-white border-0"
                  >
                    ← Back to Classes
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {classesError && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription className="flex items-center gap-2">
              <span>⚠️</span>
              {classesError}
            </AlertDescription>
          </Alert>
        )}

        {/* Class list */}
        {!activeClass && (
          <div>
            {classesLoading ? (
              <div className="flex flex-col gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-white border-2 border-gray-200 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : classes.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">📚</span>
                  </div>
                  <CardTitle className="mb-2">No classes assigned yet</CardTitle>
                  <CardDescription>Contact your admin to get classes assigned</CardDescription>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-gray-600">
                    {classes.length} {classes.length === 1 ? 'Class' : 'Classes'} Available
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {classes.map(cls => (
                    <ClassCard key={cls.id} cls={cls} onSelect={selectClass} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Attendance History List - Show when in edit mode and no date selected */}
        {editMode && activeClass && !selectedDate && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Attendance History</CardTitle>
              <CardDescription>Select a date to edit attendance records</CardDescription>
            </CardHeader>
            <CardContent>
              {historyLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              ) : attendanceHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No attendance records found</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {attendanceHistory.map((record) => (
                    <div
                      key={record.date}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                          <CalendarIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {format(new Date(record.date), "EEEE, MMMM d, yyyy")}
                          </p>
                          <div className="flex gap-4 mt-1 text-xs">
                            <span className="text-green-600 font-medium">
                              ✓ {record.present} Present
                            </span>
                            <span className="text-red-600 font-medium">
                              ✗ {record.absent} Absent
                            </span>
                            <span className="text-gray-500">
                              Total: {record.total}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleEditDate(record.date)}
                        size="sm"
                        variant="outline"
                        className="gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Geofence states - Only for new attendance, not edit mode */}
        {!editMode && activeClass && geoState === "requesting" && (
          <Card className="border-indigo-200 shadow-sm max-w-2xl mx-auto">
            <CardHeader className="bg-indigo-50 border-b border-indigo-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                  <span className="text-lg">📍</span>
                </div>
                <div>
                  <CardTitle className="text-indigo-600 text-base">Requesting Location Access</CardTitle>
                  <CardDescription className="text-indigo-700 text-xs">Please allow location permission</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 pb-6 text-center">
              <p className="text-xs text-gray-600 mb-4 max-w-md mx-auto">
                Please click 'Allow' when your browser asks for location permission.
              </p>
              <Loader2 className="w-7 h-7 animate-spin mx-auto text-indigo-600" />
            </CardContent>
          </Card>
        )}

        {!editMode && activeClass && geoState === "verifying" && (
          <Card className="border-cyan-200 shadow-sm max-w-2xl mx-auto">
            <CardHeader className="bg-cyan-50 border-b border-cyan-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center shrink-0">
                  <span className="text-lg">🔍</span>
                </div>
                <div>
                  <CardTitle className="text-cyan-600 text-base">Verifying Location</CardTitle>
                  <CardDescription className="text-cyan-700 text-xs">Checking your position</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 pb-6 text-center">
              <p className="text-xs text-gray-600 mb-4">
                Checking if you are within the school zone...
              </p>
              <Loader2 className="w-7 h-7 animate-spin mx-auto text-cyan-600" />
            </CardContent>
          </Card>
        )}

        {!editMode && activeClass && geoState === "failed" && (
          <Card className="border-red-200 shadow-md max-w-xl mx-auto">
            <CardHeader className="bg-red-50 border-b border-red-100 pb-3 pt-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <span className="text-base">🚫</span>
                </div>
                <div>
                  <CardTitle className="text-red-600 text-sm font-semibold">Location Verification Failed</CardTitle>
                  <CardDescription className="text-red-700 text-[11px] mt-0.5">You are outside the allowed zone</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 pb-4 space-y-2.5">
              {/* Error Message */}
              <div className="bg-red-50 border border-red-200 rounded-md p-2.5">
                <p className="text-[11px] text-red-800 leading-relaxed">{geoError}</p>
              </div>

              {/* Distance Display */}
              {geoDistance !== null && (
                <div className="flex items-center justify-between px-2.5 py-1.5 bg-gray-50 rounded-md border border-gray-200">
                  <span className="text-[11px] font-medium text-gray-600">Distance from school:</span>
                  <span className="text-sm font-bold text-gray-900">{geoDistance}m</span>
                </div>
              )}

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-md p-2.5">
                <div className="flex gap-2 text-blue-900">
                  <span className="text-xs shrink-0">💡</span>
                  <div className="space-y-0.5 text-[11px]">
                    <p className="font-semibold">What to do next?</p>
                    <p>• Move closer to the school building</p>
                    <p>• Make sure GPS is enabled</p>
                    <p>• Try again once you're in position</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-1">
                <Button 
                  variant="outline" 
                  onClick={resetClass}
                  size="sm"
                  className="flex-1 h-8 text-xs"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={retryLocation}
                  size="sm"
                  className="flex-1 h-8 text-xs bg-black hover:bg-gray-800"
                >
                  🔄 Try Again
                </Button>
              </div>

              {/* Warning Text */}
              <p className="text-[10px] text-center text-gray-500 pt-0.5">
                📍 You must be within the school zone to mark attendance
              </p>
            </CardContent>
          </Card>
        )}

        {/* Attendance taking - Skip geofence in edit mode */}
        {activeClass && selectedDate && (editMode || geoState === "success") && (
          <StudentSwiper
            cls={activeClass}
            students={students}
            loading={studentsLoading}
            error={studentsError}
            currentIndex={currentIndex}
            isComplete={isComplete}
            saving={saving}
            saved={saved}
            saveError={saveError}
            geoDistance={editMode ? null : geoDistance}
            editDate={editMode ? selectedDate : null}
            onMark={markStudent}
            onPrev={prevStudent}
            onSave={saveAttendance}
            onToggleStatus={toggleStudentStatus}
          />
        )}

        {/* Normal attendance taking - not in edit mode */}
        {activeClass && !editMode && geoState === "success" && (
          <StudentSwiper
            cls={activeClass}
            students={students}
            loading={studentsLoading}
            error={studentsError}
            currentIndex={currentIndex}
            isComplete={isComplete}
            saving={saving}
            saved={saved}
            saveError={saveError}
            geoDistance={geoDistance}
            editDate={null}
            onMark={markStudent}
            onPrev={prevStudent}
            onSave={saveAttendance}
            onToggleStatus={toggleStudentStatus}
          />
        )}
      </div>
    </div>
  );
}
