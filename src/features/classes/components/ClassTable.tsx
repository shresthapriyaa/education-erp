"use client";

import { useState } from "react";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/core/components/ui/table";
import { Pencil, Trash2, PlusCircle, Search, Trash } from "lucide-react";
import { ClassDialog } from "./ClassDialog";
import { SubmitMode } from "./ClassForm";
import { ConfirmDeleteDialog } from "./ConfirmDelete";
import { Class } from "../types/class.types";
import { Checkbox } from "@/core/components/ui/checkbox";

type ClassPayload = Omit<Partial<Class>, "subjects"> & { 
  teacherId?: string;
  subjects?: Array<{
    subjectId: string;
    teacherId: string | null;
  }>;
};

interface ClassTableProps {
  classes: Class[];
  onAdd: (values: ClassPayload) => Promise<void>;
  onEdit: (id: string, values: ClassPayload, mode: SubmitMode) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  loading?: boolean;
  onRefresh?: () => void;
  onUpdateClass?: (updatedClass: Class) => void;
}

export function ClassTable({
  classes, onAdd, onEdit, onDelete, loading = false, onRefresh, onUpdateClass,
}: ClassTableProps) {
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const filtered = classes.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.grade.toLowerCase().includes(search.toLowerCase()) ||
      c.section.toLowerCase().includes(search.toLowerCase()) ||
      (c.classTeacher?.username ?? "").toLowerCase().includes(search.toLowerCase())
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
      
      // Immediately fetch fresh data for this specific class
      const response = await fetch(`/api/classes/${selectedClass.id}?_t=${Date.now()}`);
      if (response.ok) {
        const updatedClass = await response.json();
        // Update the specific class in the parent state
        if (onUpdateClass) {
          onUpdateClass(updatedClass);
        }
      }
      
      setEditOpen(false);
      setSelectedClass(null);
    } catch (error) {
      console.error('Error editing class:', error);
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

  const handleBulkDelete = async () => {
    setActionLoading(true);
    try {
      await Promise.all(Array.from(selectedIds).map(id => onDelete(id)));
      setBulkDeleteOpen(false);
      setSelectedIds(new Set());
    } finally {
      setActionLoading(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(c => c.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
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
        {selectedIds.size > 0 && (
          <Button
            variant="destructive"
            className="w-full sm:w-auto"
            onClick={() => setBulkDeleteOpen(true)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete {selectedIds.size} {selectedIds.size === 1 ? 'Class' : 'Classes'}
          </Button>
        )}
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
              <TableHead className="w-12">
                <Checkbox
                  checked={filtered.length > 0 && selectedIds.size === filtered.length}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead className="text-black font-semibold">Grade</TableHead>
              <TableHead className="text-black font-semibold">Section</TableHead>
              <TableHead className="text-black font-semibold">Academic Year</TableHead>
              <TableHead className="text-black font-semibold">Class Teacher</TableHead>
              <TableHead className="text-black font-semibold">Students</TableHead>
              <TableHead className="text-black font-semibold">Subjects</TableHead>
              <TableHead className="text-right text-black font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  No classes found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(c.id)}
                      onCheckedChange={() => toggleSelect(c.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-black">{c.grade}</TableCell>
                  <TableCell className="font-medium text-black">{c.section}</TableCell>
                  <TableCell className="text-sm text-black">{c.academicYear}</TableCell>
                  <TableCell className="text-sm text-black">
                    {c.classTeacher?.username ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {c.classTeacher.username}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Not assigned</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-black">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {c._count?.students || 0}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-black">
                    {c.subjects && c.subjects.length > 0 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {c.subjects.length}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs">0</span>
                    )}
                  </TableCell>
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
                <div className="flex items-start gap-3 flex-1">
                  <Checkbox
                    checked={selectedIds.has(c.id)}
                    onCheckedChange={() => toggleSelect(c.id)}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-black">{c.grade} - {c.section}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Academic Year: {c.academicYear}
                    </p>
                    {c.classTeacher ? (
                      <p className="text-xs mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Teacher: {c.classTeacher.username}
                        </span>
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-1">No teacher assigned</p>
                    )}
                    <p className="text-xs mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {c._count?.students || 0}
                      </span>
                    </p>
                    {c.subjects && c.subjects.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {c.subjects.map((cs: any, idx: number) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                          >
                            {cs.subject.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
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
            </div>
          ))
        )}
      </div>

      <ClassDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={handleAdd as any}
        loading={actionLoading}
        isEdit={false}
      />
      <ClassDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        initialValues={selectedClass ?? undefined}
        onSubmit={handleEdit as any}
        loading={actionLoading}
        isEdit={true}
        onClose={onRefresh}
      />
      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        loading={actionLoading}
        className={selectedClass ? `${selectedClass.grade} - ${selectedClass.section}` : undefined}
      />
      <ConfirmDeleteDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        onConfirm={handleBulkDelete}
        loading={actionLoading}
        className={`${selectedIds.size} ${selectedIds.size === 1 ? 'class' : 'classes'}`}
      />
    </div>
  );
}