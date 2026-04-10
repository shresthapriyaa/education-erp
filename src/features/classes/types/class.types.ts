export interface Class {
  id: string;
  name: string;
  grade: string;
  section: string;
  academicYear: string;
  classTeacherId?: string | null;
  classTeacher?: {
    id: string;
    username: string;
    email: string;
  } | null;
  schoolId?: string | null;
  school?: {
    id: string;
    name: string;
  } | null;
  students?: Array<{ id: string }>;
  subjects?: Array<{
    subject: { name: string };
    teacher?: { username: string } | null;
  }>;
  _count?: {
    students: number;
  };
  createdAt: string;
  updatedAt: string;
}
