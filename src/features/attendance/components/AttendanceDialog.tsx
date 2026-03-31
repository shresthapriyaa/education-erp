"use client";

/**
 * src/features/attendance/components/AttendanceDialog.tsx
 * mode="mark"   — student GPS mark
 * mode="create" — admin create
 * mode="edit"   — admin edit
 */

import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription,
} from "@/core/components/ui/dialog";
import { Badge }     from "@/core/components/ui/badge";
import { Button }    from "@/core/components/ui/button";
import { Separator } from "@/core/components/ui/separator";
import {
  CheckCircle2, XCircle, MapPin, Navigation,
  Loader2, Shield, AlertTriangle, RefreshCw,
} from "lucide-react";
import {
  detectSchoolZone, fmtDist,
  type SchoolBoundaryInput,
} from "@/core/lib/haversineDistance";
import { useGeolocationState }  from "../hooks/useAttendance";
import { AttendanceForm }        from "./AttendanceForm";
// import type {
//   AttendanceRecord,
//   AttendanceDTO,
//   AttendanceFormValues,
//   MarkAttendanceResponse,
// } from "../types/attendance.types";
import { SessionDTO } from "@/features/sessions";
import { AttendanceDTO, AttendanceFormValues, MarkAttendanceResponse } from "../types/attendance.types";

// ─── Mark mode ────────────────────────────────────────────────────────────────

