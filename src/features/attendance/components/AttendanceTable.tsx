// // "use client";
// // import {
// //   Table, TableBody, TableCell, TableHead,
// //   TableHeader, TableRow,
// // } from "@/core/components/ui/table";
// // import { Badge }    from "@/core/components/ui/badge";
// // import { Button }   from "@/core/components/ui/button";
// // import { Skeleton } from "@/core/components/ui/skeleton";
// // import {
// //   DropdownMenu, DropdownMenuContent, DropdownMenuItem,
// //   DropdownMenuSeparator, DropdownMenuTrigger,
// // } from "@/core/components/ui/dropdown-menu";
// // import {
// //   Shield, AlertTriangle, MoreHorizontal,
// //   Pencil, Trash2, Eye, MapPin,
// // } from "lucide-react";
// // import { fmtDist } from "@/core/lib/haversine";
// // import type { AttendanceDTO, AttendanceStatus } from "../types/attendance.types";
// // const STATUS_BADGE: Record<
// //   AttendanceStatus,
// //   { variant: "default" | "secondary" | "destructive" | "outline"; label: string }
// // > = {
// //   PRESENT: { variant: "default",     label: "Present" },
// //   LATE:    { variant: "secondary",   label: "Late"    },
// //   ABSENT:  { variant: "destructive", label: "Absent"  },
// //   EXCUSED: { variant: "outline",     label: "Excused" },
// // };
// // interface AttendanceTableProps {
// //   records:   AttendanceDTO[];
// //   loading?:  boolean;
// //   isAdmin?:  boolean;
// //   onView?:   (record: AttendanceDTO) => void;
// //   onEdit?:   (record: AttendanceDTO) => void;
// //   onDelete?: (record: AttendanceDTO) => void;
// // }
// // function SkeletonRows({ count = 5 }: { count?: number }) {
// //   return (
// //     <>
// //       {Array.from({ length: count }).map((_, i) => (
// //         <TableRow key={i}>
// //           {Array.from({ length: 6 }).map((_, j) => (
// //             <TableCell key={j}>
// //               <Skeleton className="h-4 w-full" />
// //             </TableCell>
// //           ))}
// //         </TableRow>
// //       ))}
// //     </>
// //   );
// // }
// // export function AttendanceTable({
// //   records, loading, isAdmin, onView, onEdit, onDelete,
// // }: AttendanceTableProps) {

// //   if (!loading && records.length === 0) {
// //     return (
// //       <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
// //         <Shield size={32} className="opacity-20" />
// //         <p className="text-sm">No attendance records found.</p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="rounded-xl border overflow-hidden">
// //       <Table>
// //         <TableHeader>
// //           <TableRow className="bg-muted/40 hover:bg-muted/40">
// //             <TableHead className="w-[130px]">Date</TableHead>
// //             <TableHead>Student</TableHead>
// //             <TableHead>Class</TableHead>
// //             <TableHead className="w-[90px]">Status</TableHead>
// //             <TableHead>Zone</TableHead>
// //             <TableHead className="w-[100px]">Distance</TableHead>
// //             <TableHead className="w-[80px]">On Campus</TableHead>
// //             {isAdmin && <TableHead className="w-[50px]" />}
// //           </TableRow>
// //         </TableHeader>

// //         <TableBody>
// //           {loading ? (
// //             <SkeletonRows count={8} />
// //           ) : (
// //             records.map(rec => {
// //               const badge = STATUS_BADGE[rec.status];
// //               return (
// //                 <TableRow
// //                   key={rec.id}
// //                   className={onView ? "cursor-pointer" : ""}
// //                   onClick={() => onView?.(rec)}
// //                 >
// //                   {/* Date */}
// //                   <TableCell className="text-sm tabular-nums">
// //                     <div className="font-medium">
// //                       {new Date(rec.date).toLocaleDateString([], {
// //                         month: "short", day: "numeric", year: "2-digit",
// //                       })}
// //                     </div>
// //                     {rec.session && (
// //                       <div className="text-xs text-muted-foreground">
// //                         {new Date(rec.session.startTime).toLocaleTimeString([], {
// //                           hour: "2-digit", minute: "2-digit",
// //                         })}
// //                       </div>
// //                     )}
// //                   </TableCell>

// //                   {/* Student */}
// //                   <TableCell>
// //                     <div className="text-sm font-medium">{rec.student.username}</div>
// //                     <div className="text-xs text-muted-foreground">{rec.student.email}</div>
// //                   </TableCell>

