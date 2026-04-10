"use client";

import { useState } from "react";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/core/components/ui/table";
import { Pencil, Trash2, PlusCircle, Search } from "lucide-react";
import { SubjectDialog } from "./SubjectDialog";
import { SubmitMode } from "./SubjectForm";
import { ConfirmDeleteDialog } from "./ConfirmDelete";
import { Subject } from "../types/subject.types";

type SubjectPayload = Partial<Subject>;

interface SubjectTableProps {
  subjects: Subject[];
  onAdd: (values: SubjectPayload) => Promise<void>;
  onEdit: (id: string, values: SubjectPayload, mode: SubmitMode) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  loading?: boolean;
}

export function SubjectTable({
  subjects, onAdd, onEdit, onDelete, loading = false,
}: SubjectTableProps) {
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const filtered = subjects.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.code?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (s.description?.toLowerCase() || "").includes(search.toLowerCase())
  );

  const handleAdd = async (values: SubjectPayload, _mode: SubmitMode) => {
    setActionLoading(true);
    try {
      await onAdd(values);
      setAddOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = async (values: SubjectPayload, mode: SubmitMode) => {
    if (!selectedSubject) return;
    setActionLoading(true);
    try {
      await onEdit(selectedSubject.id, values, mode);
      setEditOpen(false);
      setSelectedSubject(null);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedSubject) return;
    setActionLoading(true);
    try {
      await onDelete(selectedSubject.id);
      setDeleteOpen(false);
      setSelectedSubject(null);
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
            placeholder="Search by name or description..."
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
          Add Subject
        </Button>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block rounded-md border-b-4 border-t-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-black font-semibold">Name</TableHead>
              <TableHead className="text-black font-semibold">Code</TableHead>
              <TableHead className="text-black font-semibold">Description</TableHead>
              <TableHead className="text-black font-semibold">Created</TableHead>
              <TableHead className="text-right text-black font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  No subjects found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell className="font-medium text-black">{subject.name}</TableCell>
                  <TableCell className="text-sm text-black">
                    {subject.code ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {subject.code}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs">No code</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-black max-w-[300px] truncate">
                    {subject.description || <span className="text-muted-foreground text-xs">No description</span>}
                  </TableCell>
                  <TableCell className="text-sm text-black">{formatDate(subject.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost" size="icon"
                        className="bg-white text-black border border-gray-300 hover:bg-gray-100"
                        onClick={() => { setSelectedSubject(subject); setEditOpen(true); }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost" size="icon"
                        className="hover:bg-red-600 border border-gray-300 text-destructive"
                        onClick={() => { setSelectedSubject(subject); setDeleteOpen(true); }}
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
          <p className="text-center py-10 text-muted-foreground text-sm">No subjects found.</p>
        ) : (
          filtered.map((subject) => (
            <div key={subject.id} className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-semibold text-sm text-black">{subject.name}</p>
                  {subject.code && (
                    <p className="text-xs mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {subject.code}
                      </span>
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {subject.description || "No description"}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost" size="icon"
                    className="h-8 w-8 bg-white text-black border border-gray-300 hover:bg-gray-100"
                    onClick={() => { setSelectedSubject(subject); setEditOpen(true); }}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost" size="icon"
                    className="h-8 w-8 border border-gray-300 text-destructive hover:bg-red-50"
                    onClick={() => { setSelectedSubject(subject); setDeleteOpen(true); }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Created: {formatDate(subject.createdAt)}</p>
            </div>
          ))
        )}
      </div>

      <SubjectDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={handleAdd}
        loading={actionLoading}
        isEdit={false}
      />
      <SubjectDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        initialValues={selectedSubject ?? undefined}
        onSubmit={handleEdit}
        loading={actionLoading}
        isEdit={true}
      />
      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        loading={actionLoading}
        subjectName={selectedSubject?.name}
      />
    </div>
  );
}