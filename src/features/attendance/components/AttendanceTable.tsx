"use client";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/core/components/ui/table";
import { Badge }    from "@/core/components/ui/badge";
import { Button }   from "@/core/components/ui/button";
import { Skeleton } from "@/core/components/ui/skeleton";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/core/components/ui/dropdown-menu";
import {
  Shield, AlertTriangle, MoreHorizontal,
  Pencil, Trash2, Eye, MapPin,
} from "lucide-react";
import { fmtDist } from "@/core/lib/haversine";
import type { AttendanceDTO, AttendanceStatus } from "../types/attendance.types";
const STATUS_BADGE: Record<
  AttendanceStatus,
  { variant: "default" | "secondary" | "destructive" | "outline"; label: string }
> = {
  PRESENT: { variant: "default",     label: "Present" },
  LATE:    { variant: "secondary",   label: "Late"    },
  ABSENT:  { variant: "destructive", label: "Absent"  },
  EXCUSED: { variant: "outline",     label: "Excused" },
};
interface AttendanceTableProps {
  records:   AttendanceDTO[];
  loading?:  boolean;
  isAdmin?:  boolean;
  onView?:   (record: AttendanceDTO) => void;
  onEdit?:   (record: AttendanceDTO) => void;
  onDelete?: (record: AttendanceDTO) => void;
}
function SkeletonRows({ count = 5 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: 6 }).map((_, j) => (
            <TableCell key={j}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
export function AttendanceTable({
  records, loading, isAdmin, onView, onEdit, onDelete,
}: AttendanceTableProps) {

  if (!loading && records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
        <Shield size={32} className="opacity-20" />
        <p className="text-sm">No attendance records found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="w-[130px]">Date</TableHead>
            <TableHead>Student</TableHead>
            <TableHead>Class</TableHead>
            <TableHead className="w-[90px]">Status</TableHead>
            <TableHead>Zone</TableHead>
            <TableHead className="w-[100px]">Distance</TableHead>
            <TableHead className="w-[80px]">On Campus</TableHead>
            {isAdmin && <TableHead className="w-[50px]" />}
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <SkeletonRows count={8} />
          ) : (
            records.map(rec => {
              const badge = STATUS_BADGE[rec.status];
              return (
                <TableRow
                  key={rec.id}
                  className={onView ? "cursor-pointer" : ""}
                  onClick={() => onView?.(rec)}
                >
                  {/* Date */}
                  <TableCell className="text-sm tabular-nums">
                    <div className="font-medium">
                      {new Date(rec.date).toLocaleDateString([], {
                        month: "short", day: "numeric", year: "2-digit",
                      })}
                    </div>
                    {rec.session && (
                      <div className="text-xs text-muted-foreground">
                        {new Date(rec.session.startTime).toLocaleTimeString([], {
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </div>
                    )}
                  </TableCell>

                  {/* Student */}
                  <TableCell>
                    <div className="text-sm font-medium">{rec.student.username}</div>
                    <div className="text-xs text-muted-foreground">{rec.student.email}</div>
                  </TableCell>

                  {/* Class */}
                  <TableCell>
                    <div className="text-sm">
                      {rec.session?.class.name ?? "—"}
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </TableCell>

                  {/* Zone */}
                  <TableCell>
                    {rec.detectedZone ? (
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ background: rec.detectedZone.color ?? "#94a3b8" }}
                        />
                        <span className="text-sm">{rec.detectedZone.name}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  {/* Distance */}
                  <TableCell>
                    {rec.distanceFromCenter != null ? (
                      <div className="flex items-center gap-1 text-sm font-mono">
                        <MapPin size={11} className="text-muted-foreground" />
                        {fmtDist(rec.distanceFromCenter)}
                      </div>
                    ) : "—"}
                  </TableCell>

                
                  <TableCell>
                    {rec.withinSchool ? (
                      <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
                        <Shield size={12} /> Yes
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-destructive text-xs font-medium">
                        <AlertTriangle size={12} /> No
                      </div>
                    )}
                  </TableCell>

                 
                  {isAdmin && (
                    <TableCell onClick={e => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreHorizontal size={14} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {onView && (
                            <DropdownMenuItem onClick={() => onView(rec)}>
                              <Eye size={13} className="mr-2" /> View
                            </DropdownMenuItem>
                          )}
                          {onEdit && (
                            <DropdownMenuItem onClick={() => onEdit(rec)}>
                              <Pencil size={13} className="mr-2" /> Edit
                            </DropdownMenuItem>
                          )}
                          {onDelete && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => onDelete(rec)}
                              >
                                <Trash2 size={13} className="mr-2" /> Delete
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}