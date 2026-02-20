// "use client";

// import { useState } from "react";
// import { Button } from "@/core/components/ui/button";
// import { Input } from "@/core/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/core/components/ui/table";
// import { Badge } from "@/core/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/core/components/ui/avatar";
// import { Pencil, Trash2, UserPlus, Search } from "lucide-react";
// import { StudentDialog } from "./StudentDialog";
// import { SubmitMode } from "./StudentForm";
// import { ConfirmDeleteDialog } from "./ConfirmDelete";
// import { Student } from "../types/student.types";

// type StudentPayload = Partial<Student> & { password?: string };

// interface StudentTableProps {
//   students: Student[];
//   onAdd: (values: StudentPayload) => Promise<void>;
//   onEdit: (id: string, values: StudentPayload, mode: SubmitMode) => Promise<void>;
//   onDelete: (id: string) => Promise<void>;
//   loading?: boolean;
// }

// export function StudentTable({
//   students,
//   onAdd,
//   onEdit,
//   onDelete,
//   loading = false,
// }: StudentTableProps) {
//   const [search, setSearch] = useState("");
//   const [addOpen, setAddOpen] = useState(false);
//   const [editOpen, setEditOpen] = useState(false);
//   const [deleteOpen, setDeleteOpen] = useState(false);
//   const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
//   const [actionLoading, setActionLoading] = useState(false);

//   const filtered = students.filter(
//     (s) =>
//       s.username.toLowerCase().includes(search.toLowerCase()) ||
//       s.email.toLowerCase().includes(search.toLowerCase()) ||
//       (s.phone ?? "").includes(search) ||
//       (s.address ?? "").toLowerCase().includes(search.toLowerCase())
//   );

//   const handleAdd = async (values: StudentPayload, _mode: SubmitMode) => {
//     setActionLoading(true);
//     try {
//       await onAdd(values);
//       setAddOpen(false);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleEdit = async (values: StudentPayload, mode: SubmitMode) => {
//     if (!selectedStudent) return;
//     setActionLoading(true);
//     try {
//       await onEdit(selectedStudent.id, values, mode);
//       setEditOpen(false);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (!selectedStudent) return;
//     setActionLoading(true);
//     try {
//       await onDelete(selectedStudent.id);
//       setDeleteOpen(false);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const formatDate = (date?: string | null) => {
//     if (!date) return "—";
//     return new Date(date).toLocaleDateString();
//   };

//   return (
//     <div className="space-y-4">
//       {/* Search + Add Button */}
//       <div className="flex items-center gap-3">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//           <Input
//             placeholder="Search by name, email, phone..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="pl-9"
//           />
//         </div>
//         <Button onClick={() => setAddOpen(true)}>
//           <UserPlus className="mr-2 h-4 w-4" />
//           Add Student
//         </Button>
//       </div>

//       {/* Table */}
//       <div className="rounded-md border-t-8 ">
//         <Table>
//           <TableHeader >
//             <TableRow>
//               <TableHead className="text-sm font-semibold">Student</TableHead>
//               <TableHead className="text-sm font-semibold">Email</TableHead>
//               <TableHead className="text-sm font-semibold">Sex</TableHead>
//               <TableHead className="text-sm font-semibold">Blood Group</TableHead>
//               <TableHead className="text-sm font-semibold">Date of Birth</TableHead>
//               <TableHead className="text-sm font-semibold">Phone</TableHead>
//               <TableHead className="text-sm font-semibold">Address</TableHead>
//               <TableHead className="text-sm font-semibold">Parent</TableHead>
//               <TableHead className="text-right font-semibold ">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {loading ? (
//               <TableRow>
//                 <TableCell colSpan={9} className="text-center py-10 text-muted-foreground">
//                   Loading...
//                 </TableCell>
//               </TableRow>
//             ) : filtered.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={9} className="text-center py-10 text-muted-foreground">
//                   No students found.
//                 </TableCell>
//               </TableRow>
//             ) : (
//               filtered.map((student) => (
//                 <TableRow key={student.id}>
//                   <TableCell>
//                     <div className="flex items-center gap-3">
//                       <Avatar className="h-8 w-8">
//                         <AvatarImage src={student.img ?? undefined} alt={student.username} />
//                         <AvatarFallback>
//                           {student.username.slice(0, 2).toUpperCase()}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div>
//                         <p className="font-medium leading-none text-black">{student.username}</p>
//                         <p className="text-xs text-black">{student.id.slice(0, 8)}...</p>
//                       </div>
//                     </div>
//                   </TableCell>
//                   <TableCell className="text-sm text-black">{student.email}</TableCell>
//                   <TableCell>
//                     <Badge variant={student.sex === "MALE" ? "default" : "secondary"}>
//                       {student.sex.charAt(0) + student.sex.slice(1).toLowerCase()}
//                     </Badge>
//                   </TableCell>
//                   <TableCell className="text-black">
//                     {student.bloodGroup ? (
//                       <Badge variant="outline">{student.bloodGroup}</Badge>
//                     ) : (
//                       "—"
//                     )}
//                   </TableCell>
//                   <TableCell className="text-sm text-black">{formatDate(student.dateOfBirth)}</TableCell>
//                   <TableCell className="text-sm text-black">{student.phone ?? "—"}</TableCell>
//                   <TableCell className="text-sm max-w-[150px] truncate text-black">
//                     {student.address ?? "—"}
//                   </TableCell>
//                   <TableCell className="text-sm text-black">
//                     {student.parent?.username ?? "—"}
//                   </TableCell>
//                   <TableCell className="text-right">
//                     <div className="flex justify-end gap-2">
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => {
//                           setSelectedStudent(student);
//                           setEditOpen(true);
//                         }}
//                       >
//                         <Pencil className="h-4 w-4" />
//                       </Button>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="text-red-500 hover:text-red-600 hover:bg-red-50"
//                         onClick={() => {
//                           setSelectedStudent(student);
//                           setDeleteOpen(true);
//                         }}
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Add Dialog */}
//       <StudentDialog
//         open={addOpen}
//         onOpenChange={setAddOpen}
//         onSubmit={handleAdd}
//         loading={actionLoading}
//         isEdit={false}
//       />

