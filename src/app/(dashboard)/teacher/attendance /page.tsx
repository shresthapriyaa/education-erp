"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { detectSchoolZone, fmtDist, type Coords } from "@/core/lib/haversine";
import { Button } from "@/core/components/ui/button";
import { Badge }  from "@/core/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import {
  Loader2, AlertTriangle, ShieldCheck,
  XCircle, CheckCircle, RefreshCw,
} from "lucide-react";

interface Zone {
  id: string; name: string; color?: string;
  latitude: number; longitude: number; radiusMeters: number;
}
interface School {
  id: string; name: string;
  latitude: number; longitude: number; radiusMeters: number;
  zones: Zone[];
}
interface SchoolSession {
  id: string; date: string; startTime: string; isOpen: boolean;
  class:  { id: string; name: string };
  school: School;
}
interface StudentRow {
  id: string; username: string; email: string;
  status: "PRESENT" | "LATE" | "ABSENT" | "EXCUSED" | null;
}
type AttendanceStatus = "PRESENT" | "LATE" | "ABSENT" | "EXCUSED";

const STATUS_CONFIG: Record<AttendanceStatus, { label: string; color: string }> = {
  PRESENT: { label: "Present", color: "bg-emerald-500 hover:bg-emerald-600 text-white" },
  LATE:    { label: "Late",    color: "bg-amber-500  hover:bg-amber-600  text-white"   },
  ABSENT:  { label: "Absent",  color: "bg-red-500    hover:bg-red-600    text-white"   },
  EXCUSED: { label: "Excused", color: "bg-blue-500   hover:bg-blue-600   text-white"   },
};

function useGPS() {
  const [coords,   setCoords]   = useState<Coords | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [error,    setError]    = useState<string | null>(null);
  const [loading,  setLoading]  = useState(false);

  const request = useCallback(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setError("Geolocation not supported by this browser.");
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude:  position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setAccuracy(position.coords.accuracy);
        setLoading(false);
      },
      (error) => {
        const msgs: Record<number, string> = {
          1: "Location denied. Allow location in browser settings.",
          2: "Location unavailable. Enable GPS or WiFi.",
          3: "Location timed out. Try again.",
        };
        setError(msgs[error.code] ?? "Unknown error.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15_000, maximumAge: 30_000 }
    );
  }, []);

  return { coords, accuracy, error, loading, request };
}

