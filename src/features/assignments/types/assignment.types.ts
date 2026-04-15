export interface Assignment {
  id:          string;
  title:       string;
  description: string;
  dueDate:     string;
  totalMarks:  number;
  classId:     string;
  subjectId:   string;
  teacherId:   string;
  materials?:  Array<{ id: string; title: string; type: string; url: string }>;
  class?:      { name: string };
  subject?:    { name: string };
  teacher?:    { username: string };
  createdAt:   string;
  updatedAt:   string;
}