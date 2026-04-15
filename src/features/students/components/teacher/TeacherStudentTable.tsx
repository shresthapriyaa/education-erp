"use client";

import { useState } from "react";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/core/components/ui/table";
import { Badge } from "@/core/components/ui/badge";
import { Trash2, UserPlus, Search, Upload, Download } from "lucide-react";
import { TeacherStudentDialog } from "./TeacherStudentDialog";
import { BulkImportDialog } from "./BulkImportDialog";
import { ConfirmDeleteDialog } from "../ConfirmDelete";
import { Student } from "../../types/student.types";

interface TeacherStudentTableProps {
  students: Student[];
  loading: boolean;
  onAdd?: (values: any) => Promise<void>;
  onBulkImport?: (file: File) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  readOnly?: boolean;
}

export function TeacherStudentTable({
  students, loading, onAdd, onBulkImport, onDelete, readOnly = false
}: TeacherStudentTableProps) {
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const filtered = students.filter(s =>
    s.username.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    (s.phone ?? "").includes(search)
  );

  const handleAdd = async (values: any) => {
    if (!onAdd) return;
    setActionLoading(true);
    try {
      await onAdd(values);
      setAddOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleImport = async (file: File) => {
    if (!onBulkImport) return;
    setActionLoading(true);
    try {
      await onBulkImport(file);
      setImportOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedStudent || !onDelete) return;
    setActionLoading(true);
    try {
      await onDelete(selectedStudent.id);
      setDeleteOpen(false);
      setSelectedStudent(null);
    } finally {
      setActionLoading(false);
    }
  };

  const downloadTemplate = () => {
    const csv = "username,email,sex,phone,address,bloodGroup,dateOfBirth\nJohn Doe,john@example.com,MALE,1234567890,123 Street,A+,2010-01-15";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student_template.csv";
    a.click();
  };

  const formatDate = (date?: string | null) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-GB");
  };

  const AvatarCell = ({ img, username }: { img?: string | null; username: string }) => {
    return img ? (
      <img src={img} alt={username} className="h-10 w-10 rounded-full object-cover shrink-0" />
    ) : (
      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
        <span className="text-sm font-semibold text-gray-600">
          {username.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
        {!readOnly && (
          <>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={downloadTemplate}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Template
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setImportOpen(true)}
            >
              <Upload className="mr-2 h-4 w-4" />
              Bulk Import
            </Button>
            <Button
              className="bg-black hover:bg-gray-700 text-white w-full sm:w-auto"
              onClick={() => setAddOpen(true)}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block rounded-md border-b-4 border-t-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-black font-semibold">Student</TableHead>
              <TableHead className="text-black font-semibold">Email</TableHead>
              <TableHead className="text-black font-semibold">Sex</TableHead>
              <TableHead className="text-black font-semibold">Blood Group</TableHead>
              <TableHead className="text-black font-semibold">Date of Birth</TableHead>
              <TableHead className="text-black font-semibold">Phone</TableHead>
              {!readOnly && <TableHead className="text-right text-black font-semibold">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={readOnly ? 6 : 7} className="text-center py-10 text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={readOnly ? 6 : 7} className="text-center py-10 text-muted-foreground">
                  No students found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <AvatarCell img={student.img} username={student.username} />
                      <div>
                        <p className="font-medium leading-none text-black">{student.username}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{student.id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-black">{student.email}</TableCell>
                  <TableCell>
                    <Badge variant={student.sex === "MALE" ? "default" : "secondary"}>
                      {student.sex.charAt(0) + student.sex.slice(1).toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {student.bloodGroup ? <Badge variant="outline">{student.bloodGroup}</Badge> : "—"}
                  </TableCell>
                  <TableCell className="text-sm text-black">{formatDate(student.dateOfBirth)}</TableCell>
                  <TableCell className="text-sm text-black">{student.phone ?? "—"}</TableCell>
                  {!readOnly && (
                    <TableCell className="text-right">
                      <Button
                        variant="ghost" size="icon"
                        className="hover:bg-red-600 border border-gray-300 text-destructive"
                        onClick={() => { setSelectedStudent(student); setDeleteOpen(true); }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  )}
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
          <p className="text-center py-10 text-muted-foreground text-sm">No students found.</p>
        ) : (
          filtered.map((student) => (
            <div key={student.id} className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <AvatarCell img={student.img} username={student.username} />
                  <div>
                    <p className="font-semibold text-sm text-black">{student.username}</p>
                    <p className="text-xs text-muted-foreground">{student.email}</p>
                  </div>
                </div>
                {!readOnly && (
                  <Button
                    variant="ghost" size="icon"
                    className="h-8 w-8 border border-gray-300 text-destructive hover:bg-red-50"
                    onClick={() => { setSelectedStudent(student); setDeleteOpen(true); }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Sex</p>
                  <Badge variant={student.sex === "MALE" ? "default" : "secondary"} className="mt-0.5">
                    {student.sex.charAt(0) + student.sex.slice(1).toLowerCase()}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Blood Group</p>
                  {student.bloodGroup ? <Badge variant="outline" className="mt-0.5">{student.bloodGroup}</Badge> : <p className="text-black">—</p>}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date of Birth</p>
                  <p className="text-black">{formatDate(student.dateOfBirth)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-black">{student.phone ?? "—"}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {!readOnly && <TeacherStudentDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={handleAdd}
        loading={actionLoading}
      />}
      {!readOnly && <BulkImportDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        onImport={handleImport}
        loading={actionLoading}
      />}
      {!readOnly && <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        loading={actionLoading}
        studentName={selectedStudent?.username}
      />}
    </div>
  );
}
