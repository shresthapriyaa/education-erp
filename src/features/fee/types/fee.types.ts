export interface Fee {
  id: string;
  studentId: string;
  amount: number;
  dueDate: string;
  paid: boolean;
  student?: {
    id: string;
    username: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}