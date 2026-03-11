export interface SessionClass {
  id:   string;
  name: string;
}

export interface SessionSchool {
  id:   string;
  name: string;
}

export interface SessionDTO {
  id:        string;
  date:      string;
  startTime: string;
  endTime:   string | null;
  isOpen:    boolean;
  class:     SessionClass;
  school:    SessionSchool;
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