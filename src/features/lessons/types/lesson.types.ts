export interface Material {
  id: string;
  lessonId: string;
  title: string;
  type: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  materials?: Material[];
}