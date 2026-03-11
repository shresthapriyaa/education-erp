export interface LibraryBookDTO {
  id:            string;
  title:         string;
  author:        string;
  isbn:          string;
  publishedDate: string;
  createdAt:     string;
}

export interface LibraryBookFormValues {
  title:         string;
  author:        string;
  isbn:          string;
  publishedDate: string;
}

export interface LibraryBookFormErrors {
  title?:         string;
  author?:        string;
  isbn?:          string;
  publishedDate?: string;
}