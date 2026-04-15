"use client";

import { useTeacherAttendance } from "@/features/attendance/hooks/useTeacherAttendance";
import ClassCard      from "./ClassCard";
import StudentSwiper  from "./StudentSwiper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/button";
import { Alert, AlertDescription } from "@/core/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function TeacherAttendance() {
  const {
    classes, classesLoading, classesError,
    activeClass, resetClass,
    students, studentsLoading, studentsError,
    currentIndex, isComplete,
    geoState, geoError, geoDistance,
    saving, saved, saveError,
    selectClass, markStudent, prevStudent, saveAttendance, continueAnyway,
  } = useTeacherAttendance();

  // Helper to retry location for the same class
  const retryLocation = () => {
    if (activeClass) selectClass(activeClass);
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Geist','DM Sans','Segoe UI',sans-serif" }}>
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-5 bg-black rounded-full"></div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Teacher · Attendance
              </p>
            </div>
            <h1 className="text-3xl font-bold text-black">
              {activeClass ? `${activeClass.name}` : "My Classes"}
            </h1>
            {activeClass && (
              <p className="text-sm text-gray-600 mt-1">Mark attendance for your students</p>
            )}
          </div>
          {activeClass && (
            <Button 
              onClick={resetClass}
              variant="outline"
              size="sm"
            >
              ← Back
            </Button>
          )}
        </div>

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

        {/* Geofence states */}
        {activeClass && geoState === "requesting" && (
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

        {activeClass && geoState === "verifying" && (
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

        {activeClass && geoState === "failed" && (
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

        {/* Attendance taking */}
        {activeClass && geoState === "success" && (
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
            onMark={markStudent}
            onPrev={prevStudent}
            onSave={saveAttendance}
          />
        )}
      </div>
    </div>
  );
}
