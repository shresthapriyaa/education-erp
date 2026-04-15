// // // "use client";

// // // import { RefreshCw, Settings } from "lucide-react";
// // // import { useRouter } from "next/navigation";
// // // import { useAttendance } from "@/features/attendance/hooks/useAttendance";
// // // import AttendanceSummary from "@/features/attendance/components/admin/AttendanceSummary";
// // // import AttendanceTable from "@/features/attendance/components/admin/AttendanceTable";

// // // export default function AdminAttendancePage() {
// // //   const router = useRouter();
// // //   const { records, stats, loading, error, refresh, editRecord, deleteRecord } =
// // //     useAttendance();

// // //   return (
// // //     <div
// // //       style={{
// // //         padding: "28px 32px",
// // //         maxWidth: 1200,
// // //         fontFamily: "'DM Sans','Segoe UI',sans-serif",
// // //       }}
// // //     >
// // //       <div
// // //         style={{
// // //           display: "flex",
// // //           justifyContent: "space-between",
// // //           alignItems: "flex-start",
// // //           marginBottom: 24,
// // //         }}
// // //       >
// // //         <div>
// // //           <p
// // //             style={{
// // //               margin: 0,
// // //               fontSize: 11,
// // //               fontWeight: 700,
// // //               textTransform: "uppercase",
// // //               letterSpacing: "0.08em",
// // //               color: "#9ca3af",
// // //             }}
// // //           >
// // //             Admin · Attendance
// // //           </p>
// // //           <h1
// // //             style={{
// // //               margin: "4px 0 0",
// // //               fontSize: 22,
// // //               fontWeight: 900,
// // //               color: "#111827",
// // //             }}
// // //           >
// // //             Attendance Records
// // //           </h1>
// // //         </div>
// // //         <div style={{ display: "flex", gap: 8 }}>
// // //           <button
// // //             onClick={() => router.push("/admin/attendance/geofence")}
// // //             style={{
// // //               display: "flex",
// // //               alignItems: "center",
// // //               gap: 6,
// // //               padding: "8px 16px",
// // //               borderRadius: 8,
// // //               border: "none",
// // //               background: "#16a34a",
// // //               color: "#fff",
// // //               fontSize: 13,
// // //               fontWeight: 600,
// // //               cursor: "pointer",
// // //             }}
// // //           >
// // //             <Settings size={14} /> Geofence Settings
// // //           </button>
// // //           <button
// // //             onClick={refresh}
// // //             style={{
// // //               display: "flex",
// // //               alignItems: "center",
// // //               gap: 6,
// // //               padding: "8px 16px",
// // //               borderRadius: 8,
// // //               border: "1.5px solid #e5e7eb",
// // //               background: "#fff",
// // //               fontSize: 13,
// // //               fontWeight: 600,
// // //               cursor: "pointer",
// // //             }}
// // //           >
// // //             <RefreshCw size={14} /> Refresh
// // //           </button>
// // //         </div>
// // //       </div>

// // //       {error && (
// // //         <div
// // //           style={{
// // //             background: "#fee2e2",
// // //             border: "1px solid #fca5a5",
// // //             borderRadius: 8,
// // //             padding: "10px 14px",
// // //             marginBottom: 16,
// // //             fontSize: 13,
// // //             color: "#dc2626",
// // //           }}
// // //         >
// // //           ⚠ {error}
// // //         </div>
// // //       )}

// // //       <AttendanceSummary stats={stats} loading={loading} />
// // //       <AttendanceTable
// // //         records={records}
// // //         loading={loading}
// // //         onEdit={editRecord}
// // //         onDelete={deleteRecord}
// // //       />
// // //     </div>
// // //   );
// // // }




// // "use client";

// // import { useState, useEffect } from "react";
// // import { RefreshCw } from "lucide-react";
// // import { useAttendance } from "@/features/attendance/hooks/useAttendance";
// // import AttendanceTable from "@/features/attendance/components/admin/AttendanceTable";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/core/components/ui/select";
// // import { Button } from "@/core/components/ui/button";
// // import { Badge } from "@/core/components/ui/badge";

// // type ClassOption = { id: string; name: string; grade: string; section: string };

