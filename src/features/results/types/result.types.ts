export interface Result {
  id: string;
  studentId: string;
  subjectId: string;
  grade: string;
  student?: {
    id: string;
    username: string;
    email: string;
  };
  subject?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}