export interface Lesson {
  id:             string;
  title:          string;
  content:        string;
  isPublished:    boolean;
  classSubjectId: string;
  materials?:     Array<{ id: string; title: string; type: string; url: string }>;
  classSubject?:  {
    id: string;
    class: { id: string; name: string; grade: string; section: string };
    subject: { id: string; name: string; code?: string };
    teacher: { id: string; username: string; email: string } | null;
  };
  // Legacy fields for backward compatibility
  classId?:       string;
  subjectId?:     string;
  teacherId?:     string;
  class?:         { name: string };
  subject?:       { name: string };
  teacher?:       { username: string };
  createdAt:      string;
  updatedAt:      string;
}