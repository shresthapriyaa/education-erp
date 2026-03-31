// export type AttendanceStatus = "Present" | "Absent" | "Late";

// export type AttendanceMethod = "Geofence" | "Manual" | "QR";

// export interface AttendanceRecord {
//   id: string;
//   studentId: string;
//   studentName: string;
//   rollNo: string;
//   date: string; // ISO date string e.g. "2026-03-30"
//   time: string; // e.g. "08:02 AM"
//   status: AttendanceStatus;
//   method: AttendanceMethod;
//   latitude?: number;
//   longitude?: number;
//   distanceFromSchool?: number; // in meters
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






export type AttendanceStatus = "Present" | "Absent" | "Late";

export type AttendanceMethod = "Geofence" | "Manual" | "QR";

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  date: string;
  time: string;
  status: AttendanceStatus;
  method: AttendanceMethod;
  latitude?: number;
  longitude?: number;
  distanceFromSchool?: number;
}

export interface AttendanceSummary {
  total: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
}

export interface GeofenceConfig {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  active: boolean;
}

export interface MarkAttendancePayload {
  studentId: string;
  date: string;
  status: AttendanceStatus;
  method: AttendanceMethod;
  latitude?: number;
  longitude?: number;
  distanceFromSchool?: number;
}

export interface BulkMarkAttendancePayload {
  classId: string;
  date: string;
  teacherId: string;
  records: {
    studentId: string;
    status: AttendanceStatus;
  }[];
}

export interface AttendanceFilters {
  studentId?: string;
  classId?: string;
  startDate?: string;
  endDate?: string;
  status?: AttendanceStatus;
}

// ─── Missing types used by AttendanceDialog ───────────────────────────────────

/** The attendance record shape returned from the API */
export interface AttendanceDTO {
  id: string;
  status: AttendanceStatus;
  date: string;
  markedAt: string;
  markedLatitude?: number | null;
  markedLongitude?: number | null;
  distanceFromCenter?: number | null;
  withinSchool?: boolean;
  gpsAccuracy?: number | null;
  student?: {
    id: string;
    username: string;
    email: string;
  };
  session?: {
    id: string;
    date: string;
    startTime: string;
    class: { id: string; name: string };
    school: {
      id: string;
      name: string;
      latitude: number;
      longitude: number;
      radiusMeters: number;
      zones: ZoneDTO[];
    };
  } | null;
  detectedZone?: { id: string; name: string; color?: string } | null;
}

/** Zone shape inside a session's school */
export interface ZoneDTO {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  color?: string | null;
  isActive?: boolean;
  description?: string | null;
}

/** Form values for create / edit attendance (admin) */
export interface AttendanceFormValues {
  studentId: string;
  sessionId: string;
  status: AttendanceStatus;
  date?: string;
}

/** Response returned after a student marks attendance via GPS */
export interface MarkAttendanceResponse {
  success: boolean;
  error?: string;
  status?: AttendanceStatus;
  attendance?: AttendanceDTO;
  detection?: {
    withinSchool: boolean;
    distanceFromCenter: number;
    distanceToBoundary: number;
    directionToCenter: string;
    currentZone?: { id: string; name: string } | null;
  };
}