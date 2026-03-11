"use client";

import { Pencil, Trash2, MapPin } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/components/ui/table";
import type { SchoolDTO } from "../types/school.types";

interface SchoolTableProps {
  schools: SchoolDTO[];
  loading: boolean;
  onEdit: (school: SchoolDTO) => void;
  onDelete: (school: SchoolDTO) => void;
}

export function SchoolTable({
  schools,
  loading,
  onEdit,
  onDelete,
}: SchoolTableProps) {
  return (
    <div className="rounded-xl border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Coordinates</TableHead>
            <TableHead>Radius</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-10 text-muted-foreground"
              >
                Loading…
              </TableCell>
            </TableRow>
          )}

          {!loading && schools.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-10 text-muted-foreground"
              >
                No schools found. Add your first school to get started.
              </TableCell>
            </TableRow>
          )}

          {!loading &&
            schools.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {s.address ?? (
                    <span className="italic text-muted-foreground/60">
                      No address
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm tabular-nums text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {s.latitude.toFixed(4)}, {s.longitude.toFixed(4)}
                  </div>
                </TableCell>
                <TableCell>{s.radiusMeters}m</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onEdit(s)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => onDelete(s)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
