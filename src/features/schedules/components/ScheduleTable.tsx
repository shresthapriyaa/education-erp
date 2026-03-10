"use client";

import { useState } from "react";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { Badge } from "@/core/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/core/components/ui/table";
import { Pencil, Trash2, PlusCircle, Search } from "lucide-react";
import { ScheduleDialog } from "./ScheduleDialog";
import { SubmitMode } from "./ScheduleForm";
import { ConfirmDeleteDialog } from "./ConfirmDelete";
import { Schedule } from "../types/schedule.types";

type SchedulePayload = Partial<Schedule> & { classId?: string; subjectId?: string };

interface ScheduleTableProps {
  schedules: Schedule[];
  onAdd: (values: SchedulePayload) => Promise<void>;
  onEdit: (id: string, values: SchedulePayload, mode: SubmitMode) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  loading?: boolean;
}

const dayColor = (day: string): "default" | "secondary" | "outline" | "destructive" => {
  const map: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
    MONDAY: "default", TUESDAY: "secondary", WEDNESDAY: "outline",
    THURSDAY: "default", FRIDAY: "secondary", SATURDAY: "destructive", SUNDAY: "destructive",
  };
  return map[day] ?? "outline";
};

export function ScheduleTable({ schedules, onAdd, onEdit, onDelete, loading = false }: ScheduleTableProps) {
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Schedule | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const filtered = schedules.filter(
    (s) =>
      (s.class?.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (s.subject?.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      s.day.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async (values: SchedulePayload, _mode: SubmitMode) => {
    setActionLoading(true);
    try { await onAdd(values); setAddOpen(false); } finally { setActionLoading(false); }
  };

  const handleEdit = async (values: SchedulePayload, mode: SubmitMode) => {
    if (!selected) return;
    setActionLoading(true);
    try {
      await onEdit(selected.id, values, mode);
      setEditOpen(false);
      setSelected(null);
    } finally { setActionLoading(false); }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setActionLoading(true);
    try {
      await onDelete(selected.id);
      setDeleteOpen(false);
      setSelected(null);
    } finally { setActionLoading(false); }
  };

  const formatTime = (val: string) => {
    const d = new Date(val);
    return isNaN(d.getTime()) ? val : d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by class, subject or day..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
        <Button className="bg-black hover:bg-gray-700 text-white w-full sm:w-auto" onClick={() => setAddOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Schedule
        </Button>
      </div>

      <div className="hidden lg:block rounded-md border-b-4 border-t-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-black font-semibold">Class</TableHead>
              <TableHead className="text-black font-semibold">Subject</TableHead>
              <TableHead className="text-black font-semibold">Day</TableHead>
              <TableHead className="text-black font-semibold">Start</TableHead>
              <TableHead className="text-black font-semibold">End</TableHead>
              <TableHead className="text-right text-black font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">Loading...</TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No schedules found.</TableCell>
              </TableRow>
            ) : (
              filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium text-black">{s.class?.name ?? "—"}</TableCell>
                  <TableCell className="text-sm text-black">{s.subject?.name ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant={dayColor(s.day)}>{s.day}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-black">{formatTime(s.startTime)}</TableCell>
                  <TableCell className="text-sm text-black">{formatTime(s.endTime)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="bg-white text-black border border-gray-300 hover:bg-gray-100" onClick={() => { setSelected(s); setEditOpen(true); }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="hover:bg-red-600 border border-gray-300 text-destructive" onClick={() => { setSelected(s); setDeleteOpen(true); }}>
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

      <div className="lg:hidden space-y-3">
        {loading ? (
          <p className="text-center py-10 text-muted-foreground text-sm">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center py-10 text-muted-foreground text-sm">No schedules found.</p>
        ) : (
          filtered.map((s) => (
            <div key={s.id} className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-sm text-black">{s.class?.name ?? "—"}</p>
                  <p className="text-xs text-muted-foreground">{s.subject?.name ?? "—"}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8 bg-white text-black border border-gray-300 hover:bg-gray-100" onClick={() => { setSelected(s); setEditOpen(true); }}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 border border-gray-300 text-destructive hover:bg-red-50" onClick={() => { setSelected(s); setDeleteOpen(true); }}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{formatTime(s.startTime)} — {formatTime(s.endTime)}</p>
                <Badge variant={dayColor(s.day)}>{s.day}</Badge>
              </div>
            </div>
          ))
        )}
      </div>

      <ScheduleDialog open={addOpen} onOpenChange={setAddOpen} onSubmit={handleAdd} loading={actionLoading} isEdit={false} />
      <ScheduleDialog open={editOpen} onOpenChange={setEditOpen} initialValues={selected ?? undefined} onSubmit={handleEdit} loading={actionLoading} isEdit={true} />
      <ConfirmDeleteDialog open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={handleDelete} loading={actionLoading} />
    </div>
  );
}