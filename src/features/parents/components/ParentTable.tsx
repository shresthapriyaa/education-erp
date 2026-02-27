"use client";

import { useState } from "react";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/core/components/ui/table";
import { Pencil, Trash2, UserPlus, Search } from "lucide-react";
import { ParentDialog } from "./ParentDialog";
import { SubmitMode } from "./ParentForm";
import { ConfirmDeleteDialog } from "./ConfirmDelete";
import { Parent } from "../types/parent.types";

type ParentPayload = Partial<Parent>;

interface ParentTableProps {
  parents: Parent[];
  onAdd: (values: ParentPayload) => Promise<void>;
  onEdit: (id: string, values: ParentPayload, mode: SubmitMode) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  loading?: boolean;
}

export function ParentTable({
  parents, onAdd, onEdit, onDelete, loading = false,
}: ParentTableProps) {
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const filtered = parents.filter(
    (p) =>
      p.username.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      (p.phone ?? "").includes(search)
  );

  const handleAdd = async (values: ParentPayload, _mode: SubmitMode) => {
    setActionLoading(true);
    try {
      await onAdd(values);
      setAddOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = async (values: ParentPayload, mode: SubmitMode) => {
    if (!selectedParent) return;
    setActionLoading(true);
    try {
      await onEdit(selectedParent.id, values, mode);
      setEditOpen(false);
      setSelectedParent(null);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedParent) return;
    setActionLoading(true);
    try {
      await onDelete(selectedParent.id);
      setDeleteOpen(false);
      setSelectedParent(null);
    } finally {
      setActionLoading(false);
    }
  };

  const getImgSrc = (img?: string | null) => img ?? "/placeholder-avatar.png";

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
        <Button
          className="bg-black hover:bg-gray-700 text-white w-full sm:w-auto"
          onClick={() => setAddOpen(true)}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add Parent
        </Button>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block rounded-md border-b-4 border-t-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-black font-semibold">Parent</TableHead>
              <TableHead className="text-black font-semibold">Email</TableHead>
              <TableHead className="text-black font-semibold">Phone</TableHead>
              <TableHead className="text-black font-semibold">Address</TableHead>
              <TableHead className="text-black font-semibold">Students</TableHead>
              <TableHead className="text-right text-black font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  No parents found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((parent) => (
                <TableRow key={parent.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={getImgSrc(parent.img)}
                        alt={parent.username}
                        className="h-10 w-10 rounded-full object-cover shrink-0"
                      />
                      <div>
                        <p className="font-medium leading-none text-black">{parent.username}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{parent.id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-black">{parent.email}</TableCell>
                  <TableCell className="text-sm text-black">{parent.phone ?? "—"}</TableCell>
                  <TableCell className="text-sm text-black">{parent.address ?? "—"}</TableCell>
                  <TableCell className="text-sm text-black">
                    {parent.students?.length ?? 0} student(s)
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost" size="icon"
                        className="bg-white text-black border border-gray-300 hover:bg-gray-100"
                        onClick={() => { setSelectedParent(parent); setEditOpen(true); }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost" size="icon"
                        className="hover:bg-red-600 border border-gray-300 text-destructive"
                        onClick={() => { setSelectedParent(parent); setDeleteOpen(true); }}
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
          <p className="text-center py-10 text-muted-foreground text-sm">No parents found.</p>
        ) : (
          filtered.map((parent) => (
            <div key={parent.id} className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={getImgSrc(parent.img)}
                    alt={parent.username}
                    className="h-11 w-11 rounded-full object-cover shrink-0"
                  />
                  <div>
                    <p className="font-semibold text-sm text-black">{parent.username}</p>
                    <p className="text-xs text-muted-foreground">{parent.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost" size="icon"
                    className="h-8 w-8 bg-white text-black border border-gray-300 hover:bg-gray-100"
                    onClick={() => { setSelectedParent(parent); setEditOpen(true); }}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost" size="icon"
                    className="h-8 w-8 border border-gray-300 text-destructive hover:bg-red-50"
                    onClick={() => { setSelectedParent(parent); setDeleteOpen(true); }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-black">{parent.phone ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="text-black truncate">{parent.address ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Students</p>
                  <p className="text-black">{parent.students?.length ?? 0} student(s)</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <ParentDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={handleAdd}
        loading={actionLoading}
        isEdit={false}
      />
      <ParentDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        initialValues={selectedParent ?? undefined}
        onSubmit={handleEdit}
        loading={actionLoading}
        isEdit={true}
      />
      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        loading={actionLoading}
        parentName={selectedParent?.username}
      />
    </div>
  );
}