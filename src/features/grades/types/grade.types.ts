export interface Grade {
  id:           string;
  studentId:    string;
  assignmentId: string;
  score:        number;
  remarks?:     string | null;
  student?: {
    id:       string;
    username: string;
    email:    string;
  };
  assignment?: {
    id:       string;
    title:    string;
    dueDate:  string;
  };
  createdAt: string;
  updatedAt: string;
}