"use client";

import { Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { Badge }  from "@/core/components/ui/badge";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/core/components/ui/table";
import type { SessionDTO } from "../types/session.types";

interface SessionTableProps {
  sessions: SessionDTO[];
  loading:  boolean;
  onEdit:   (session: SessionDTO) => void;
  onDelete: (session: SessionDTO) => void;
  onToggle: (session: SessionDTO) => void;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString([], {
    weekday: "short", month: "short", day: "numeric", year: "numeric",
  });
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit", minute: "2-digit",
  });
}

export function SessionTable({
  sessions, loading, onEdit, onDelete, onToggle,
}: SessionTableProps) {
  return (
    <div className="rounded-xl border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Class</TableHead>
            <TableHead>School</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                Loading…
              </TableCell>
            </TableRow>
          )}

          {!loading && sessions.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                No sessions found.
              </TableCell>
            </TableRow>
          )}

          {!loading && sessions.map(s => (
            <TableRow key={s.id}>
              <TableCell className="font-medium">{s.class.name}</TableCell>
              <TableCell className="text-muted-foreground">{s.school.name}</TableCell>
              <TableCell>{fmtDate(s.date)}</TableCell>
              <TableCell className="tabular-nums">
                {fmtTime(s.startTime)}
                {s.endTime ? ` — ${fmtTime(s.endTime)}` : ""}
              </TableCell>
              <TableCell>
                <Badge variant={s.isOpen ? "default" : "secondary"}>
                  {s.isOpen ? "Open" : "Closed"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    title={s.isOpen ? "Close session" : "Open session"}
                    onClick={() => onToggle(s)}
                  >
                    {s.isOpen
                      ? <ToggleRight className="h-4 w-4 text-emerald-600" />
                      : <ToggleLeft  className="h-4 w-4 text-muted-foreground" />}
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => onEdit(s)}>
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