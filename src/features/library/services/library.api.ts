import axios from "axios";
import { LibraryBookDTO, LibraryBookFormValues } from "../types/library";

const BASE = "/api/library";

export async function fetchBooks(search = ""): Promise<LibraryBookDTO[]> {
  const { data } = await axios.get<LibraryBookDTO[]>(`${BASE}?search=${search}`);
  return data;
}

export async function createBook(values: LibraryBookFormValues): Promise<LibraryBookDTO> {
  const { data } = await axios.post<LibraryBookDTO>(BASE, values);
  return data;
}

export async function updateBook(id: string, values: LibraryBookFormValues): Promise<LibraryBookDTO> {
  const { data } = await axios.patch<LibraryBookDTO>(`${BASE}/${id}`, values);
  return data;
}

export async function deleteBook(id: string): Promise<void> {
  await axios.delete(`${BASE}/${id}`);
}