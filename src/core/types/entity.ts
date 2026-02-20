export type Role = "ADMIN" | "TEACHER" | "STUDENT" | "ACCOUNTANT" | "PARENT";


export type UserSex = "MALE" | "FEMALE" | "OTHER";


export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";


export type Day = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";


export interface User {
  id: string;
  username: string;
  email: string;
  role: Role;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}


export interface Student {
  id: string;
  username: string;
  email: string;
  phone?: string;
  address?: string;
  img?: string;
  bloodGroup?: string;
  sex: UserSex;
  dateOfBirth?: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}


export interface Parent {
  id: string;
  username: string;
  email: string;
  phone?: string;
  address?: string;
  img?: string;
  studentIds?: string[]; 
  createdAt: string;
  updatedAt: string;
}


export interface Teacher {
  id: string;
  username: string;
  email: string;
  phone?: string;
  address?: string;
  img?: string;
  createdAt: string;
  updatedAt: string;
}


export interface Fee {
  id: string;
  studentId: string;
  amount: number;
  dueDate: string;
  paid: boolean;
  createdAt: string;
  updatedAt: string;
}


export interface Grade {
  id: string;
  studentId: string;
  assignmentId: string;
  score: number;
  createdAt: string;
  updatedAt: string;
}


export interface Subject {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}


export interface Class {
  id: string;
  name: string;
  teacherId: string;
  createdAt: string;
  updatedAt: string;
}


export interface Schedule {
  id: string;
  classId: string;
  subjectId: string;
  day: Day;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}


export interface Exam {
  id: string;
  title: string;
  subjectId: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}


export interface Result {
  id: string;
  studentId: string;
  subjectId: string;
  grade: string;
  createdAt: string;
  updatedAt: string;
}


export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
export interface Attendance {
  id: string;
  studentId: string;
  date: string;
  status: AttendanceStatus;
  createdAt: string;
  updatedAt: string;
}
export interface Assignment {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    subjectId: string;
    createdAt: string;
    updatedAt: string;
}
export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    createdAt: string;
    updatedAt: string;
}
export interface LibraryBook {
    id: string;
    title: string;
    description?: string;
    author?: string;
    isbn?: string;
    createdAt: string;
    updatedAt: string;
}

