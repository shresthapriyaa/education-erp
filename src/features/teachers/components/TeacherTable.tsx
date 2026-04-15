// "use client";

// import { useState } from "react";
// import { Button } from "@/core/components/ui/button";
// import { Input } from "@/core/components/ui/input";
// import {
//   Table, TableBody, TableCell, TableHead,
//   TableHeader, TableRow,
// } from "@/core/components/ui/table";
// import { Badge } from "@/core/components/ui/badge";
// import { Pencil, Trash2, UserPlus, Search } from "lucide-react";
// import { TeacherDialog } from "./TeacherDialog";
// import { SubmitMode } from "./TeacherForm";
// import { ConfirmDeleteDialog } from "./ConfirmDelete";
// import { Teacher } from "../types/teacher.types";

// type TeacherPayload = Partial<Teacher>;

// interface TeacherTableProps {
//   teachers: Teacher[];
//   onAdd: (values: TeacherPayload) => Promise<void>;
//   onEdit: (id: string, values: TeacherPayload, mode: SubmitMode) => Promise<void>;
//   onDelete: (id: string) => Promise<void>;
//   loading?: boolean;
// }

// export function TeacherTable({
//   teachers, onAdd, onEdit, onDelete, loading = false,
// }: TeacherTableProps) {
//   const [search, setSearch] = useState("");
//   const [addOpen, setAddOpen] = useState(false);
//   const [editOpen, setEditOpen] = useState(false);
//   const [deleteOpen, setDeleteOpen] = useState(false);
//   const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
//   const [actionLoading, setActionLoading] = useState(false);

//   const filtered = teachers.filter(
//     (t) =>
//       t.username.toLowerCase().includes(search.toLowerCase()) ||
//       t.email.toLowerCase().includes(search.toLowerCase()) ||
//       (t.phone ?? "").includes(search)
//   );

//   const handleAdd = async (values: TeacherPayload, _mode: SubmitMode) => {
//     setActionLoading(true);
//     try {
//       await onAdd(values);
//       setAddOpen(false);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleEdit = async (values: TeacherPayload, mode: SubmitMode) => {
//     if (!selectedTeacher) return;
//     setActionLoading(true);
//     try {
//       await onEdit(selectedTeacher.id, values, mode);
//       setEditOpen(false);
//       setSelectedTeacher(null);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (!selectedTeacher) return;
//     setActionLoading(true);
//     try {
//       await onDelete(selectedTeacher.id);
//       setDeleteOpen(false);
//       setSelectedTeacher(null);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const getImgSrc = (img?: string | null) => img ?? "/placeholder-avatar.png";

//   return (
//     <div className="space-y-4">
//       <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//           <Input
//             placeholder="Search by name, email, phone..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="pl-9 w-full"
//           />
//         </div>
//         <Button
//           className="bg-black hover:bg-gray-700 text-white w-full sm:w-auto"
//           onClick={() => setAddOpen(true)}
//         >
//           <UserPlus className="mr-2 h-4 w-4" />
//           Add Teacher
//         </Button>
//       </div>

//       {/* Desktop Table */}
//       <div className="hidden lg:block rounded-md border-b-4 border-t-4 overflow-x-auto">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead className="text-black font-semibold">Teacher</TableHead>
//               <TableHead className="text-black font-semibold">Email</TableHead>
//               <TableHead className="text-black font-semibold">Phone</TableHead>
//               <TableHead className="text-black font-semibold">Address</TableHead>
//               <TableHead className="text-black font-semibold">Classes</TableHead>
//               <TableHead className="text-right text-black font-semibold">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {loading ? (
//               <TableRow>
//                 <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
//                   Loading...
//                 </TableCell>
//               </TableRow>
//             ) : filtered.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
//                   No teachers found.
//                 </TableCell>
//               </TableRow>
//             ) : (
//               filtered.map((teacher) => (
//                 <TableRow key={teacher.id}>
//                   <TableCell>
//                     <div className="flex items-center gap-3">
//                       <img
//                         src={getImgSrc(teacher.img)}
//                         alt={teacher.username}
//                         className="h-10 w-10 rounded-full object-cover shrink-0"
//                       />
//                       <div>
//                         <p className="font-medium leading-none text-black">{teacher.username}</p>
//                         <p className="text-xs text-muted-foreground mt-0.5">{teacher.id.slice(0, 8)}...</p>
//                       </div>
//                     </div>
//                   </TableCell>
//                   <TableCell className="text-sm text-black">{teacher.email}</TableCell>
//                   <TableCell className="text-sm text-black">{teacher.phone ?? "—"}</TableCell>
//                   <TableCell className="text-sm text-black">{teacher.address ?? "—"}</TableCell>
//                   <TableCell className="text-sm text-black">
//                     {teacher.classes?.length ?? 0} class(es)
//                   </TableCell>
//                   <TableCell className="text-right">
//                     <div className="flex justify-end gap-2">
//                       <Button
//                         variant="ghost" size="icon"
//                         className="bg-white text-black border border-gray-300 hover:bg-gray-100"
//                         onClick={() => { setSelectedTeacher(teacher); setEditOpen(true); }}
//                       >
//                         <Pencil className="h-4 w-4" />
//                       </Button>
//                       <Button
//                         variant="ghost" size="icon"
//                         className="hover:bg-red-600 border border-gray-300 text-destructive"
//                         onClick={() => { setSelectedTeacher(teacher); setDeleteOpen(true); }}
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

