"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/core/components/ui/table";
import { LibraryBookDTO } from "../types/library";


interface LibraryBookTableProps {
  books:    LibraryBookDTO[];
  loading:  boolean;
  onEdit:   (book: LibraryBookDTO) => void;
  onDelete: (book: LibraryBookDTO) => void;
}

export function LibraryBookTable({ books, loading, onEdit, onDelete }: LibraryBookTableProps) {
  return (
    <div className="rounded-xl border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>ISBN</TableHead>
            <TableHead>Published</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                Loading…
              </TableCell>
            </TableRow>
          )}

          {!loading && books.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                No books found. Add your first book to get started.
              </TableCell>
            </TableRow>
          )}

          {!loading && books.map(b => (
            <TableRow key={b.id}>
              <TableCell className="font-medium">{b.title}</TableCell>
              <TableCell className="text-muted-foreground">{b.author}</TableCell>
              <TableCell className="tabular-nums text-muted-foreground">{b.isbn}</TableCell>
              <TableCell>
                {new Date(b.publishedDate).toLocaleDateString([], {
                  year: "numeric", month: "short", day: "numeric",
                })}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Button size="icon" variant="ghost" onClick={() => onEdit(b)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onDelete(b)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}