//       {/* Edit Dialog */}
//       <StudentDialog
//         open={editOpen}
//         onOpenChange={setEditOpen}
//         initialValues={selectedStudent ?? undefined}
//         onSubmit={handleEdit}
//         loading={actionLoading}
//         isEdit={true}
//       />

//       {/* Delete Confirm Dialog */}
//       <ConfirmDeleteDialog
//         open={deleteOpen}
//         onOpenChange={setDeleteOpen}
//         onConfirm={handleDelete}
//         loading={actionLoading}
//         studentName={selectedStudent?.username}
//       />
//     </div>
//   );
// }






"use client";

import { useState } from "react";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/components/ui/table";
import { Badge } from "@/core/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/core/components/ui/avatar";
import { Pencil, Trash2, UserPlus, Search } from "lucide-react";
import { StudentDialog } from "./StudentDialog";
import { SubmitMode } from "./StudentForm";
import { ConfirmDeleteDialog } from "./ConfirmDelete";
import { Student } from "../types/student.types";

type StudentPayload = Partial<Student> & { password?: string };

interface StudentTableProps {
  students: Student[];
  onAdd: (values: StudentPayload) => Promise<void>;
  onEdit: (id: string, values: StudentPayload, mode: SubmitMode) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  loading?: boolean;
}

export function StudentTable({
  students,
  onAdd,
  onEdit,
  onDelete,
  loading = false,
}: StudentTableProps) {
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const filtered = students.filter(
    (s) =>
      s.username.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.phone ?? "").includes(search) ||
      (s.address ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async (values: StudentPayload, _mode: SubmitMode) => {
    setActionLoading(true);
    try {
      await onAdd(values);
      setAddOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = async (values: StudentPayload, mode: SubmitMode) => {
    if (!selectedStudent) return;
    setActionLoading(true);
    try {
      await onEdit(selectedStudent.id, values, mode);
      setEditOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedStudent) return;
    setActionLoading(true);
    try {
      await onDelete(selectedStudent.id);
      setDeleteOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (date?: string | null) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {/* Search + Add Button */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Sex</TableHead>
              <TableHead>Blood Group</TableHead>
              <TableHead>Date of Birth</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-10 text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-10 text-muted-foreground">
                  No students found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={student.img ?? undefined} alt={student.username} />
                        <AvatarFallback>
                          {student.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium leading-none">{student.username}</p>
                        <p className="text-xs text-muted-foreground">{student.id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{student.email}</TableCell>
                  <TableCell>
                    <Badge variant={student.sex === "MALE" ? "default" : "secondary"}>
                      {student.sex.charAt(0) + student.sex.slice(1).toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {student.bloodGroup ? (
                      <Badge variant="outline">{student.bloodGroup}</Badge>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="text-sm">{formatDate(student.dateOfBirth)}</TableCell>
                  <TableCell className="text-sm">{student.phone ?? "—"}</TableCell>
                  <TableCell className="text-sm max-w-[150px] truncate">
                    {student.address ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {student.parent?.username ?? "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedStudent(student);
                          setEditOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => {
                          setSelectedStudent(student);
                          setDeleteOpen(true);
                        }}
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

      {/* Add Dialog */}
      <StudentDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={handleAdd}
        loading={actionLoading}
        isEdit={false}
      />

      {/* Edit Dialog */}
      <StudentDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        initialValues={selectedStudent ?? undefined}
        onSubmit={handleEdit}
        loading={actionLoading}
        isEdit={true}
      />

      {/* Delete Confirm Dialog */}
      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        loading={actionLoading}
        studentName={selectedStudent?.username}
      />
    </div>
  );
}