export type UserRole = "ADMIN" | "TEACHER" | "STUDENT" | "PARENT" | "ACCOUNTANT";

export interface User {
  id: string;
  username: string;
  email: string;
  isVerified: boolean;
  role: UserRole;
}
