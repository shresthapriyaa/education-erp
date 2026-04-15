

// ─── Enums ────────────────────────────────────────────────────────────────────

export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";

export type SessionStatus = "active" | "ended";

// ─── Base Models ──────────────────────────────────────────────────────────────

export type StudentBasic = {
  id:       string;
  username: string;
  email:    string;
  class?:   ClassBasic | null;
};

export type ClassBasic = {
  id:   string;
  name: string;
};

export type TeacherBasic = {
  id:       string;
  username: string;
  email:    string;
};

export type SchoolBasic = {
  id:   string;
  name: string;
};

// ─── Attendance Record ────────────────────────────────────────────────────────

export type AttendanceRecord = {
  id:                 string;
  studentId:          string;
  student:            StudentBasic;
  date:               string;
  status:             AttendanceStatus;
  sessionId?:         string | null;
  session?:           SessionBasic | null;
  markedLatitude?:    number | null;
  markedLongitude?:   number | null;
  distanceFromCenter?: number | null;
  withinSchool:       boolean;
  gpsAccuracy?:       number | null;
  deviceInfo?:        string | null;
  createdAt:          string;
  updatedAt:          string;
};

// ─── Session ──────────────────────────────────────────────────────────────────

export type SessionBasic = {
  id:    string;
  class: ClassBasic;
};

export type SessionRecord = {
  id:               string;
  classId:          string;
  class:            ClassBasic;
  schoolId:         string;
  school:           SchoolBasic;
  date:             string;
  startTime:        string;
  endTime?:         string | null;
  isOpen:           boolean;
  radiusMeters:     number;
  lateThresholdMin: number;
  teacher?:         TeacherBasic | null;
  _count:           { attendance: number };
  createdAt:        string;
};

// ─── Stats ────────────────────────────────────────────────────────────────────

export type AttendanceStats = {
  total:   number;
  present: number;
  absent:  number;
  late:    number;
  excused: number;
};

export type WeeklyTrend = {
  day:     string;
  present: number;
  absent:  number;
  late:    number;
};

// ─── Geofence / School Settings ───────────────────────────────────────────────

export type GeofenceSettings = {
  id:               string;
  name:             string;
  latitude:         number;
  longitude:        number;
  radiusMeters:     number;
  minRadiusMeters:  number;
  maxRadiusMeters:  number;
  lateThresholdMin: number;
};

// ─── API Payloads ─────────────────────────────────────────────────────────────

export type CreateSessionPayload = {
  classId:          string;
  schoolId:         string;
  date:             string;
  startTime:        string;
  radiusMeters:     number;
  lateThresholdMin: number;
};

export type UpdateAttendancePayload = {
  status: AttendanceStatus;
};

export type UpdateGeofencePayload = {
  latitude?:         number;
  longitude?:        number;
  radiusMeters?:     number;
  minRadiusMeters?:  number;
  maxRadiusMeters?:  number;
  lateThresholdMin?: number;
};

// ─── Filter Types ─────────────────────────────────────────────────────────────

export type AttendanceFilters = {
  status?:   AttendanceStatus | "ALL";
  dateFrom?: string;
  dateTo?:   string;
  classId?:  string;
  search?:   string;
  pageSize?: number;
};

export type SessionFilters = {
  classId?:   string;
  teacherId?: string;
  dateFrom?:  string;
  dateTo?:    string;
  isOpen?:    boolean;
};

// ─── Status Config (UI helper) ────────────────────────────────────────────────

export const STATUS_CONFIG: Record<AttendanceStatus, {
  label: string;
  color: string;
  bg:    string;
}> = {
  PRESENT: { label: "Present", color: "#16a34a", bg: "#dcfce7" },
  ABSENT:  { label: "Absent",  color: "#dc2626", bg: "#fee2e2" },
  LATE:    { label: "Late",    color: "#ca8a04", bg: "#fef9c3" },
  EXCUSED: { label: "Excused", color: "#6366f1", bg: "#ede9fe" },
};