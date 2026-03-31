// // "use client";

// // export default function AdminAttendancePage() {
// //   return (
// //     <div>
// //       <h1>Admin Attendance</h1>
// //     </div>
// //   );
// // }




// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { AttendanceTable }        from "./AttendanceTable";
// import { AttendanceSummaryCards } from "./AttendanceSummary";
// import { AttendanceDialog }       from "./AttendanceDialog";
// import { ConfirmDelete }          from "./ConfirmDelete";
// import { Button }                 from "@/core/components/ui/button";
// import { Plus, RefreshCw, Search, Filter } from "lucide-react";
// import type {
//   AttendanceRecord,
//   AttendanceSummary,
//   AttendanceDTO,
//   AttendanceFormValues,
//   AttendanceStatus,
// } from "../types/attendance.types";

// // ─── helpers ──────────────────────────────────────────────────────

// function toRecord(dto: AttendanceDTO): AttendanceRecord {
//   return {
//     id:          dto.id,
//     studentId:   dto.student?.id    ?? "",
//     studentName: dto.student?.username ?? "Unknown",
//     rollNo:      dto.student?.id    ?? "",
//     date:        dto.date?.slice(0, 10) ?? "",
//     time:        dto.markedAt
//       ? new Date(dto.markedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//       : "—",
//     status:  (dto.status as AttendanceStatus) ?? "Absent",
//     method:  dto.withinSchool != null ? "Geofence" : "Manual",
//     latitude:  dto.markedLatitude  ?? undefined,
//     longitude: dto.markedLongitude ?? undefined,
//     distanceFromSchool: dto.distanceFromCenter ?? undefined,
//   };
// }

// function calcSummary(records: AttendanceRecord[]): AttendanceSummary {
//   const total   = records.length;
//   const present = records.filter(r => r.status === "Present").length;
//   const absent  = records.filter(r => r.status === "Absent").length;
//   const late    = records.filter(r => r.status === "Late").length;
//   return {
//     total,
//     present,
//     absent,
//     late,
//     percentage: total > 0 ? Math.round(((present + late) / total) * 100) : 0,
//   };
// }

// // ─── Component ────────────────────────────────────────────────────

// export default function AdminAttendancePage() {
//   const [records,  setRecords]  = useState<AttendanceRecord[]>([]);
//   const [dtoMap,   setDtoMap]   = useState<Record<string, AttendanceDTO>>({});
//   const [loading,  setLoading]  = useState(true);
//   const [search,   setSearch]   = useState("");
//   const [dateFrom, setDateFrom] = useState("");
//   const [dateTo,   setDateTo]   = useState("");

//   // dialog state
//   const [dialogOpen,   setDialogOpen]   = useState(false);
//   const [dialogMode,   setDialogMode]   = useState<"create" | "edit">("create");
//   const [editRecord,   setEditRecord]   = useState<AttendanceDTO | undefined>();
//   const [saving,       setSaving]       = useState(false);

//   // delete state
//   const [deleteOpen,   setDeleteOpen]   = useState(false);
//   const [deleteId,     setDeleteId]     = useState<string | null>(null);
//   const [deleting,     setDeleting]     = useState(false);

//   // ── fetch ────────────────────────────────────────────────────────
//   const fetchRecords = useCallback(async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams({ pageSize: "100" });
//       if (search)   params.set("search",   search);
//       if (dateFrom) params.set("dateFrom", dateFrom);
//       if (dateTo)   params.set("dateTo",   dateTo);

//       const res  = await fetch(`/api/attendance?${params}`);
//       const data = await res.json();

//       const dtos: AttendanceDTO[] = data.records ?? [];
//       const map: Record<string, AttendanceDTO> = {};
//       dtos.forEach(d => { map[d.id] = d; });

//       setDtoMap(map);
//       setRecords(dtos.map(toRecord));
//     } catch (err) {
//       console.error("Failed to fetch attendance", err);
//     } finally {
//       setLoading(false);
//     }
//   }, [search, dateFrom, dateTo]);

//   useEffect(() => { fetchRecords(); }, [fetchRecords]);

//   // ── create / edit ────────────────────────────────────────────────
//   function openCreate() {
//     setEditRecord(undefined);
//     setDialogMode("create");
//     setDialogOpen(true);
//   }

//   function openEdit(record: AttendanceRecord) {
//     setEditRecord(dtoMap[record.id]);
//     setDialogMode("edit");
//     setDialogOpen(true);
//   }

