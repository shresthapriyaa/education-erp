"use client";

import { useState } from "react";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { Badge } from "@/core/components/ui/badge";
import { ScrollArea } from "@/core/components/ui/scroll-area";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/core/components/ui/table";
import { Pencil, Trash2, PlusCircle, Search } from "lucide-react";
import { RoutineDialog } from "./RoutineDialog";
import { SubmitMode } from "./RoutineForm";
import { Routine } from "../types/routine.types";

type RoutinePayload = Partial<Routine>;

interface ConfirmDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  loading?: boolean;
  label?: string;
}

function ConfirmDeleteDialog({ open, onOpenChange, onConfirm, loading, label }: ConfirmDeleteDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-background border rounded-lg p-6 max-w-sm w-full space-y-4 shadow-lg">
        <p className="text-sm font-medium">Delete routine{label ? ` for ${label}` : ""}?</p>
        <p className="text-xs text-muted-foreground">This action cannot be undone.</p>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
          <Button variant="destructive" size="sm" onClick={onConfirm} disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}

const DAY_ORDER = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

const DAY_COLORS: Record<string, string> = {
  MONDAY:    "bg-blue-100 text-blue-800",
  TUESDAY:   "bg-purple-100 text-purple-800",
  WEDNESDAY: "bg-green-100 text-green-800",
  THURSDAY:  "bg-yellow-100 text-yellow-800",
  FRIDAY:    "bg-orange-100 text-orange-800",
  SATURDAY:  "bg-pink-100 text-pink-800",
  SUNDAY:    "bg-red-100 text-red-800",
};

interface RoutineTableProps {
  routines: Routine[];
  onAdd?: (values: RoutinePayload) => Promise<void>;
  onEdit?: (id: string, values: RoutinePayload, mode: SubmitMode) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  loading?: boolean;
  readOnly?: boolean;
}

export function RoutineTable({ routines, onAdd, onEdit, onDelete, loading = false, readOnly = false }: RoutineTableProps) {
  const [search, setSearch]             = useState("");
  const [addOpen, setAddOpen]           = useState(false);
  const [editOpen, setEditOpen]         = useState(false);
  const [deleteOpen, setDeleteOpen]     = useState(false);
  const [selected, setSelected]         = useState<Routine | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const filtered = [...routines]
    .filter(r =>
      (r.class?.name   ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (r.subject?.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (r.teacher?.username ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (r.room ?? "").toLowerCase().includes(search.toLowerCase()) ||
      r.day.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day) || a.startTime.localeCompare(b.startTime));

  const handleAdd = async (values: RoutinePayload, _mode: SubmitMode) => {
    if (!onAdd) return;
    setActionLoading(true);
    try { await onAdd(values); setAddOpen(false); } finally { setActionLoading(false); }
  };

  const handleEdit = async (values: RoutinePayload, mode: SubmitMode) => {
    if (!selected || !onEdit) return;
    setActionLoading(true);
    try { await onEdit(selected.id, values, mode); setEditOpen(false); setSelected(null); }
    finally { setActionLoading(false); }
  };

  const handleDelete = async () => {
    if (!selected || !onDelete) return;
    setActionLoading(true);
    try { await onDelete(selected.id); setDeleteOpen(false); setSelected(null); }
    finally { setActionLoading(false); }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by class, subject, teacher or day..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
        {!readOnly && (
          <Button className="bg-black hover:bg-gray-700 text-white w-full sm:w-auto" onClick={() => setAddOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />Add Routine
          </Button>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block rounded-md border-b-4 border-t-4 overflow-hidden">
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-black font-semibold">Day</TableHead>
                <TableHead className="text-black font-semibold">Time</TableHead>
                <TableHead className="text-black font-semibold">Class</TableHead>
                <TableHead className="text-black font-semibold">Subject</TableHead>
                <TableHead className="text-black font-semibold">Teacher</TableHead>
                <TableHead className="text-black font-semibold">Room</TableHead>
                {!readOnly && <TableHead className="text-right text-black font-semibold">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={readOnly ? 6 : 7} className="text-center py-10 text-muted-foreground">Loading...</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={readOnly ? 6 : 7} className="text-center py-10 text-muted-foreground">No routines found.</TableCell></TableRow>
              ) : (
                filtered.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${DAY_COLORS[r.day] ?? ""}`}>
                        {r.day.charAt(0) + r.day.slice(1).toLowerCase()}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-black font-mono">
                      {r.startTime} — {r.endTime}
                    </TableCell>
                    <TableCell className="text-sm text-black">{r.classSubject?.class?.name ?? "—"}</TableCell>
                    <TableCell className="text-sm text-black">{r.classSubject?.subject?.name ?? "—"}</TableCell>
                    <TableCell className="text-sm text-black">{r.classSubject?.teacher?.username ?? <span className="text-muted-foreground">Unassigned</span>}</TableCell>
                    <TableCell className="text-sm text-black">{r.room ?? <span className="text-muted-foreground">—</span>}</TableCell>
                    {!readOnly && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="bg-white text-black border border-gray-300 hover:bg-gray-100"
                            onClick={() => { setSelected(r); setEditOpen(true); }}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="hover:bg-red-600 border border-gray-300 text-destructive"
                            onClick={() => { setSelected(r); setDeleteOpen(true); }}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden">
        <ScrollArea className="h-[600px]">
          <div className="space-y-3 pr-4">
            {loading ? (
              <p className="text-center py-10 text-muted-foreground text-sm">Loading...</p>
            ) : filtered.length === 0 ? (
              <p className="text-center py-10 text-muted-foreground text-sm">No routines found.</p>
            ) : (
              filtered.map((r) => (
                <div key={r.id} className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${DAY_COLORS[r.day] ?? ""}`}>
                          {r.day.charAt(0) + r.day.slice(1).toLowerCase()}
                        </span>
                        <span className="text-xs font-mono text-muted-foreground">{r.startTime} — {r.endTime}</span>
                      </div>
                      <p className="font-semibold text-sm text-black mt-1">{r.subject?.name ?? "—"}</p>
                      <p className="text-xs text-muted-foreground">{r.class?.name ?? "—"} · {r.teacher?.username ?? "Unassigned"}</p>
                      {r.room && <p className="text-xs text-muted-foreground">Room: {r.room}</p>}
                    </div>
                    {!readOnly && (
                      <div className="flex items-center gap-1 shrink-0">
                        <Button variant="ghost" size="icon" className="h-8 w-8 bg-white text-black border border-gray-300 hover:bg-gray-100"
                          onClick={() => { setSelected(r); setEditOpen(true); }}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 border border-gray-300 text-destructive hover:bg-red-50"
                          onClick={() => { setSelected(r); setDeleteOpen(true); }}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {!readOnly && <RoutineDialog open={addOpen} onOpenChange={setAddOpen} onSubmit={handleAdd} loading={actionLoading} isEdit={false} />}
      {!readOnly && <RoutineDialog open={editOpen} onOpenChange={setEditOpen} initialValues={selected ?? undefined} onSubmit={handleEdit} loading={actionLoading} isEdit={true} />}
      {!readOnly && <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        loading={actionLoading}
        label={selected ? `${selected.class?.name} — ${selected.subject?.name}` : undefined}
      />}
    </div>
  );
}