"use client";

import { useState } from "react";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/core/components/ui/table";
import { Pencil, Trash2, PlusCircle, Search } from "lucide-react";
import { NoticeDialog } from "./NoticeDialog";
import { SubmitMode } from "./NoticeForm";
import { ConfirmDeleteDialog } from "./ConfirmDelete";
import { Notice } from "../types/notice.types";

type NoticePayload = Partial<Notice>;

interface NoticeTableProps {
  notices: Notice[];
  onAdd: (values: NoticePayload) => Promise<void>;
  onEdit: (id: string, values: NoticePayload, mode: SubmitMode) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  loading?: boolean;
}

export function NoticeTable({ notices, onAdd, onEdit, onDelete, loading = false }: NoticeTableProps) {
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Notice | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const filtered = notices.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async (values: NoticePayload, _mode: SubmitMode) => {
    setActionLoading(true);
    try { await onAdd(values); setAddOpen(false); } finally { setActionLoading(false); }
  };

  const handleEdit = async (values: NoticePayload, mode: SubmitMode) => {
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

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
        <Button className="bg-black hover:bg-gray-700 text-white w-full sm:w-auto" onClick={() => setAddOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Notice
        </Button>
      </div>

      <div className="hidden lg:block rounded-md border-b-4 border-t-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-black font-semibold">Title</TableHead>
              <TableHead className="text-black font-semibold">Content</TableHead>
              <TableHead className="text-black font-semibold">Date</TableHead>
              <TableHead className="text-right text-black font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">Loading...</TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">No notices found.</TableCell>
              </TableRow>
            ) : (
              filtered.map((n) => (
                <TableRow key={n.id}>
                  <TableCell className="font-medium text-black">{n.title}</TableCell>
                  <TableCell className="text-sm text-black max-w-[300px] truncate">{n.content}</TableCell>
                  <TableCell className="text-sm text-black">{formatDate(n.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost" size="icon"
                        className="bg-white text-black border border-gray-300 hover:bg-gray-100"
                        onClick={() => { setSelected(n); setEditOpen(true); }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost" size="icon"
                        className="hover:bg-red-600 border border-gray-300 text-destructive"
                        onClick={() => { setSelected(n); setDeleteOpen(true); }}
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

      <div className="lg:hidden space-y-3">
        {loading ? (
          <p className="text-center py-10 text-muted-foreground text-sm">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center py-10 text-muted-foreground text-sm">No notices found.</p>
        ) : (
          filtered.map((n) => (
            <div key={n.id} className="rounded-xl border bg-card p-4 shadow-sm space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-sm text-black">{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{n.content}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost" size="icon"
                    className="h-8 w-8 bg-white text-black border border-gray-300 hover:bg-gray-100"
                    onClick={() => { setSelected(n); setEditOpen(true); }}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost" size="icon"
                    className="h-8 w-8 border border-gray-300 text-destructive hover:bg-red-50"
                    onClick={() => { setSelected(n); setDeleteOpen(true); }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{formatDate(n.createdAt)}</p>
            </div>
          ))
        )}
      </div>

      <NoticeDialog open={addOpen} onOpenChange={setAddOpen} onSubmit={handleAdd} loading={actionLoading} isEdit={false} />
      <NoticeDialog open={editOpen} onOpenChange={setEditOpen} initialValues={selected ?? undefined} onSubmit={handleEdit} loading={actionLoading} isEdit={true} />
      <ConfirmDeleteDialog open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={handleDelete} loading={actionLoading} noticeTitle={selected?.title} />
    </div>
  );
}