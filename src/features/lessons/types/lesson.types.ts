// export interface Material {
//   id: string;
//   lessonId: string;
//   title: string;
//   type: string;
//   url: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface Lesson {
//   id: string;
//   title: string;
//   content: string;
//   createdAt: string;
//   updatedAt: string;
//   materials?: Material[];
// }





export type MaterialType = "PDF" | "VIDEO" | "LINK" | "DOCUMENT" | "IMAGE";

export interface Material {
  id:        string;
  lessonId:  string;
  title:     string;
  type:      MaterialType;
  url:       string;
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id:          string;
  title:       string;
  content:     string;
  isPublished: boolean;
  classId:     string;
  subjectId:   string;
  teacherId:   string;
  class?:      { id: string; name: string };
  subject?:    { id: string; name: string };
  teacher?:    { id: string; username: string };
  materials?:  Material[];
  createdAt:   string;
  updatedAt:   string;
}