//   async function handleSave(values: AttendanceFormValues) {
//     setSaving(true);
//     try {
//       const isEdit = dialogMode === "edit" && editRecord;
//       const url    = isEdit
//         ? `/api/attendance/${editRecord!.id}`
//         : "/api/attendance";

//       await fetch(url, {
//         method:  isEdit ? "PATCH" : "POST",
//         headers: { "Content-Type": "application/json" },
//         body:    JSON.stringify({ ...values, isManualOverride: true }),
//       });

//       setDialogOpen(false);
//       fetchRecords();
//     } finally {
//       setSaving(false);
//     }
//   }

//   // ── delete ───────────────────────────────────────────────────────
//   function openDelete(record: AttendanceRecord) {
//     setDeleteId(record.id);
//     setDeleteOpen(true);
//   }

//   async function handleDelete() {
//     if (!deleteId) return;
//     setDeleting(true);
//     try {
//       await fetch(`/api/attendance/${deleteId}`, { method: "DELETE" });
//       setDeleteOpen(false);
//       setDeleteId(null);
//       fetchRecords();
//     } finally {
//       setDeleting(false);
//     }
//   }

//   const summary = calcSummary(records);

//   return (
//     <div className="p-6 space-y-6 max-w-6xl mx-auto">

//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
//           <p className="text-sm text-gray-500 mt-0.5">Manage and review student attendance records</p>
//         </div>
//         <div className="flex gap-2">
//           <Button variant="outline" size="sm" onClick={fetchRecords}>
//             <RefreshCw size={14} className="mr-2" /> Refresh
//           </Button>
//           <Button size="sm" onClick={openCreate}>
//             <Plus size={14} className="mr-2" /> Add Record
//           </Button>
//         </div>
//       </div>

//       {/* Summary Cards */}
//       <AttendanceSummaryCards summary={summary} loading={loading} showWarning={false} />

//       {/* Filters */}
//       <div className="flex flex-wrap gap-3 items-center">
//         <div className="relative flex-1 min-w-[200px]">
//           <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search student..."
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//             className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <div className="flex items-center gap-2">
//           <Filter size={14} className="text-gray-400" />
//           <input
//             type="date"
//             value={dateFrom}
//             onChange={e => setDateFrom(e.target.value)}
//             className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <span className="text-gray-400 text-sm">to</span>
//           <input
//             type="date"
//             value={dateTo}
//             onChange={e => setDateTo(e.target.value)}
//             className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         {(search || dateFrom || dateTo) && (
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => { setSearch(""); setDateFrom(""); setDateTo(""); }}
//           >
//             Clear
//           </Button>
//         )}
//       </div>

//       {/* Table */}
//       <AttendanceTable
//         records={records}
//         loading={loading}
//         showStudent
//         showMethod
//       />

//       {/* Create / Edit Dialog */}
//       <AttendanceDialog
//         open={dialogOpen}
//         onOpenChange={setDialogOpen}
//         mode={dialogMode}
//         record={editRecord}
//         saving={saving}
//         onSave={handleSave}
//       />

//       {/* Delete Dialog */}
//       <ConfirmDelete
//         open={deleteOpen}
//         onOpenChange={setDeleteOpen}
//         onConfirm={handleDelete}
//         loading={deleting}
//       />
//     </div>
//   );
// }


"use client";

import { useState, useEffect, useCallback } from "react";
import { AttendanceTable }        from "./AttendanceTable";
import { AttendanceSummaryCards } from "./AttendanceSummary";
import { AttendanceDialog }       from "./AttendanceDialog";
import { ConfirmDelete }          from "./ConfirmDelete";
import { Button }                 from "@/core/components/ui/button";
import { Plus, RefreshCw, Search, Filter } from "lucide-react";
import type {
  AttendanceRecord,
  AttendanceSummary,
  AttendanceDTO,
  AttendanceFormValues,
  AttendanceStatus,
} from "../types/attendance.types";

// ─── helpers ──────────────────────────────────────────────────────

