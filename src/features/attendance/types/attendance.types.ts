/**
 * src/features/attendance/types/attendance.types.ts
 */

// ─── Enums ────────────────────────────────────────────────────────────────────

export type AttendanceStatus = "PRESENT" | "LATE" | "ABSENT" | "EXCUSED";

// ─── School / Zone DTOs ───────────────────────────────────────────────────────

export interface SchoolZoneDTO {
  id:           string;
  name:         string;
  description:  string | null;
  color:        string | null;
  latitude:     number;
  longitude:    number;
  radiusMeters: number;
  isActive:     boolean;
}

export interface SchoolDTO {
  id:           string;
  name:         string;
  address:      string | null;
  latitude:     number;
  longitude:    number;
  radiusMeters: number;
  zones:        SchoolZoneDTO[];
}

// ─── Session ──────────────────────────────────────────────────────────────────

export interface SessionDTO {
  id:          string;
  date:        string;
  startTime:   string;
  endTime:     string | null;
  isOpen:      boolean;
  class: {
    id:      string;
    name:    string;
  };
  school:        SchoolDTO;
  alreadyMarked: boolean;
  existingRecord: AttendanceDTO | null;
}

// ─── Attendance ───────────────────────────────────────────────────────────────

export interface AttendanceDTO {
  id:                 string;
  status:             AttendanceStatus;
  date:               string;
  markedAt:           string;
  markedLatitude:     number | null;
  markedLongitude:    number | null;
  distanceFromCenter: number | null;
  distanceFromZone:   number | null;
  withinSchool:       boolean;
  gpsAccuracy:        number | null;
  deviceInfo:         string | null;
  ipAddress:          string | null;
  detectedZone: {
    id:    string;
    name:  string;
    color: string | null;
  } | null;
  session: {
    id:        string;
    date:      string;
    startTime: string;
    class: {
      id:   string;
      name: string;
    };
    school: SchoolDTO;
  } | null;
  student: {
    id:       string;
    username: string;
    email:    string;
  };
}

export interface AttendanceSummary {
  PRESENT:        number;
  LATE:           number;
  ABSENT:         number;
  EXCUSED:        number;
  total:          number;
  attendanceRate: number;
}

// ─── API payloads ─────────────────────────────────────────────────────────────

export interface MarkAttendanceBody {
  sessionId: string;
  latitude:  number;
  longitude: number;
  accuracy?: number;
}

export interface MarkAttendanceResponse {
  success:    boolean;
  status?:    AttendanceStatus;
  attendance?: AttendanceDTO;
  detection?: {
    withinSchool:       boolean;
    distanceFromCenter: number;
    distanceToBoundary: number;
    currentZone:        { id: string; name: string } | null;
    directionToCenter:  string;
  };
  error?: string;
}

export interface ListAttendanceResponse {
  records: AttendanceDTO[];
  summary: AttendanceSummary;
  total:   number;
}

// ─── Filters ──────────────────────────────────────────────────────────────────

export interface AttendanceFilters {
  status?:   AttendanceStatus | "";
  classId?:  string;
  dateFrom?: string;
  dateTo?:   string;
  search?:   string;
  page:      number;
  pageSize:  number;
}

// ─── Form ─────────────────────────────────────────────────────────────────────

export interface AttendanceFormValues {
  studentId: string;
  sessionId: string;
  status:    AttendanceStatus;
  note?:     string;
}

export interface AttendanceFormErrors {
  studentId?: string;
  sessionId?: string;
  status?:    string;
}

// ─── Geolocation ─────────────────────────────────────────────────────────────

export interface LocationState {
  latitude:  number | null;
  longitude: number | null;
  accuracy:  number | null;
  error:     string | null;
  loading:   boolean;
  timestamp: number | null;
}