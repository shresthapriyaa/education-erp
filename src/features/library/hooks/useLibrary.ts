"use client";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { LibraryBookDTO, LibraryBookFormValues } from "../types/library";

import { createBook, deleteBook, fetchBooks, updateBook } from "../services/library.api";

export function useLibrary() {
  const [books,   setBooks]   = useState<LibraryBookDTO[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (search = "") => {
    setLoading(true);
    try {
      const data = await fetchBooks(search);
      setBooks(data);
    } catch {
      toast.error("Failed to load books.");
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (values: LibraryBookFormValues) => {
    setLoading(true);
    try {
      const created = await createBook(values);
      setBooks(p => [created, ...p]);
      toast.success("Book added.");
    } catch (e: any) {
      toast.error(e?.response?.data?.error ?? "Failed to add book.");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (id: string, values: LibraryBookFormValues) => {
    setLoading(true);
    try {
      const updated = await updateBook(id, values);
      setBooks(p => p.map(b => b.id === id ? updated : b));
      toast.success("Book updated.");
    } catch (e: any) {
      toast.error(e?.response?.data?.error ?? "Failed to update book.");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await deleteBook(id);
      setBooks(p => p.filter(b => b.id !== id));
      toast.success("Book removed.");
    } catch {
      toast.error("Failed to remove book.");
    } finally {
      setLoading(false);
    }
  }, []);

  return { books, loading, load, create, update, remove };
}