export default function TeacherAttendancePage() {
  const gps = useGPS();

  const [sessions,        setSessions]        = useState<SchoolSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<SchoolSession | null>(null);
  const [students,        setStudents]        = useState<StudentRow[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [saving,          setSaving]          = useState<string | null>(null);
  const [error,           setError]           = useState<string | null>(null);
  const [geoVerified,     setGeoVerified]     = useState(false);
  const [geoDetails,      setGeoDetails]      = useState("");

  // Request GPS on mount
  useEffect(() => { gps.request(); }, []);

  // Verify GPS against selected school
  useEffect(() => {
    if (!gps.coords || !selectedSession) return;
    const school = selectedSession.school;
    const result = detectSchoolZone(
      gps.coords,
      {
        id:           school.id,
        name:         school.name,
        center:       { latitude: school.latitude, longitude: school.longitude },
        radiusMeters: school.radiusMeters,
        zones: school.zones.map(z => ({
          id:           z.id,
          name:         z.name,
          center:       { latitude: z.latitude, longitude: z.longitude },
          radiusMeters: z.radiusMeters,
          color:        z.color,
        })),
      },
      gps.accuracy ?? 0
    );
    setGeoVerified(result.withinSchool);
    setGeoDetails(
      result.withinSchool
        ? `You are ${fmtDist(result.distanceFromCenter)} from school centre${result.currentZone ? ` · Zone: ${result.currentZone.name}` : ""}`
        : `You are ${fmtDist(result.distanceFromCenter)} from school · ${result.directionToCenter} · Allowed: ${fmtDist(school.radiusMeters)}`
    );
  }, [gps.coords, selectedSession]);

  // Load today's sessions
  useEffect(() => {
    async function load() {
      setSessionsLoading(true);
      try {
        const today = new Date().toISOString().split("T")[0];
        const res   = await fetch(
          `/api/sessions?dateFrom=${today}&dateTo=${today}`,
          { credentials: "include" }
        );
        const data  = await res.json();
        setSessions(data.sessions ?? []);
      } catch {
        setError("Failed to load sessions.");
      } finally {
        setSessionsLoading(false);
      }
    }
    load();
  }, []);

  async function selectSession(session: SchoolSession) {
    setSelectedSession(session);
    setStudentsLoading(true);
    setStudents([]);
    try {
      const res  = await fetch(
        `/api/sessions/${session.id}/students`,
        { credentials: "include" }
      );
      const data = await res.json();
      setStudents(data.students ?? []);
    } catch {
      setError("Failed to load students.");
    } finally {
      setStudentsLoading(false);
    }
  }

  async function markStudent(studentId: string, status: AttendanceStatus) {
    if (!selectedSession || !geoVerified) return;
    setSaving(studentId);
    try {
      const res = await fetch("/api/attendance", {
        method:      "POST",
        credentials: "include",
        headers:     { "Content-Type": "application/json" },
        body: JSON.stringify({
          isManualOverride: true,
          sessionId:        selectedSession.id,
          studentId,
          status,
          markedLatitude:   gps.coords?.latitude,
          markedLongitude:  gps.coords?.longitude,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to mark");
      }
      setStudents(prev =>
        prev.map(s => s.id === studentId ? { ...s, status } : s)
      );
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(null);
    }
  }

  async function toggleSession(isOpen: boolean) {
    if (!selectedSession) return;
    try {
      await fetch(`/api/sessions/${selectedSession.id}`, {
        method:      "PATCH",
        credentials: "include",
        headers:     { "Content-Type": "application/json" },
        body:        JSON.stringify({ isOpen }),
      });
      setSelectedSession(prev => prev ? { ...prev, isOpen } : prev);
      setSessions(prev =>
        prev.map(s => s.id === selectedSession.id ? { ...s, isOpen } : s)
      );
    } catch {
      setError("Failed to toggle session.");
    }
  }

  const markedCount   = students.filter(s => s.status !== null).length;
  const unmarkedCount = students.length - markedCount;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mark Attendance</h1>
        <p className="text-muted-foreground text-sm mt-1">
          GPS verification required · Students marked manually
        </p>
      </div>

      {/* GPS card */}
      <Card className={
        gps.loading   ? "border-amber-300   bg-amber-50"
        : gps.error   ? "border-red-300     bg-red-50"
        : geoVerified ? "border-emerald-300 bg-emerald-50"
        :               "border-orange-300  bg-orange-50"
      }>
        <CardContent className="pt-4 pb-3 flex items-start gap-3">
          {gps.loading
            ? <Loader2       className="w-5 h-5 text-amber-600  animate-spin mt-0.5" />
            : gps.error
              ? <XCircle     className="w-5 h-5 text-red-600     mt-0.5" />
              : geoVerified
                ? <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5" />
                : <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
          }
          <div className="flex-1">
            <p className="text-sm font-medium">
              {gps.loading  ? "Getting your location…"
              : gps.error   ? "Location error"
              : geoVerified ? "Location verified — you are on campus"
              :               "Outside school radius"}
            </p>
            {(gps.error || geoDetails) && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {gps.error || geoDetails}
              </p>
            )}
            {gps.accuracy && (
              <p className="text-xs text-muted-foreground">
                GPS accuracy: ±{Math.round(gps.accuracy)}m
              </p>
            )}
          </div>
          {(gps.error || (!geoVerified && !gps.loading)) && (
            <Button size="sm" variant="outline" onClick={gps.request}>
              <RefreshCw className="w-3 h-3 mr-1" /> Retry
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Session selector */}
      {!selectedSession ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Today's Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            {sessionsLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading…
              </div>
            ) : sessions.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No sessions found for today. Ask admin to create a session with isOpen set to true.
              </p>
            ) : (
              <div className="space-y-2">
                {sessions.map(s => (
                  <button
                    key={s.id}
                    onClick={() => selectSession(s)}
                    className="w-full text-left p-3 rounded-lg border hover:bg-muted/50 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-sm">{s.class.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(s.startTime).toLocaleTimeString([], {
                          hour: "2-digit", minute: "2-digit",
                        })}
                        {" · "}{s.school.name}
                      </p>
                    </div>
                    <Badge variant={s.isOpen ? "default" : "secondary"}>
                      {s.isOpen ? "Open" : "Closed"}
                    </Badge>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Session header */}
          <Card>
            <CardContent className="pt-4 pb-3 flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="font-semibold">{selectedSession.class.name}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedSession.school.name} ·{" "}
                  {new Date(selectedSession.startTime).toLocaleTimeString([], {
                    hour: "2-digit", minute: "2-digit",
                  })}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {markedCount}/{students.length} marked · {unmarkedCount} remaining
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline"
                  onClick={() => setSelectedSession(null)}>
                  ← Back
                </Button>
                <Button
                  size="sm"
                  variant={selectedSession.isOpen ? "destructive" : "default"}
                  onClick={() => toggleSession(!selectedSession.isOpen)}
                >
                  {selectedSession.isOpen ? "Close Session" : "Open Session"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* GPS warning */}
          {!geoVerified && !gps.loading && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-sm text-red-700">
                You must be within <strong>{selectedSession.school.radiusMeters}m</strong> of school. {geoDetails}
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive flex justify-between">
              {error}
              <button className="underline ml-2" onClick={() => setError(null)}>dismiss</button>
            </div>
          )}

          {/* Student list */}
          <div className="space-y-2">
            {studentsLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground text-sm py-4">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading students…
              </div>
            ) : students.length === 0 ? (
              <p className="text-muted-foreground text-sm">No students in this class.</p>
            ) : (
              students.map(student => (
                <Card key={student.id} className={
                  student.status === "PRESENT" ? "border-emerald-200 bg-emerald-50/30"
                  : student.status === "LATE"  ? "border-amber-200  bg-amber-50/30"
                  : student.status === "ABSENT" ? "border-red-200   bg-red-50/30"
                  : ""
                }>
                  <CardContent className="py-3 flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                        {student.username.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{student.username}</p>
                        <p className="text-xs text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {(["PRESENT", "LATE", "ABSENT", "EXCUSED"] as AttendanceStatus[]).map(s => (
                        <button
                          key={s}
                          disabled={!geoVerified || saving === student.id}
                          onClick={() => markStudent(student.id, s)}
                          className={`
                            px-3 py-1 rounded-md text-xs font-medium transition-all
                            ${student.status === s
                              ? STATUS_CONFIG[s].color + " ring-2 ring-offset-1"
                              : "bg-muted hover:bg-muted/80 text-muted-foreground"
                            }
                            disabled:opacity-40 disabled:cursor-not-allowed
                          `}
                        >
                          {saving === student.id
                            ? <Loader2 className="w-3 h-3 animate-spin inline" />
                            : STATUS_CONFIG[s].label
                          }
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Summary bar */}
          {markedCount > 0 && (
            <div className="rounded-xl bg-muted/50 border px-4 py-3 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-emerald-600 font-medium">
                  ✓ {students.filter(s => s.status === "PRESENT").length} Present
                </span>
                <span className="text-amber-600 font-medium">
                  ⏱ {students.filter(s => s.status === "LATE").length} Late
                </span>
                <span className="text-red-600 font-medium">
                  ✗ {students.filter(s => s.status === "ABSENT").length} Absent
                </span>
              </div>
              {unmarkedCount === 0 && (
                <Badge className="bg-emerald-500 text-white">
                  <CheckCircle className="w-3 h-3 mr-1" /> All students marked
                </Badge>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}