export type Day = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";

export interface Schedule {
  id: string;
  classId: string;
  subjectId: string;
  day: Day;
  startTime: string;
  endTime: string;
  class?: { id: string; name: string; };
  subject?: { id: string; name: string; };
  createdAt: string;
  updatedAt: string;
}