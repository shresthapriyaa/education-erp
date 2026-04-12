export type DayOfWeek = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";

export interface Routine {
  id:        string;
  classId:   string;
  subjectId: string;
  teacherId: string | null;
  day:       DayOfWeek;
  startTime: string;
  endTime:   string;
  room:      string | null;
  class?:    { id: string; name: string };
  subject?:  { id: string; name: string };
  teacher?:  { id: string; username: string } | null;
  createdAt: string;
  updatedAt: string;
}