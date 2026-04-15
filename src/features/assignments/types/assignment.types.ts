export interface Assignment {
  id:          string;
  title:       string;
  description: string;
  dueDate:     string;
  totalMarks:  number;
  classId:     string;
  subjectId:   string;
  teacherId:   string;
  fileUrl?:    string | null;
  class?:      { name: string };
  subject?:    { name: string };
  teacher?:    { username: string };
  createdAt:   string;
  updatedAt:   string;
}