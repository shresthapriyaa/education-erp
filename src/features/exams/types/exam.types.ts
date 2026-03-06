export interface Exam {
  id: string;
  title: string;
  subjectId: string;
  subject?: {
    id: string;
    name: string;
  };
  date: string;
  createdAt: string;
  updatedAt: string;
}