// // export default function AdminAttendancePage() {
// //   const [classes, setClasses] = useState<ClassOption[]>([]);
// //   const [selectedClassId, setSelectedClassId] = useState<string>("ALL");

// //   const filters = selectedClassId !== "ALL" ? { classId: selectedClassId } : {};
// //   const { records, loading, error, refresh, editRecord, deleteRecord } =
// //     useAttendance(filters);

// //   // Fetch class list for dropdown
// //   useEffect(() => {
// //     fetch("/api/classes")
// //       .then((r) => r.json())
// //       .then((data) => setClasses(Array.isArray(data) ? data : []))
// //       .catch(() => {});
// //   }, []);

// //   const selectedClass = classes.find((c) => c.id === selectedClassId);

// //   return (
// //     <div className="p-6 space-y-6 max-w-6xl">
// //       {/* Header */}
// //       <div className="flex items-center justify-between">
// //         <div>
// //           <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
// //             Admin · Attendance
// //           </p>
// //           <h1 className="text-2xl font-bold mt-1">Attendance Records</h1>
// //           {selectedClass && (
// //             <p className="text-sm text-muted-foreground mt-0.5">
// //               Showing records for{" "}
// //               <span className="font-medium text-foreground">
// //                 {selectedClass.name}
// //               </span>
// //             </p>
// //           )}
// //         </div>
// //         <Button variant="outline" size="sm" onClick={refresh} disabled={loading}>
// //           <RefreshCw className="w-4 h-4 mr-2" />
// //           Refresh
// //         </Button>
// //       </div>

// //       {/* Error */}
// //       {error && (
// //         <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3">
// //           <p className="text-sm text-red-600">⚠ {error}</p>
// //         </div>
// //       )}

// //       {/* Filters row */}
// //       <div className="flex items-center gap-3 flex-wrap">
// //         {/* Class filter */}
// //         <Select
// //           value={selectedClassId}
// //           onValueChange={(v) => setSelectedClassId(v)}
// //         >
// //           <SelectTrigger className="w-52">
// //             <SelectValue placeholder="All classes" />
// //           </SelectTrigger>
// //           <SelectContent>
// //             <SelectItem value="ALL">All classes</SelectItem>
// //             {classes.map((c) => (
// //               <SelectItem key={c.id} value={c.id}>
// //                 {c.name}
// //               </SelectItem>
// //             ))}
// //           </SelectContent>
// //         </Select>

// //         {/* Live count badge */}
// //         {!loading && (
// //           <Badge variant="secondary">
// //             {records.length} record{records.length !== 1 ? "s" : ""}
// //           </Badge>
// //         )}
// //       </div>

// //       {/* Table */}
// //       <AttendanceTable
// //         records={records}
// //         loading={loading}
// //         onEdit={editRecord}
// //         onDelete={deleteRecord}
// //       />
// //     </div>
// //   );
// // }




"use client";

import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { useAttendance } from "@/features/attendance/hooks/useAttendance";
import AttendanceSummary from "@/features/attendance/components/admin/AttendanceSummary";
import AttendanceTable from "@/features/attendance/components/admin/AttendanceTable";

type ClassOption = { id: string; name: string };

export default function AdminAttendancePage() {
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");

  const filters = selectedClassId ? { classId: selectedClassId } : {};
  const { records, stats, loading, error, refresh, editRecord, deleteRecord } =
    useAttendance(filters);

  useEffect(() => {
    fetch("/api/classes")
      .then((r) => r.json())
      .then((data) => setClasses(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1200, fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#9ca3af" }}>
            Admin · Attendance
          </p>
          <h1 style={{ margin: "4px 0 0", fontSize: 22, fontWeight: 900, color: "#111827" }}>
            Attendance Records
          </h1>
        </div>
        <button
          onClick={refresh}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#dc2626" }}>
          ⚠ {error}
        </div>
      )}

      {/* Class filter */}
      <div style={{ marginBottom: 20 }}>
        <select
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: 8, border: "1.5px solid #e5e7eb", fontSize: 13, color: "#374151", outline: "none", background: "#fff", minWidth: 200 }}
        >
          <option value="">All classes</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <AttendanceSummary stats={stats} loading={loading} />
      <AttendanceTable
        records={records}
        loading={loading}
        onEdit={editRecord}
        onDelete={deleteRecord}
      />
    </div>
  );
}