// //                   {/* Class */}
// //                   <TableCell>
// //                     <div className="text-sm">
// //                       {rec.session?.class.name ?? "—"}
// //                     </div>
// //                   </TableCell>

// //                   {/* Status */}
// //                   <TableCell>
// //                     <Badge variant={badge.variant}>{badge.label}</Badge>
// //                   </TableCell>

// //                   {/* Zone */}
// //                   <TableCell>
// //                     {rec.detectedZone ? (
// //                       <div className="flex items-center gap-1.5">
// //                         <span
// //                           className="w-2 h-2 rounded-full shrink-0"
// //                           style={{ background: rec.detectedZone.color ?? "#94a3b8" }}
// //                         />
// //                         <span className="text-sm">{rec.detectedZone.name}</span>
// //                       </div>
// //                     ) : (
// //                       <span className="text-xs text-muted-foreground">—</span>
// //                     )}
// //                   </TableCell>

// //                   {/* Distance */}
// //                   <TableCell>
// //                     {rec.distanceFromCenter != null ? (
// //                       <div className="flex items-center gap-1 text-sm font-mono">
// //                         <MapPin size={11} className="text-muted-foreground" />
// //                         {fmtDist(rec.distanceFromCenter)}
// //                       </div>
// //                     ) : "—"}
// //                   </TableCell>

                
// //                   <TableCell>
// //                     {rec.withinSchool ? (
// //                       <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
// //                         <Shield size={12} /> Yes
// //                       </div>
// //                     ) : (
// //                       <div className="flex items-center gap-1 text-destructive text-xs font-medium">
// //                         <AlertTriangle size={12} /> No
// //                       </div>
// //                     )}
// //                   </TableCell>

                 
// //                   {isAdmin && (
// //                     <TableCell onClick={e => e.stopPropagation()}>
// //                       <DropdownMenu>
// //                         <DropdownMenuTrigger asChild>
// //                           <Button variant="ghost" size="icon" className="h-7 w-7">
// //                             <MoreHorizontal size={14} />
// //                           </Button>
// //                         </DropdownMenuTrigger>
// //                         <DropdownMenuContent align="end">
// //                           {onView && (
// //                             <DropdownMenuItem onClick={() => onView(rec)}>
// //                               <Eye size={13} className="mr-2" /> View
// //                             </DropdownMenuItem>
// //                           )}
// //                           {onEdit && (
// //                             <DropdownMenuItem onClick={() => onEdit(rec)}>
// //                               <Pencil size={13} className="mr-2" /> Edit
// //                             </DropdownMenuItem>
// //                           )}
// //                           {onDelete && (
// //                             <>
// //                               <DropdownMenuSeparator />
// //                               <DropdownMenuItem
// //                                 className="text-destructive focus:text-destructive"
// //                                 onClick={() => onDelete(rec)}
// //                               >
// //                                 <Trash2 size={13} className="mr-2" /> Delete
// //                               </DropdownMenuItem>
// //                             </>
// //                           )}
// //                         </DropdownMenuContent>
// //                       </DropdownMenu>
// //                     </TableCell>
// //                   )}
// //                 </TableRow>
// //               );
// //             })
// //           )}
// //         </TableBody>
// //       </Table>
// //     </div>
// //   );
// // }






// "use client";

// import { useState } from "react";
// import type { AttendanceRecord, AttendanceStatus } from "../types/attendance.types";

// interface AttendanceTableProps {
//   records: AttendanceRecord[];
//   loading?: boolean;
//   showStudent?: boolean;   
//   showMethod?: boolean;    
// }

// const STATUS_STYLES: Record<AttendanceStatus, string> = {
//   Present: "bg-green-100 text-green-700",
//   Absent: "bg-red-100 text-red-700",
//   Late: "bg-yellow-100 text-yellow-700",
// };

// export function AttendanceTable({
//   records,
//   loading = false,
//   showStudent = false,
//   showMethod = true,
// }: AttendanceTableProps) {
//   const [filter, setFilter] = useState<AttendanceStatus | "All">("All");

//   const filtered =
//     filter === "All" ? records : records.filter((r) => r.status === filter);

//   if (loading) {
//     return (
//       <div className="space-y-2">
//         {[...Array(5)].map((_, i) => (
//           <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
//         ))}
//       </div>
//     );
//   }

