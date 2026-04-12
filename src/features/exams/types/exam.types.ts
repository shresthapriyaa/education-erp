// // export interface Exam {
// //   id: string;
// //   title: string;
// //   subjectId: string;
// //   subject?: {
// //     id: string;
// //     name: string;
// //   };
// //   date: string;
// //   createdAt: string;
// //   updatedAt: string;
// // }



// export type ExamType = "MIDTERM" | "FINAL" | "UNIT_TEST" | "PRACTICAL";

// export interface Exam {
//   id:         string;
//   title:      string;
//   type:       ExamType;
//   totalMarks: number;
//   passMarks:  number;
//   date:       string;

//   subjectId:  string;
//   subject?:   { id: string; name: string };

//   classId:    string;
//   class?:     { id: string; name: string };

//   createdAt:  string;
//   updatedAt:  string;
// }





export type ExamType = "MIDTERM" | "FINAL" | "UNIT_TEST" | "PRACTICAL";

export interface Exam {
  id:         string;
  title:      string;
  type:       ExamType;
  totalMarks: number;
  passMarks:  number;
  date:       string;

  subjectId:  string;
  subject?:   { id: string; name: string };

  classId:    string;
  class?:     { id: string; name: string };

  createdAt:  string;
  updatedAt:  string;
}