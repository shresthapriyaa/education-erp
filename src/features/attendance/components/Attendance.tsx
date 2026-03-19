"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react"; //  real session
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import { Badge } from "@/core/components/ui/badge";
import {
  Plus,
  Search,
  X,
  Filter,
  ChevronLeft,
  ChevronRight,
  BarChart3,
} from "lucide-react";
import {
  AttendanceTable,
  AttendanceDialog,
  ConfirmDelete,
} from "@/features/attendance/components";
import { useAttendance } from "@/features/attendance/hooks/useAttendance";
import { useAttendanceFilters } from "@/features/attendance/hooks/useAttendanceFilters";
import type {
  AttendanceDTO,
  AttendanceFormValues,
  AttendanceStatus,
} from "@/features/attendance/types/attendance.types";

const STATUS_OPTIONS: { value: AttendanceStatus | ""; label: string }[] = [
  { value: "", label: "All Statuses" },
  { value: "PRESENT", label: "Present" },
  { value: "LATE", label: "Late" },
  { value: "ABSENT", label: "Absent" },
  { value: "EXCUSED", label: "Excused" },
];

type DialogMode = "create" | "edit" | null;

export default function AdminAttendancePage() {
  const { data: session, status: authStatus } = useSession(); // ✅ real auth

  const {
    records,
    summary,
    totalRecords,
    listLoading,
    listError,
    saving,
    deleting,
    loadList,
    create,
    update,
    remove,
  } = useAttendance(); // ✅ no userId needed — backend uses getServerSession

  const {
    filters,
    setStatus,
    setDateFrom,
    setDateTo,
    setPage,
    setPageSize,
    resetFilters,
    localSearch,
    setLocalSearch,
    commitSearch,
    handleSearchKeyDown,
    hasActiveFilters,
    activeFilterCount,
    pageSizeOptions,
  } = useAttendanceFilters();

  // ✅ stable dep — individual filter values instead of JSON.stringify
  useEffect(() => {
    if (authStatus === "authenticated") {
      loadList(filters);
    }
  }, [
    authStatus,
    filters.status,
    filters.dateFrom,
    filters.dateTo,
    filters.search,
    filters.page,
    filters.pageSize,
  ]);

  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [editRecord, setEditRecord] = useState<AttendanceDTO | null>(null);
  const [deleteRecord, setDeleteRecord] = useState<AttendanceDTO | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const openCreate = () => {
    setEditRecord(null);
    setDialogMode("create");
  };
  const openEdit = (r: AttendanceDTO) => {
    setEditRecord(r);
    setDialogMode("edit");
  };
  const openDelete = (r: AttendanceDTO) => {
    setDeleteRecord(r);
    setDeleteOpen(true);
  };

  const handleSave = async (values: AttendanceFormValues) => {
    if (dialogMode === "create") {
      await create(values);
    } else if (dialogMode === "edit" && editRecord) {
      await update(editRecord.id, values);
    }
    setDialogMode(null);
    loadList(filters);
  };

  const handleDelete = async (id: string) => {
    await remove(id);
    loadList(filters);
  };

  const totalPages = Math.ceil(totalRecords / filters.pageSize);
  const currentPage = filters.page;

  // ✅ Show loading state while session is loading
  if (authStatus === "loading") {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent border-primary" />
      </div>
    );
  }

  // ✅ Guard — only ADMIN and TEACHER can see this page
  if (!session || !["ADMIN", "TEACHER"].includes(session.user.role)) {
    return (
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <p className="text-destructive">
          You do not have permission to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage and review all attendance records
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={15} className="mr-2" /> Add Record
        </Button>
      </div>

      {/* Summary cards */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {(["PRESENT", "LATE", "ABSENT", "EXCUSED"] as const).map((s) => (
            <Card key={s} className="text-center">
              <CardContent className="pt-4 pb-3">
                <p className="text-2xl font-bold">{summary[s]}</p>
                <p className="text-xs text-muted-foreground mt-0.5 uppercase tracking-wide">
                  {s.toLowerCase()}
                </p>
              </CardContent>
            </Card>
          ))}
          <Card className="text-center bg-primary/5 border-primary/20">
            <CardContent className="pt-4 pb-3">
              <p
                className={`text-2xl font-bold ${
                  summary.attendanceRate >= 75
                    ? "text-emerald-600"
                    : summary.attendanceRate >= 50
                      ? "text-amber-500"
                      : "text-destructive"
                }`}
              >
                {summary.attendanceRate}%
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center justify-center gap-1">
                <BarChart3 size={10} /> Rate
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Filter size={14} />
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-1">
                {activeFilterCount}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="Search student…"
                className="pl-9"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                onBlur={commitSearch}
              />
            </div>

            <Select
              value={filters.status || "__all__"}
              onValueChange={(v) =>
                setStatus(v === "__all__" ? "" : (v as AttendanceStatus))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value || "__all__"}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />

            <Input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="mt-3 h-7 text-muted-foreground"
            >
              <X size={12} className="mr-1.5" /> Clear filters
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Table */}
      <div className="space-y-3">
        {listError && (
          <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
            {listError}
          </div>
        )}

        <AttendanceTable
          records={records}
          loading={listLoading}
          isAdmin
          onEdit={openEdit}
          onDelete={openDelete}
        />

        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2 flex-wrap gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                {(currentPage - 1) * filters.pageSize + 1}–
                {Math.min(currentPage * filters.pageSize, totalRecords)} of{" "}
                {totalRecords}
              </span>
              <Select
                value={String(filters.pageSize)}
                onValueChange={(v) => setPageSize(Number(v))}
              >
                <SelectTrigger className="h-7 w-[90px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pageSizeOptions.map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} / page
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setPage(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                <ChevronLeft size={14} />
              </Button>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pg = i + Math.max(1, currentPage - 2);
                if (pg > totalPages) return null;
                return (
                  <Button
                    key={pg}
                    variant={pg === currentPage ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8 text-xs"
                    onClick={() => setPage(pg)}
                  >
                    {pg}
                  </Button>
                );
              })}

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        )}
      </div>

      <AttendanceDialog
        open={dialogMode !== null}
        onOpenChange={(open) => {
          if (!open) setDialogMode(null);
        }}
        mode={dialogMode ?? "create"}
        record={editRecord ?? undefined}
        saving={saving}
        onSave={handleSave}
      />

      <ConfirmDelete
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        record={deleteRecord}
        onConfirm={handleDelete}
      />
    </div>
  );
}
