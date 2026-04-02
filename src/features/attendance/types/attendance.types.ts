// // export type AttendanceStatus = "Present" | "Absent" | "Late";

// // export type AttendanceMethod = "Geofence" | "Manual" | "QR";

// // export interface AttendanceRecord {
// //   id: string;
// //   studentId: string;
// //   studentName: string;
// //   rollNo: string;
// //   date: string; // ISO date string e.g. "2026-03-30"
// //   time: string; // e.g. "08:02 AM"
// //   status: AttendanceStatus;
// //   method: AttendanceMethod;
// //   latitude?: number;
// //   longitude?: number;
// //   distanceFromSchool?: number; // in meters
// // }

// // export interface AttendanceSummary {
// //   total: number;
// //   present: number;
// //   absent: number;
// //   late: number;
// //   percentage: number;
// // }

// // export interface GeofenceConfig {
// //   id: string;
// //   name: string;
// //   latitude: number;
// //   longitude: number;
// //   radiusMeters: number;
// //   active: boolean;
// // }

// // export interface MarkAttendancePayload {
// //   studentId: string;
// //   date: string;
// //   status: AttendanceStatus;
// //   method: AttendanceMethod;
// //   latitude?: number;
// //   longitude?: number;
// //   distanceFromSchool?: number;
// // }

// // export interface BulkMarkAttendancePayload {
// //   classId: string;
// //   date: string;
// //   teacherId: string;
// //   records: {
// //     studentId: string;
// //     status: AttendanceStatus;
// //   }[];
// // }

// // export interface AttendanceFilters {
// //   studentId?: string;
// //   classId?: string;
// //   startDate?: string;
// //   endDate?: string;
// //   status?: AttendanceStatus;
// // }






// export type AttendanceStatus = "Present" | "Absent" | "Late";

// export type AttendanceMethod = "Geofence" | "Manual" | "QR";

// export interface AttendanceRecord {
//   id: string;
//   studentId: string;
//   studentName: string;
//   rollNo: string;
//   date: string;
//   time: string;
//   status: AttendanceStatus;
//   method: AttendanceMethod;
//   latitude?: number;
//   longitude?: number;
//   distanceFromSchool?: number;
// }

// export interface AttendanceSummary {
//   total: number;
//   present: number;
//   absent: number;
//   late: number;
//   percentage: number;
// }

// export interface GeofenceConfig {
//   id: string;
//   name: string;
//   latitude: number;
//   longitude: number;
//   radiusMeters: number;
//   active: boolean;
// }

// export interface MarkAttendancePayload {
//   studentId: string;
//   date: string;
//   status: AttendanceStatus;
//   method: AttendanceMethod;
//   latitude?: number;
//   longitude?: number;
//   distanceFromSchool?: number;
// }

// export interface BulkMarkAttendancePayload {
//   classId: string;
//   date: string;
//   teacherId: string;
//   records: {
//     studentId: string;
//     status: AttendanceStatus;
//   }[];
// }

// export interface AttendanceFilters {
//   studentId?: string;
//   classId?: string;
//   startDate?: string;
//   endDate?: string;
//   status?: AttendanceStatus;
// }

// // ─── Missing types used by AttendanceDialog ───────────────────────────────────

// /** The attendance record shape returned from the API */
// export interface AttendanceDTO {
//   id: string;
//   status: AttendanceStatus;
//   date: string;
//   markedAt: string;
//   markedLatitude?: number | null;
//   markedLongitude?: number | null;
//   distanceFromCenter?: number | null;
//   withinSchool?: boolean;
//   gpsAccuracy?: number | null;
//   student?: {
//     id: string;
//     username: string;
//     email: string;
//   };
//   session?: {
//     id: string;
//     date: string;
//     startTime: string;
//     class: { id: string; name: string };
//     school: {
//       id: string;
//       name: string;
//       latitude: number;
//       longitude: number;
//       radiusMeters: number;
//       zones: ZoneDTO[];
//     };
//   } | null;
//   detectedZone?: { id: string; name: string; color?: string } | null;
// }

// /** Zone shape inside a session's school */
// export interface ZoneDTO {
//   id: string;
//   name: string;
//   latitude: number;
//   longitude: number;
//   radiusMeters: number;
//   color?: string | null;
//   isActive?: boolean;
//   description?: string | null;
// }

// /** Form values for create / edit attendance (admin) */
// export interface AttendanceFormValues {
//   studentId: string;
//   sessionId: string;
//   status: AttendanceStatus;
//   date?: string;
// }

// /** Response returned after a student marks attendance via GPS */
// export interface MarkAttendanceResponse {
//   success: boolean;
//   error?: string;
//   status?: AttendanceStatus;
//   attendance?: AttendanceDTO;
//   detection?: {
//     withinSchool: boolean;
//     distanceFromCenter: number;
//     distanceToBoundary: number;
//     directionToCenter: string;
//     currentZone?: { id: string; name: string } | null;
//   };
// }





// src/features/attendance/types/attendance.types.ts

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