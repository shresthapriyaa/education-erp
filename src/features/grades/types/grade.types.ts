export interface Grade {
  id: string;
  studentId: string;
  assignmentId: string;
  score: number;
  createdAt: string;
  updatedAt: string;
  student?: {
    id: string;
    username: string;
    email: string;
  };
  assignment?: {
    id: string;
    title: string;
    dueDate: string;
  };
}