"use client";

import { useState } from "react";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { Badge } from "@/core/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/core/components/ui/table";
import { Pencil, Trash2, PlusCircle, Search } from "lucide-react";
import { GradeDialog } from "./GradeDialog";
import { ConfirmDeleteDialog } from "./ConfirmDelete";
import { SubmitMode } from "./GradeForm";
import { Grade } from "../types/grade.types";

type GradePayload = Partial<Grade> & { studentId?: string; assignmentId?: string };

interface GradeTableProps {
  grades: Grade[];
  onAdd: (values: GradePayload) => Promise<void>;
  onEdit: (id: string, values: GradePayload, mode: SubmitMode) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  loading?: boolean;
}

// Color badge based on score
const scoreColor = (score: number) => {
  if (score >= 90) return "default";
  if (score >= 75) return "secondary";
  if (score >= 50) return "outline";
  return "destructive";
};

export function GradeTable({
  grades, onAdd, onEdit, onDelete, loading = false,
}: GradeTableProps) {
  const [search,         setSearch]         = useState("");
  const [addOpen,        setAddOpen]        = useState(false);
  const [editOpen,       setEditOpen]       = useState(false);
  const [deleteOpen,     setDeleteOpen]     = useState(false);
  const [selectedGrade,  setSelectedGrade]  = useState<Grade | null>(null);
  const [actionLoading,  setActionLoading]  = useState(false);

  const filtered = grades.filter((g) =>
    (g.student?.username  ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (g.assignment?.title  ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async (values: GradePayload, _mode: SubmitMode) => {
    setActionLoading(true);
    try { await onAdd(values); setAddOpen(false); }
    finally { setActionLoading(false); }
  };

  const handleEdit = async (values: GradePayload, mode: SubmitMode) => {
    if (!selectedGrade) return;
    setActionLoading(true);
    try {
      await onEdit(selectedGrade.id, values, mode);
      setEditOpen(false);
      setSelectedGrade(null);
    } finally { setActionLoading(false); }
  };

  const handleDelete = async () => {
    if (!selectedGrade) return;
    setActionLoading(true);
    try {
      await onDelete(selectedGrade.id);
      setDeleteOpen(false);
      setSelectedGrade(null);
    } finally { setActionLoading(false); }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-GB");

  return (
    <div className="space-y-4">
      {/* Search + Add */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by student or assignment..."
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
          Add Grade
        </Button>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block rounded-md border-b-4 border-t-4 overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="text-black font-semibold w-[25%]">Student</TableHead>
              <TableHead className="text-black font-semibold w-[30%]">Assignment</TableHead>
              <TableHead className="text-black font-semibold w-[15%]">Score</TableHead>
              <TableHead className="text-black font-semibold w-[15%]">Due Date</TableHead>
              <TableHead className="text-black font-semibold w-auto">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">Loading...</TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No grades found.</TableCell>
              </TableRow>
            ) : (
              filtered.map((grade) => (
                <TableRow key={grade.id}>
                  <TableCell className="font-medium text-black truncate">
                    {grade.student?.username ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm text-black truncate">
                    {grade.assignment?.title ?? "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={scoreColor(grade.score)}>
                      {grade.score}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-black">
                    {grade.assignment?.dueDate ? formatDate(grade.assignment.dueDate) : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost" size="icon"
                        className="bg-white text-black border border-gray-300 hover:bg-gray-100"
                        onClick={() => { setSelectedGrade(grade); setEditOpen(true); }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost" size="icon"
                        className="border border-gray-300 text-destructive hover:bg-red-600"
                        onClick={() => { setSelectedGrade(grade); setDeleteOpen(true); }}
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
          <p className="text-center py-10 text-muted-foreground text-sm">No grades found.</p>
        ) : (
          filtered.map((grade) => (
            <div key={grade.id} className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-sm text-black">{grade.student?.username ?? "—"}</p>
                  <p className="text-xs text-muted-foreground mt-1">{grade.assignment?.title ?? "—"}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost" size="icon"
                    className="h-8 w-8 bg-white text-black border border-gray-300 hover:bg-gray-100"
                    onClick={() => { setSelectedGrade(grade); setEditOpen(true); }}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost" size="icon"
                    className="h-8 w-8 border border-gray-300 text-destructive hover:bg-red-50"
                    onClick={() => { setSelectedGrade(grade); setDeleteOpen(true); }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Due: {grade.assignment?.dueDate ? formatDate(grade.assignment.dueDate) : "—"}
                </p>
                <Badge variant={scoreColor(grade.score)}>{grade.score}</Badge>
              </div>
            </div>
          ))
        )}
      </div>

      <GradeDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={handleAdd}
        loading={actionLoading}
        isEdit={false}
      />
      <GradeDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        initialValues={selectedGrade ?? undefined}
        onSubmit={handleEdit}
        loading={actionLoading}
        isEdit={true}
      />

      {/* Confirm Delete */}
      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        loading={actionLoading}
        studentName={selectedGrade?.student?.username}
      />
    </div>
  );
}