//       {/* Mobile Cards */}
//       <div className="lg:hidden space-y-3">
//         {loading ? (
//           <p className="text-center py-10 text-muted-foreground text-sm">Loading...</p>
//         ) : filtered.length === 0 ? (
//           <p className="text-center py-10 text-muted-foreground text-sm">No teachers found.</p>
//         ) : (
//           filtered.map((teacher) => (
//             <div key={teacher.id} className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
//               <div className="flex items-start justify-between gap-3">
//                 <div className="flex items-center gap-3">
//                   <img
//                     src={getImgSrc(teacher.img)}
//                     alt={teacher.username}
//                     className="h-11 w-11 rounded-full object-cover shrink-0"
//                   />
//                   <div>
//                     <p className="font-semibold text-sm text-black">{teacher.username}</p>
//                     <p className="text-xs text-muted-foreground">{teacher.email}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-1 shrink-0">
//                   <Button
//                     variant="ghost" size="icon"
//                     className="h-8 w-8 bg-white text-black border border-gray-300 hover:bg-gray-100"
//                     onClick={() => { setSelectedTeacher(teacher); setEditOpen(true); }}
//                   >
//                     <Pencil className="h-3.5 w-3.5" />
//                   </Button>
//                   <Button
//                     variant="ghost" size="icon"
//                     className="h-8 w-8 border border-gray-300 text-destructive hover:bg-red-50"
//                     onClick={() => { setSelectedTeacher(teacher); setDeleteOpen(true); }}
//                   >
//                     <Trash2 className="h-3.5 w-3.5" />
//                   </Button>
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
//                 <div>
//                   <p className="text-xs text-muted-foreground">Phone</p>
//                   <p className="text-black">{teacher.phone ?? "—"}</p>
//                 </div>
//                 <div>
//                   <p className="text-xs text-muted-foreground">Address</p>
//                   <p className="text-black truncate">{teacher.address ?? "—"}</p>
//                 </div>
//                 <div>
//                   <p className="text-xs text-muted-foreground">Classes</p>
//                   <p className="text-black">{teacher.classes?.length ?? 0} class(es)</p>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       <TeacherDialog
//         open={addOpen}
//         onOpenChange={setAddOpen}
//         onSubmit={handleAdd}
//         loading={actionLoading}
//         isEdit={false}
//       />
//       <TeacherDialog
//         open={editOpen}
//         onOpenChange={setEditOpen}
//         initialValues={selectedTeacher ?? undefined}
//         onSubmit={handleEdit}
//         loading={actionLoading}
//         isEdit={true}
//       />
//       <ConfirmDeleteDialog
//         open={deleteOpen}
//         onOpenChange={setDeleteOpen}
//         onConfirm={handleDelete}
//         loading={actionLoading}
//         teacherName={selectedTeacher?.username}
//       />
//     </div>
//   );
// }





"use client";

import { useState } from "react";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { ScrollArea } from "@/core/components/ui/scroll-area";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/core/components/ui/table";
import { Badge } from "@/core/components/ui/badge";
import { Pencil, Trash2, UserPlus, Search } from "lucide-react";
import { TeacherDialog } from "./TeacherDialog";
import { SubmitMode } from "./TeacherForm";
import { ConfirmDeleteDialog } from "./ConfirmDelete";
import { Teacher } from "../types/teacher.types";

type TeacherPayload = Partial<Teacher>;

interface TeacherTableProps {
  teachers: Teacher[];
  onAdd: (values: TeacherPayload) => Promise<void>;
  onEdit: (id: string, values: TeacherPayload, mode: SubmitMode) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  loading?: boolean;
}

