export interface Subject {
  id: string;
  name: string;
  code?: string | null;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}