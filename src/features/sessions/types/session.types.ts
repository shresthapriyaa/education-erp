// export interface SessionClass {
//   id:   string;
//   name: string;
// }

// export interface SessionSchool {
//   id:   string;
//   name: string;
// }

// export interface SessionDTO {
//   id:        string;
//   date:      string;
//   startTime: string;
//   endTime:   string | null;
//   isOpen:    boolean;
//   class:     SessionClass;
//   school:    SessionSchool;
//   createdAt: string;
//   _count?:   { attendance: number };
// }

// export interface SessionFormValues {
//   classId:   string;
//   schoolId:  string;
//   date:      string;
//   startTime: string;
//   endTime:   string;
//   isOpen:    boolean;
// }

// export interface SessionFormErrors {
//   classId?:   string;
//   schoolId?:  string;
//   date?:      string;
//   startTime?: string;
// }





export interface SessionClass {
  id:   string;
  name: string;
}

// ✅ Full zone shape needed for geofencing
export interface SessionZone {
  id:           string;
  name:         string;
  latitude:     number;
  longitude:    number;
  radiusMeters: number;
  color?:       string | null;
  isActive?:    boolean;
  description?: string | null;
}

// ✅ Full school shape needed for GPS attendance marking
export interface SessionSchool {
  id:           string;
  name:         string;
  address?:     string | null;
  latitude:     number;
  longitude:    number;
  radiusMeters: number;
  zones:        SessionZone[];
}

export interface SessionDTO {
  id:        string;
  date:      string;
  startTime: string;
  endTime:   string | null;
  isOpen:    boolean;
  class:     SessionClass;
  school:    SessionSchool;  // ✅ now has full school shape
  createdAt: string;
  _count?:   { attendance: number };
}

export interface SessionFormValues {
  classId:   string;
  schoolId:  string;
  date:      string;
  startTime: string;
  endTime:   string;
  isOpen:    boolean;
}

export interface SessionFormErrors {
  classId?:   string;
  schoolId?:  string;
  date?:      string;
  startTime?: string;
}