function MarkContent({
  session, markResult, marking, onMark, onClose,
}: {
  session:    SessionDTO;
  markResult: MarkAttendanceResponse | null;
  marking:    boolean;
  onMark:     (lat: number, lng: number, accuracy?: number) => Promise<MarkAttendanceResponse>; // ✅ fixed typo
  onClose:    () => void;
}) {
  const { loc, request, isSupported } = useGeolocationState();

  const boundary: SchoolBoundaryInput = {
    id:           session.school.id,
    name:         session.school.name,
    center:       { latitude: session.school.latitude, longitude: session.school.longitude },
    radiusMeters: session.school.radiusMeters ?? 0,           // ✅ fallback
    zones: (session.school.zones ?? []).map(z => ({           // ✅ safe fallback
      id:           z.id,
      name:         z.name,
      center:       { latitude: z.latitude, longitude: z.longitude },
      radiusMeters: z.radiusMeters ?? 0,                      // ✅ fallback
      color:        z.color ?? undefined,
    })),
  };

  const detection = loc.latitude != null && loc.longitude != null
    ? detectSchoolZone(
        { latitude: loc.latitude, longitude: loc.longitude },
        boundary,
        loc.accuracy ?? 0
      )
    : null;

  const canMark = !marking && loc.latitude != null && !markResult?.success;

  return (
    <div className="space-y-4">

      {/* Session info */}
      <div className="rounded-xl bg-muted/40 px-4 py-3 text-sm space-y-1">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Class</span>
          <span className="font-semibold">{session.class.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">School</span>
          <span>{session.school.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Boundary</span>
          <span className="font-mono">{session.school.radiusMeters ?? 0}m radius</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Zones</span>
          <span>{(session.school.zones ?? []).length} zones</span> {/* ✅ safe fallback */}
        </div>
      </div>

      {/* Geofence result */}
      {detection && (
        <div className={`rounded-xl px-4 py-3 flex items-start gap-3 border ${
          detection.withinSchool
            ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20"
            : "bg-destructive/5 border-destructive/20"
        }`}>
          {detection.withinSchool
            ? <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 shrink-0" />
            : <XCircle      size={16} className="text-destructive mt-0.5 shrink-0" />
          }
          <div className="flex-1 space-y-0.5">
            <p className={`text-sm font-semibold ${
              detection.withinSchool ? "text-emerald-700" : "text-destructive"
            }`}>
              {detection.withinSchool
                ? `Within school · ${fmtDist(detection.distanceFromCenter)} from center`
                : `Outside school · ${fmtDist(detection.distanceFromCenter)} from center`}
            </p>
            {detection.currentZone && (
              <p className="text-xs text-muted-foreground">
                Zone: <strong>{detection.currentZone.name}</strong>
              </p>
            )}
            {!detection.withinSchool && (
              <p className="text-xs text-muted-foreground">
                Move <strong>{fmtDist(-detection.distanceToBoundary)}</strong>{" "}
                toward <strong>{detection.directionToCenter}</strong>
              </p>
            )}
          </div>
        </div>
      )}

      {/* GPS coords */}
      {loc.latitude != null && (
        <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          <Navigation size={11} />
          <span className="font-mono">
            {loc.latitude.toFixed(5)}, {loc.longitude!.toFixed(5)}
          </span>
          {loc.accuracy != null && (
            <span className="ml-auto">±{Math.round(loc.accuracy)}m GPS</span>
          )}
        </div>
      )}

      {/* Errors */}
      {loc.error && (
        <div className="flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2.5">
          <AlertTriangle size={14} className="text-amber-500 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-700">{loc.error}</p>
        </div>
      )}
      {!isSupported && (
        <div className="flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2.5">
          <AlertTriangle size={14} className="text-amber-500 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-700">
            Geolocation not supported. Use Chrome, Firefox, Safari, or Edge.
          </p>
        </div>
      )}

      {/* Success */}
      {markResult?.success && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-4 space-y-2.5">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-600" />
            <p className="font-bold text-emerald-700">Attendance Marked!</p>
          </div>
          <Separator className="bg-emerald-200" />
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
            <span className="text-muted-foreground">Status</span>
            <Badge variant="default">{markResult.attendance?.status}</Badge>
            <span className="text-muted-foreground">Zone</span>
            <span className="font-medium">
              {markResult.detection?.currentZone?.name ?? "School premises"}
            </span>
            <span className="text-muted-foreground">Distance</span>
            <span className="font-mono">
              {fmtDist(markResult.detection?.distanceFromCenter ?? 0)}
            </span>
            <span className="text-muted-foreground">On Campus</span>
            <span className={markResult.detection?.withinSchool ? "text-emerald-600 font-medium" : "text-destructive font-medium"}>
              {markResult.detection?.withinSchool ? "✓ Yes" : "✗ No"}
            </span>
          </div>
        </div>
      )}

      {/* Error */}
      {markResult && !markResult.success && (
        <div className="flex items-start gap-2 rounded-xl bg-destructive/5 border border-destructive/20 px-3 py-2.5">
          <XCircle size={14} className="text-destructive mt-0.5 shrink-0" />
          <p className="text-sm text-destructive">{markResult.error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-2 pt-1">
        {loc.latitude == null && !loc.loading && (
          <Button onClick={request} className="w-full">
            <MapPin size={14} className="mr-2" /> Get My Location
          </Button>
        )}
        {loc.loading && (
          <Button disabled className="w-full">
            <Loader2 size={14} className="mr-2 animate-spin" /> Locating…
          </Button>
        )}
        {loc.latitude != null && !markResult?.success && (
          <>
            <Button
              onClick={() => onMark(loc.latitude!, loc.longitude!, loc.accuracy ?? undefined)}
              disabled={!canMark}
              variant={detection?.withinSchool ? "default" : "destructive"}
              className="w-full"
            >
              {marking
                ? <><Loader2 size={14} className="mr-2 animate-spin" /> Marking…</>
                : <><Shield size={14} className="mr-2" />
                    {detection?.withinSchool ? "Mark Attendance" : "Mark Anyway (Outside)"}
                  </>
              }
            </Button>
            <Button variant="outline" size="sm" onClick={request} className="w-full">
              <RefreshCw size={12} className="mr-2" /> Refresh Location
            </Button>
          </>
        )}
        {markResult?.success && (
          <Button variant="outline" onClick={onClose} className="w-full">
            Done
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Main Dialog ──────────────────────────────────────────────────────────────

type DialogMode = "mark" | "create" | "edit";

interface AttendanceDialogProps {
  open:         boolean;
  onOpenChange: (open: boolean) => void;
  mode:         DialogMode;
  // mark mode
  session?:     SessionDTO;
  markResult?:  MarkAttendanceResponse | null;
  marking?:     boolean;
  onMark?:      (lat: number, lng: number, accuracy?: number) => Promise<MarkAttendanceResponse>;
  // create / edit mode
  record?:      AttendanceDTO;
  saving?:      boolean;
  onSave?:      (values: AttendanceFormValues) => Promise<void>;
}

export function AttendanceDialog({
  open, onOpenChange, mode,
  session, markResult, marking, onMark,
  record, saving, onSave,
}: AttendanceDialogProps) {

  const titles: Record<DialogMode, string> = {
    mark:   "Mark Attendance",
    create: "Create Attendance Record",
    edit:   "Edit Attendance Record",
  };

  const subtitles: Record<DialogMode, string> = {
    mark:   session ? `${session.class.name}` : "",
    create: "Manually log an attendance entry",
    edit:   record  ? `${record.session?.class.name ?? ""} · ${new Date(record.date).toLocaleDateString()}` : "",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{titles[mode]}</DialogTitle>
          {subtitles[mode] && (
            <DialogDescription>{subtitles[mode]}</DialogDescription>
          )}
        </DialogHeader>

        <div className="py-1">
          {mode === "mark" && session && onMark && (
            <MarkContent
              session={session}
              markResult={markResult ?? null}
              marking={marking ?? false}
              onMark={onMark}
              onClose={() => onOpenChange(false)}
            />
          )}
          {(mode === "create" || mode === "edit") && onSave && (
            <AttendanceForm
              record={record}
              onSubmit={onSave}
              onCancel={() => onOpenChange(false)}
              isLoading={saving}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}