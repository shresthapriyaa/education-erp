export type Usersex = "MALE" | "FEMALE";

export interface Student {
  id: string;
  username: string;
  userId: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  img?: string | null;
  bloodGroup?: string | null;
  sex: Usersex;
  dateOfBirth?: string | null;
  parentId?: string | null;
  createdAt: string;
  updatedAt: string;
  parent?: {
    id: string;
    username: string;
    email: string;
  } | null;
  user?: {
    id: string;
    username: string;
    email: string;
    role: string;
    isVerified: boolean;
  } | null;
}