export function TeacherTable({
  teachers, onAdd, onEdit, onDelete, loading = false,
}: TeacherTableProps) {
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const filtered = teachers.filter(
    (t) =>
      t.username.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()) ||
      (t.phone ?? "").includes(search)
  );

  const handleAdd = async (values: TeacherPayload, _mode: SubmitMode) => {
    setActionLoading(true);
    try {
      await onAdd(values);
      setAddOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = async (values: TeacherPayload, mode: SubmitMode) => {
    if (!selectedTeacher) return;
    setActionLoading(true);
    try {
      await onEdit(selectedTeacher.id, values, mode);
      setEditOpen(false);
      setSelectedTeacher(null);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedTeacher) return;
    setActionLoading(true);
    try {
      await onDelete(selectedTeacher.id);
      setDeleteOpen(false);
      setSelectedTeacher(null);
    } finally {
      setActionLoading(false);
    }
  };

  const getImgSrc = (img?: string | null) => img ?? "/placeholder-avatar.png";

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
        <Button
          className="bg-black hover:bg-gray-700 text-white w-full sm:w-auto"
          onClick={() => setAddOpen(true)}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add Teacher
        </Button>
      </div>

      {/* Desktop Table */}
      <ScrollArea className="h-[600px] rounded-md border-b-4 border-t-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-black font-semibold">Teacher</TableHead>
              <TableHead className="text-black font-semibold">Email</TableHead>
              <TableHead className="text-black font-semibold">Phone</TableHead>
              <TableHead className="text-black font-semibold">Address</TableHead>
              <TableHead className="text-black font-semibold">Classes</TableHead>
              <TableHead className="text-right text-black font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  No teachers found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={getImgSrc(teacher.img)}
                        alt={teacher.username}
                        className="h-10 w-10 rounded-full object-cover shrink-0"
                      />
                      <div>
                        <p className="font-medium leading-none text-black">{teacher.username}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{teacher.id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-black">{teacher.email}</TableCell>
                  <TableCell className="text-sm text-black">{teacher.phone ?? "—"}</TableCell>
                  <TableCell className="text-sm text-black">{teacher.address ?? "—"}</TableCell>
                  {/* FIX: was teacher.classes, API returns classTeacherFor */}
                  <TableCell className="text-sm text-black">
                    {teacher.classTeacherFor?.length ?? 0} class(es)
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost" size="icon"
                        className="bg-white text-black border border-gray-300 hover:bg-gray-100"
                        onClick={() => { setSelectedTeacher(teacher); setEditOpen(true); }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost" size="icon"
                        className="hover:bg-red-600 border border-gray-300 text-destructive"
                        onClick={() => { setSelectedTeacher(teacher); setDeleteOpen(true); }}
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
      </ScrollArea>

      {/* Mobile Cards */}
      <ScrollArea className="h-[600px] lg:hidden">
        <div className="space-y-3 pr-4">
          {loading ? (
            <p className="text-center py-10 text-muted-foreground text-sm">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center py-10 text-muted-foreground text-sm">No teachers found.</p>
          ) : (
            filtered.map((teacher) => (
              <div key={teacher.id} className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={getImgSrc(teacher.img)}
                      alt={teacher.username}
                      className="h-11 w-11 rounded-full object-cover shrink-0"
                    />
                    <div>
                      <p className="font-semibold text-sm text-black">{teacher.username}</p>
                      <p className="text-xs text-muted-foreground">{teacher.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost" size="icon"
                      className="h-8 w-8 bg-white text-black border border-gray-300 hover:bg-gray-100"
                      onClick={() => { setSelectedTeacher(teacher); setEditOpen(true); }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost" size="icon"
                      className="h-8 w-8 border border-gray-300 text-destructive hover:bg-red-50"
                      onClick={() => { setSelectedTeacher(teacher); setDeleteOpen(true); }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-black">{teacher.phone ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Address</p>
                    <p className="text-black truncate">{teacher.address ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Classes</p>
                    {/* FIX: was teacher.classes, API returns classTeacherFor */}
                    <p className="text-black">{teacher.classTeacherFor?.length ?? 0} class(es)</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <TeacherDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={handleAdd}
        loading={actionLoading}
        isEdit={false}
      />
      <TeacherDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        initialValues={selectedTeacher ?? undefined}
        onSubmit={handleEdit}
        loading={actionLoading}
        isEdit={true}
      />
      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        loading={actionLoading}
        teacherName={selectedTeacher?.username}
      />
    </div>
  );
}