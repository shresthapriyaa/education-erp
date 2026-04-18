export type DayOfWeek = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";

export interface Routine {
  id:             string;
  classSubjectId: string;
  day:            DayOfWeek;
  startTime:      string;
  endTime:        string;
  room:           string | null;
  classSubject?:  {
    id: string;
    class: { id: string; name: string; grade: string; section: string };
    subject: { id: string; name: string; code?: string };
    teacher: { id: string; username: string; email: string } | null;
  };
  // Legacy fields for backward compatibility
  classId?:   string;
  subjectId?: string;
  teacherId?: string | null;
  class?:     { id: string; name: string };
  subject?:   { id: string; name: string };
  teacher?:   { id: string; username: string } | null;
  createdAt:  string;
  updatedAt:  string;
}