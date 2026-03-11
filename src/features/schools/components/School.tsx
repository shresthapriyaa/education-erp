"use client";

import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { SchoolDialog } from "@/features/schools/components/SchoolDialog";
import { SchoolTable } from "@/features/schools/components/SchoolTable";
import { ConfirmDelete } from "@/features/schools/components/ConfirmDelete";
import { useSchools } from "@/features/schools/hooks/useSchool";
import type {
  SchoolDTO,
  SchoolFormValues,
} from "@/features/schools/types/school.types";

export default function SchoolsPage() {
  const { schools, loading, load, create, update, remove } = useSchools();

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<SchoolDTO | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<SchoolDTO | null>(null);

  useEffect(() => {
    load();
  }, [load]);

  // client-side search filter
  const filtered = schools.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.address ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  function openCreate() {
    setEditRecord(undefined);
    setDialogOpen(true);
  }
  function openEdit(s: SchoolDTO) {
    setEditRecord(s);
    setDialogOpen(true);
  }

  async function handleSubmit(values: SchoolFormValues) {
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
          <h1 className="text-2xl font-bold">Schools</h1>
          <p className="text-muted-foreground text-sm">
            Manage schools and their GPS attendance zones
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add School
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-sm">
        <div className="rounded-xl border bg-card p-4 text-center">
          <p className="text-3xl font-bold">{schools.length}</p>
          <p className="text-sm text-muted-foreground mt-1">Total Schools</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search schools…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <SchoolTable
        schools={filtered}
        loading={loading}
        onEdit={openEdit}
        onDelete={(s) => setDeleteTarget(s)}
      />

      {/* Create / Edit dialog */}
      <SchoolDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        record={editRecord}
        onSubmit={handleSubmit}
        isLoading={loading}
      />

      {/* Delete confirm */}
      <ConfirmDelete
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete School?"
        description={
          deleteTarget
            ? `Permanently delete "${deleteTarget.name}"? All sessions linked to this school will also be affected.`
            : "This action cannot be undone."
        }
        onConfirm={handleDelete}
        isLoading={loading}
      />
    </div>
  );
}