function toRecord(dto: AttendanceDTO): AttendanceRecord {
  return {
    id:          dto.id,
    studentId:   dto.student?.id    ?? "",
    studentName: dto.student?.username ?? "Unknown",
    rollNo:      dto.student?.id    ?? "",
    date:        dto.date?.slice(0, 10) ?? "",
    time:        dto.markedAt
      ? new Date(dto.markedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "—",
    status:  (dto.status as AttendanceStatus) ?? "Absent",
    method:  dto.withinSchool != null ? "Geofence" : "Manual",
    latitude:  dto.markedLatitude  ?? undefined,
    longitude: dto.markedLongitude ?? undefined,
    distanceFromSchool: dto.distanceFromCenter ?? undefined,
  };
}

function calcSummary(records: AttendanceRecord[]): AttendanceSummary {
  const total   = records.length;
  const present = records.filter(r => r.status === "Present").length;
  const absent  = records.filter(r => r.status === "Absent").length;
  const late    = records.filter(r => r.status === "Late").length;
  return {
    total,
    present,
    absent,
    late,
    percentage: total > 0 ? Math.round(((present + late) / total) * 100) : 0,
  };
}

// ─── Component ────────────────────────────────────────────────────

export default function AdminAttendancePage() {
  const [records,  setRecords]  = useState<AttendanceRecord[]>([]);
  const [dtoMap,   setDtoMap]   = useState<Record<string, AttendanceDTO>>({});
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo,   setDateTo]   = useState("");

  // dialog state
  const [dialogOpen,   setDialogOpen]   = useState(false);
  const [dialogMode,   setDialogMode]   = useState<"create" | "edit">("create");
  const [editRecord,   setEditRecord]   = useState<AttendanceDTO | undefined>();
  const [saving,       setSaving]       = useState(false);

  // delete state
  const [deleteOpen,   setDeleteOpen]   = useState(false);
  const [deleteId,     setDeleteId]     = useState<string | null>(null);
  const [deleting,     setDeleting]     = useState(false);

  // ── fetch ────────────────────────────────────────────────────────
  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ pageSize: "100" });
      if (search)   params.set("search",   search);
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo)   params.set("dateTo",   dateTo);

      const res  = await fetch(`/api/attendance?${params}`);
      const data = await res.json();

      const dtos: AttendanceDTO[] = data.records ?? [];
      const map: Record<string, AttendanceDTO> = {};
      dtos.forEach(d => { map[d.id] = d; });

      setDtoMap(map);
      setRecords(dtos.map(toRecord));
    } catch (err) {
      console.error("Failed to fetch attendance", err);
    } finally {
      setLoading(false);
    }
  }, [search, dateFrom, dateTo]);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  // ── create / edit ────────────────────────────────────────────────
  function openCreate() {
    setEditRecord(undefined);
    setDialogMode("create");
    setDialogOpen(true);
  }

  function openEdit(record: AttendanceRecord) {
    setEditRecord(dtoMap[record.id]);
    setDialogMode("edit");
    setDialogOpen(true);
  }

  async function handleSave(values: AttendanceFormValues) {
    setSaving(true);
    try {
      const isEdit = dialogMode === "edit" && editRecord;
      const url    = isEdit
        ? `/api/attendance/${editRecord!.id}`
        : "/api/attendance";

      await fetch(url, {
        method:  isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ ...values, isManualOverride: true }),
      });

      setDialogOpen(false);
      fetchRecords();
    } finally {
      setSaving(false);
    }
  }

  // ── delete ───────────────────────────────────────────────────────
  function openDelete(record: AttendanceRecord) {
    setDeleteId(record.id);
    setDeleteOpen(true);
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await fetch(`/api/attendance/${deleteId}`, { method: "DELETE" });
      setDeleteOpen(false);
      setDeleteId(null);
      fetchRecords();
    } finally {
      setDeleting(false);
    }
  }

  const summary = calcSummary(records);

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage and review student attendance records</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchRecords}>
            <RefreshCw size={14} className="mr-2" /> Refresh
          </Button>
          <Button size="sm" onClick={openCreate}>
            <Plus size={14} className="mr-2" /> Add Record
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <AttendanceSummaryCards summary={summary} loading={loading} showWarning={false} />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search student..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-gray-400" />
          <input
            type="date"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-gray-400 text-sm">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {(search || dateFrom || dateTo) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setSearch(""); setDateFrom(""); setDateTo(""); }}
          >
            Clear
          </Button>
        )}
      </div>

      {/* Table */}
      <AttendanceTable
        records={records}
        loading={loading}
        showStudent
        showMethod
      />

      {/* Create / Edit Dialog */}
      <AttendanceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        record={editRecord}
        saving={saving}
        onSave={handleSave}
      />

      {/* Delete Dialog */}
      <ConfirmDelete
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}