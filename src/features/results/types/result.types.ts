// export interface Result {
//   id: string;
//   studentId: string;
//   subjectId: string;
//   grade: string;
//   student?: {
//     id: string;
//     username: string;
//     email: string;
//   };
//   subject?: {
//     id: string;
//     name: string;
//   };
//   createdAt: string;
//   updatedAt: string;
// }





export interface Result {
  id:            string;
  studentId:     string;
  subjectId:     string;
  classId:       string;
  academicYear:  string;
  term:          string;
  totalMarks:    number;
  obtainedMarks: number;
  percentage:    number;
  grade:         string;
  isPassed:      boolean;
  student?: { id: string; username: string; email: string };
  subject?: { id: string; name: string };
  class?:   { id: string; name: string };
  createdAt: string;
  updatedAt: string;
}