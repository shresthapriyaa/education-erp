"use client";

import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { Input }  from "@/core/components/ui/input";
import { LibraryBookDialog } from "@/features/library/components/LibraryDialog";
import { LibraryBookTable }  from "@/features/library/components/LibraryTable";
import { ConfirmDelete }     from "@/features/library/components/ConfirmDelete";
import { useLibrary }        from "@/features/library/hooks/useLibrary";
import { LibraryBookDTO, LibraryBookFormValues } from "../types/library";


export default function LibraryPage() {
  const { books, loading, load, create, update, remove } = useLibrary();

  const [search,       setSearch]       = useState("");
  const [dialogOpen,   setDialogOpen]   = useState(false);
  const [editRecord,   setEditRecord]   = useState<LibraryBookDTO | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<LibraryBookDTO | null>(null);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const t = setTimeout(() => load(search), 300);
    return () => clearTimeout(t);
  }, [search, load]);

  function openCreate() { setEditRecord(undefined); setDialogOpen(true); }
  function openEdit(b: LibraryBookDTO) { setEditRecord(b); setDialogOpen(true); }

  async function handleSubmit(values: LibraryBookFormValues) {
    if (editRecord) {
      await update(editRecord.id, values);
    } else {
      await create(values);
    }
    setDialogOpen(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await remove(deleteTarget.id);
    setDeleteTarget(null);
  }

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Library</h1>
          <p className="text-muted-foreground text-sm">Manage the school book collection</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Book
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-sm">
        <div className="rounded-xl border bg-card p-4 text-center">
          <p className="text-3xl font-bold">{books.length}</p>
          <p className="text-sm text-muted-foreground mt-1">Total Books</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by title, author or ISBN…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <LibraryBookTable
        books={books}
        loading={loading}
        onEdit={openEdit}
        onDelete={b => setDeleteTarget(b)}
      />

      {/* Create / Edit dialog */}
      <LibraryBookDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        record={editRecord}
        onSubmit={handleSubmit}
        isLoading={loading}
      />

      {/* Delete confirm */}
      <ConfirmDelete
        open={!!deleteTarget}
        onOpenChange={o => !o && setDeleteTarget(null)}
        title="Remove Book?"
        description={
          deleteTarget
            ? `Permanently remove "${deleteTarget.title}" by ${deleteTarget.author}? This cannot be undone.`
            : "This action cannot be undone."
        }
        onConfirm={handleDelete}
        isLoading={loading}
      />
    </div>
  );
}