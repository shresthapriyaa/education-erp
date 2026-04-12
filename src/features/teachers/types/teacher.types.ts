// export interface Teacher {
//   id: string;
//   username: string;
//   email: string;
//   phone?: string | null;
//   address?: string | null;
//   img?: string | null;
//   userId?: string;
//   createdAt: string;
//   updatedAt?: string;
//   classTeacherFor?: { id: string; name: string; grade: string; section: string }[];
// }



export interface Teacher {
  id: string;
  username: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  img?: string | null;
  userId?: string;
  createdAt: string;
  updatedAt?: string;
  // FIX: was "classes", API returns "classTeacherFor" (matches Prisma relation name)
  classTeacherFor?: { id: string; name: string; grade: string; section: string }[];
}