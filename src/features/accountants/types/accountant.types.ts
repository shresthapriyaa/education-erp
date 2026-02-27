export interface Accountant {
  id: string;
  username: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  img?: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}