export interface Class {
  id: string;
  name: string;
  teacherId: string;
  teacher?: {
    id: string;
    username: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}