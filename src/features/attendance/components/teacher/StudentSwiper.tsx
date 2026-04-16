"use client";

import { CheckCircle2, XCircle, ChevronLeft, Save, MapPin } from "lucide-react";
import type { ClassItem, StudentRow } from "../../hooks/useTeacherAttendance";
import type { AttendanceStatus } from "../../types/attendance.types";
import { Button } from "@/core/components/ui/button";
import { Badge } from "@/core/components/ui/badge";

interface Props {
  cls:          ClassItem;
  students:     StudentRow[];
  loading:      boolean;
  error:        string | null;
  currentIndex: number;
  isComplete:   boolean;
  saving:       boolean;
  saved:        boolean;
  saveError:    string | null;
  geoDistance:  number | null;
  editDate?:    Date | null;
  onMark:       (status: AttendanceStatus) => void;
  onPrev:       () => void;
  onSave:       () => void;
  onToggleStatus: (studentId: string, newStatus: AttendanceStatus) => void;
}

export default function StudentSwiper({
  cls, students, loading, error,
  currentIndex, isComplete,
  saving, saved, saveError, geoDistance, editDate,
  onMark, onPrev, onSave, onToggleStatus,
}: Props) {

  const total   = students.length;
  const marked  = students.filter(s => s.status !== null).length;
  const present = students.filter(s => s.status === "PRESENT").length;
  const absent  = students.filter(s => s.status === "ABSENT").length;
  const current = students[currentIndex];

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800">
        ⚠ {error}
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-base font-semibold">No students in this class</p>
      </div>
    );
  }

  return (
    <div>
      {/* Info bar */}
      <div className="bg-muted/50 border rounded-lg p-3 mb-5 flex justify-between items-center flex-wrap gap-2">
        <div className="flex gap-4 text-sm text-muted-foreground flex-wrap">
          <span><span className="font-semibold text-foreground">Class:</span> {cls.name}</span>
          <span><span className="font-semibold text-foreground">Date:</span> {editDate ? editDate.toLocaleDateString("en-GB") : new Date().toLocaleDateString("en-GB")}</span>
          {geoDistance !== null && (
            <span className="flex items-center gap-1 text-foreground">
              <MapPin className="w-3 h-3" /> {geoDistance}m from school
            </span>
          )}
        </div>
        <Badge variant={editDate ? "default" : "secondary"}>
          {editDate ? "Edit Mode" : "Location Verified"}
        </Badge>
      </div>

      {/* Progress bar */}
      <div className="mb-5">
        <div className="flex justify-between mb-2 text-sm">
          <span className="font-semibold text-foreground">
            Progress: {marked} / {total} students
          </span>
          <span className="text-muted-foreground">
            {present} present · {absent} absent
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-foreground rounded-full transition-all duration-300"
            style={{ width: `${total > 0 ? (marked / total) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Student card or completion screen */}
      {isComplete ? (
        <CompletionScreen
          students={students}
          present={present}
          absent={absent}
          saving={saving}
          saved={saved}
          saveError={saveError}
          onSave={onSave}
          onPrev={onPrev}
          currentIndex={currentIndex}
          onToggleStatus={onToggleStatus}
        />
      ) : current ? (
        <div>
          {/* Navigation hint */}
          {currentIndex > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onPrev}
              className="mb-3 px-0 h-auto text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Back to previous student
            </Button>
          )}

          {/* Student card */}
          <div className="bg-card border rounded-xl p-8 text-center max-w-md mx-auto shadow-sm">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-foreground">
              {current.username.charAt(0).toUpperCase()}
            </div>

            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Student {currentIndex + 1} of {total}
            </p>
            <h2 className="text-2xl font-bold text-foreground mb-1">
              {current.username}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              {current.email}
            </p>

            {/* Current status indicator */}
            {current.status && (
              <div className="mb-6">
                <p className="text-xs text-muted-foreground mb-2">Current Status:</p>
                <Badge variant="outline">
                  {current.status}
                </Badge>
              </div>
            )}

            {/* Present / Absent buttons */}
            <div className="flex gap-3">
              <Button
                onClick={() => onMark("PRESENT")}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" /> Present
              </Button>
              <Button
                onClick={() => onMark("ABSENT")}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                <XCircle className="w-5 h-5 mr-2" /> Absent
              </Button>
            </div>
          </div>

          {/* Mini roster below */}
          {students.filter(s => s.status !== null).length > 0 && (
            <div className="mt-6 border rounded-lg overflow-hidden">
              <div className="bg-muted px-4 py-2 text-xs font-semibold uppercase text-muted-foreground">
                Marked so far
              </div>
              {students.filter(s => s.status !== null).map((s, i) => (
                <div key={s.studentId} className="flex justify-between items-center px-4 py-2 border-t">
                  <span className="text-sm text-foreground">{s.username}</span>
                  <Badge variant="outline" className="text-xs">
                    {s.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function CompletionScreen({ students, present, absent, saving, saved, saveError, onSave, onPrev, currentIndex, onToggleStatus }: {
  students: StudentRow[];
  present: number; absent: number;
  saving: boolean; saved: boolean; saveError: string | null;
  onSave: () => void; onPrev: () => void; currentIndex: number;
  onToggleStatus: (studentId: string, newStatus: AttendanceStatus) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-card border rounded-lg p-6 text-center max-w-md mx-auto">
        <div className="text-4xl mb-3">✓</div>
        <h2 className="text-xl font-bold text-foreground mb-2">All Students Marked</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Review and edit attendance below, then save.
        </p>
        
        <div className="flex gap-4 justify-center mb-6">
          <div className="bg-muted rounded-lg px-6 py-3 min-w-[100px]">
            <p className="text-2xl font-bold text-foreground">{present}</p>
            <p className="text-xs text-muted-foreground uppercase font-semibold mt-1">Present</p>
          </div>
          <div className="bg-muted rounded-lg px-6 py-3 min-w-[100px]">
            <p className="text-2xl font-bold text-foreground">{absent}</p>
            <p className="text-xs text-muted-foreground uppercase font-semibold mt-1">Absent</p>
          </div>
        </div>

        {saveError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-sm text-red-800">
            ⚠️ {saveError}
          </div>
        )}

        {saved ? (
          <div className="bg-muted border rounded-lg p-3 text-sm text-foreground font-semibold">
            ✓ Attendance saved successfully
          </div>
        ) : (
          <div className="flex gap-3">
            <Button variant="outline" onClick={onPrev} className="flex-1">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Edit Last
            </Button>
            <Button onClick={onSave} disabled={saving} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        )}
      </div>

      {/* Student list with toggles */}
      <div className="border rounded-lg overflow-hidden bg-card">
        <div className="bg-muted px-4 py-3 border-b">
          <h3 className="text-sm font-semibold text-foreground">
            Attendance List ({students.length})
          </h3>
        </div>
        <div className="divide-y">
          {students.map((s) => (
            <div key={s.studentId} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
              <div className="flex-1">
                <p className="font-semibold text-sm text-foreground">{s.username}</p>
                <p className="text-xs text-muted-foreground">{s.email}</p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={s.status === "PRESENT" ? "default" : "ghost"}
                  onClick={() => onToggleStatus(s.studentId, "PRESENT")}
                  className="min-w-[90px]"
                >
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Present
                </Button>
                <Button
                  size="sm"
                  variant={s.status === "ABSENT" ? "default" : "ghost"}
                  onClick={() => onToggleStatus(s.studentId, "ABSENT")}
                  className="min-w-[90px]"
                >
                  <XCircle className="w-3 h-3 mr-1" />
                  Absent
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
