// features/schoolzones/components/SchoolZoneTable.tsx
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
// import { SchoolZoneDialog } from "./SchoolZoneDialog";
import { SchoolZonePayload, SubmitMode } from "./SchoolzoneForm";
import { ConfirmDeleteDialog } from "./ConfirmDelete";

import { SchoolZoneDialog } from "./SchoolzoneDialog";
import { SchoolZone } from "../types/Schoolzone.types";

interface SchoolZoneTableProps {
  zones: SchoolZone[];
  onAdd: (values: SchoolZonePayload) => Promise<void>;
  onEdit: (id: string, values: SchoolZonePayload, mode: SubmitMode) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  loading?: boolean;
}

export function SchoolZoneTable({
  zones, onAdd, onEdit, onDelete, loading = false,
}: SchoolZoneTableProps) {
  const [search,       setSearch]       = useState("");
  const [addOpen,      setAddOpen]      = useState(false);
  const [editOpen,     setEditOpen]     = useState(false);
  const [deleteOpen,   setDeleteOpen]   = useState(false);
  const [selected,     setSelected]     = useState<SchoolZone | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const filtered = zones.filter((z) =>
    z.name.toLowerCase().includes(search.toLowerCase()) ||
    (z.school?.name ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async (values: SchoolZonePayload, _mode: SubmitMode) => {
    setActionLoading(true);
    try { await onAdd(values); setAddOpen(false); }
    finally { setActionLoading(false); }
  };

  const handleEdit = async (values: SchoolZonePayload, mode: SubmitMode) => {
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

  return (
    <div className="space-y-4">
      {/* Search + Add */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by zone or school name..."
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
          Add Zone
        </Button>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block rounded-md border-b-4 border-t-4 overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="text-black font-semibold w-[20%]">Zone Name</TableHead>
              <TableHead className="text-black font-semibold w-[20%]">School</TableHead>
              <TableHead className="text-black font-semibold w-[15%]">Radius (m)</TableHead>
              <TableHead className="text-black font-semibold w-[15%]">Color</TableHead>
              <TableHead className="text-black font-semibold w-[15%]">Status</TableHead>
              <TableHead className="text-black font-semibold w-auto">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">Loading...</TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No zones found.</TableCell>
              </TableRow>
            ) : (
              filtered.map((zone) => (
                <TableRow key={zone.id}>
                  <TableCell className="font-medium text-black">{zone.name}</TableCell>
                  <TableCell className="text-sm text-black">{zone.school?.name ?? "—"}</TableCell>
                  <TableCell className="text-sm text-black">{zone.radiusMeters}m</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-4 w-4 rounded-full border"
                        style={{ backgroundColor: zone.color ?? "#3B82F6" }}
                      />
                      <span className="text-xs text-muted-foreground">{zone.color ?? "—"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={zone.isActive ? "default" : "secondary"}>
                      {zone.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost" size="icon"
                        className="bg-white text-black border border-gray-300 hover:bg-gray-100"
                        onClick={() => { setSelected(zone); setEditOpen(true); }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost" size="icon"
                        className="border border-gray-300 text-destructive hover:bg-red-600"
                        onClick={() => { setSelected(zone); setDeleteOpen(true); }}
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
          <p className="text-center py-10 text-muted-foreground text-sm">No zones found.</p>
        ) : (
          filtered.map((zone) => (
            <div key={zone.id} className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-sm text-black">{zone.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{zone.school?.name ?? "—"}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost" size="icon"
                    className="h-8 w-8 bg-white text-black border border-gray-300 hover:bg-gray-100"
                    onClick={() => { setSelected(zone); setEditOpen(true); }}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost" size="icon"
                    className="h-8 w-8 border border-gray-300 text-destructive hover:bg-red-50"
                    onClick={() => { setSelected(zone); setDeleteOpen(true); }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full border" style={{ backgroundColor: zone.color ?? "#3B82F6" }} />
                  <span className="text-xs text-muted-foreground">{zone.radiusMeters}m radius</span>
                </div>
                <Badge variant={zone.isActive ? "default" : "secondary"}>
                  {zone.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          ))
        )}
      </div>

      <SchoolZoneDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={handleAdd}
        loading={actionLoading}
        isEdit={false}
      />
      <SchoolZoneDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        initialValues={selected ?? undefined}
        onSubmit={handleEdit}
        loading={actionLoading}
        isEdit={true}
      />
      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        loading={actionLoading}
        zoneName={selected?.name}
      />
    </div>
  );
}