//   return (
//     <div>
//       {/* Filter Tabs */}
//       <div className="flex gap-2 mb-4">
//         {(["All", "Present", "Absent", "Late"] as const).map((f) => (
//           <button
//             key={f}
//             onClick={() => setFilter(f)}
//             className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
//               filter === f
//                 ? "bg-blue-600 text-white"
//                 : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//             }`}
//           >
//             {f}
//             <span className="ml-1 text-xs opacity-70">
//               ({f === "All" ? records.length : records.filter((r) => r.status === f).length})
//             </span>
//           </button>
//         ))}
//       </div>

//       {/* Table */}
//       {filtered.length === 0 ? (
//         <div className="text-center py-12 text-gray-400 text-sm">
//           No records found
//         </div>
//       ) : (
//         <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
//           <table className="w-full text-sm">
//             <thead className="bg-gray-50 border-b border-gray-200">
//               <tr>
//                 {showStudent && (
//                   <th className="text-left px-4 py-3 text-gray-500 font-medium">Student</th>
//                 )}
//                 <th className="text-left px-4 py-3 text-gray-500 font-medium">Date</th>
//                 <th className="text-left px-4 py-3 text-gray-500 font-medium">Time</th>
//                 {showMethod && (
//                   <th className="text-left px-4 py-3 text-gray-500 font-medium">Method</th>
//                 )}
//                 <th className="text-center px-4 py-3 text-gray-500 font-medium">Status</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {filtered.map((record) => (
//                 <tr key={record.id} className="hover:bg-gray-50">
//                   {showStudent && (
//                     <td className="px-4 py-3">
//                       <p className="font-medium">{record.studentName}</p>
//                       <p className="text-xs text-gray-400">Roll #{record.rollNo}</p>
//                     </td>
//                   )}
//                   <td className="px-4 py-3 text-gray-700">{record.date}</td>
//                   <td className="px-4 py-3 text-gray-500">{record.time}</td>
//                   {showMethod && (
//                     <td className="px-4 py-3">
//                       <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
//                         {record.method}
//                       </span>
//                     </td>
//                   )}
//                   <td className="px-4 py-3 text-center">
//                     <span
//                       className={`text-xs font-semibold px-3 py-1 rounded-full ${
//                         STATUS_STYLES[record.status]
//                       }`}
//                     >
//                       {record.status}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }




"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { AttendanceRecord, AttendanceStatus } from "../types/attendance.types";

interface AttendanceTableProps {
  records:    AttendanceRecord[];
  loading?:   boolean;
  showStudent?: boolean;
  showMethod?:  boolean;
  onEdit?:    (record: AttendanceRecord) => void;
  onDelete?:  (record: AttendanceRecord) => void;
}

const STATUS_STYLES: Record<AttendanceStatus, string> = {
  Present: "bg-green-100 text-green-700",
  Absent:  "bg-red-100 text-red-700",
  Late:    "bg-yellow-100 text-yellow-700",
};

export function AttendanceTable({
  records,
  loading     = false,
  showStudent = false,
  showMethod  = true,
  onEdit,
  onDelete,
}: AttendanceTableProps) {
  const [filter, setFilter] = useState<AttendanceStatus | "All">("All");

  const filtered =
    filter === "All" ? records : records.filter(r => r.status === filter);

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4">
        {(["All", "Present", "Absent", "Late"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f}
            <span className="ml-1 text-xs opacity-70">
              ({f === "All" ? records.length : records.filter(r => r.status === f).length})
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">
          No records found
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {showStudent && (
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Student</th>
                )}
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Date</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Time</th>
                {showMethod && (
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Method</th>
                )}
                <th className="text-center px-4 py-3 text-gray-500 font-medium">Status</th>
                {(onEdit || onDelete) && (
                  <th className="text-center px-4 py-3 text-gray-500 font-medium">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(record => (
                <tr key={record.id} className="hover:bg-gray-50">
                  {showStudent && (
                    <td className="px-4 py-3">
                      <p className="font-medium">{record.studentName}</p>
                      <p className="text-xs text-gray-400">Roll #{record.rollNo}</p>
                    </td>
                  )}
                  <td className="px-4 py-3 text-gray-700">{record.date}</td>
                  <td className="px-4 py-3 text-gray-500">{record.time}</td>
                  {showMethod && (
                    <td className="px-4 py-3">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {record.method}
                      </span>
                    </td>
                  )}
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_STYLES[record.status]}`}>
                      {record.status}
                    </span>
                  </td>
                  {(onEdit || onDelete) && (
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(record)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(record)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}