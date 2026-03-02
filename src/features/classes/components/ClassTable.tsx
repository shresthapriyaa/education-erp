"use client";

import { useState } from "react";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/core/components/ui/table";
import { Pencil, Trash2, PlusCircle, Search } from "lucide-react";
import { ClassDialog } from "./ClassDialog";
import { SubmitMode } from "./ClassForm";
import { ConfirmDeleteDialog } from "./ConfirmDelete";
import { Class } from "../types/class.types";

type ClassPayload = Partial<Class> & { teacherId?: string };

interface ClassTableProps {
  classes: Class[];
  onAdd: (values: ClassPayload) => Promise<void>;
  onEdit: (id: string, values: ClassPayload, mode: SubmitMode) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  loading?: boolean;
}

export function ClassTable({
  classes, onAdd, onEdit, onDelete, loading = false,
}: ClassTableProps) {
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const filtered = classes.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.teacher?.username ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async (values: ClassPayload, _mode: SubmitMode) => {
    setActionLoading(true);
    try {
      await onAdd(values);
      setAddOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = async (values: ClassPayload, mode: SubmitMode) => {
    if (!selectedClass) return;
    setActionLoading(true);
    try {
      await onEdit(selectedClass.id, values, mode);
      setEditOpen(false);
      setSelectedClass(null);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedClass) return;
    setActionLoading(true);
    try {
      await onDelete(selectedClass.id);
      setDeleteOpen(false);
      setSelectedClass(null);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString("en-GB");

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by class name or teacher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
        <Button
          className="bg-black hover:bg-gray-700 text-white w-full sm:w-auto"
          onClick={() => setAddOpen(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Class
        </Button>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block rounded-md border-b-4 border-t-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-black font-semibold">Class Name</TableHead>
              <TableHead className="text-black font-semibold">Teacher</TableHead>
              <TableHead className="text-black font-semibold">Created</TableHead>
              <TableHead className="text-right text-black font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                  No classes found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium text-black">{c.name}</TableCell>
                  <TableCell className="text-sm text-black">
                    {c.teacher?.username ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm text-black">{formatDate(c.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost" size="icon"
                        className="bg-white text-black border border-gray-300 hover:bg-gray-100"
                        onClick={() => { setSelectedClass(c); setEditOpen(true); }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost" size="icon"
                        className="hover:bg-red-600 border border-gray-300 text-destructive"
                        onClick={() => { setSelectedClass(c); setDeleteOpen(true); }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {loading ? (
          <p className="text-center py-10 text-muted-foreground text-sm">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center py-10 text-muted-foreground text-sm">No classes found.</p>
        ) : (
          filtered.map((c) => (
            <div key={c.id} className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-sm text-black">{c.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Teacher: {c.teacher?.username ?? "—"}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost" size="icon"
                    className="h-8 w-8 bg-white text-black border border-gray-300 hover:bg-gray-100"
                    onClick={() => { setSelectedClass(c); setEditOpen(true); }}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost" size="icon"
                    className="h-8 w-8 border border-gray-300 text-destructive hover:bg-red-50"
                    onClick={() => { setSelectedClass(c); setDeleteOpen(true); }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Created: {formatDate(c.createdAt)}</p>
            </div>
          ))
        )}
      </div>

      <ClassDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={handleAdd}
        loading={actionLoading}
        isEdit={false}
      />
      <ClassDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        initialValues={selectedClass ?? undefined}
        onSubmit={handleEdit}
        loading={actionLoading}
        isEdit={true}
      />
      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        loading={actionLoading}
        className={selectedClass?.name}
      />
    </div>
  );
}