// "use client";

// import { useState } from "react";
// import { Button } from "@/core/components/ui/button";
// import { Input } from "@/core/components/ui/input";
// import { Badge } from "@/core/components/ui/badge";
// import { ScrollArea } from "@/core/components/ui/scroll-area";
// import {
//   Table, TableBody, TableCell, TableHead,
//   TableHeader, TableRow,
// } from "@/core/components/ui/table";
// import { Pencil, Trash2, PlusCircle, Search, FileText, ExternalLink, File, Video, Link2, Image, HelpCircle } from "lucide-react";
// import { AssignmentDialog } from "./AssignmentDialog";
// import { SubmitMode } from "./AssignmentForm";
// import { ConfirmDeleteDialog } from "./ConfirmDelete";
// import { Assignment } from "../types/assignment.types";

// type AssignmentPayload = Partial<Assignment>;

// interface AssignmentTableProps {
//   assignments: Assignment[];
//   onAdd: (values: AssignmentPayload) => Promise<void>;
//   onEdit: (id: string, values: AssignmentPayload, mode: SubmitMode) => Promise<void>;
//   onDelete: (id: string) => Promise<void>;
//   loading?: boolean;
// }

// const MATERIAL_META: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
//   PDF:      { icon: <FileText className="h-3 w-3" />, color: "text-red-600",    bg: "bg-red-50 border-red-200"       },
//   VIDEO:    { icon: <Video    className="h-3 w-3" />, color: "text-blue-600",   bg: "bg-blue-50 border-blue-200"     },
//   LINK:     { icon: <Link2    className="h-3 w-3" />, color: "text-green-600",  bg: "bg-green-50 border-green-200"   },
//   IMAGE:    { icon: <Image    className="h-3 w-3" />, color: "text-purple-600", bg: "bg-purple-50 border-purple-200" },
//   DOCUMENT: { icon: <File     className="h-3 w-3" />, color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200" },
//   OTHER:    { icon: <HelpCircle className="h-3 w-3" />, color: "text-gray-500", bg: "bg-gray-50 border-gray-200"    },
// };

// function MaterialPill({ title, type, url }: { title: string; type: string; url: string }) {
//   const meta = MATERIAL_META[type] ?? MATERIAL_META["OTHER"];
//   return (
//     <a href={url} target="_blank" rel="noopener noreferrer"
//       className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${meta.color} ${meta.bg} hover:opacity-80`}>
//       {meta.icon}
//       <span className="max-w-[100px] truncate">{title}</span>
//       <ExternalLink className="h-2.5 w-2.5 shrink-0 opacity-60" />
//     </a>
//   );
// }

// function MaterialSummary({ materials }: { materials?: Assignment["materials"] }) {
//   if (!materials?.length) return <span className="text-xs text-muted-foreground">—</span>;
//   const visible = materials.slice(0, 2);
//   const rest = materials.length - visible.length;
//   return (
//     <div className="flex flex-wrap gap-1 items-center">
//       {visible.map((m) => <MaterialPill key={m.id} title={m.title} type={m.type} url={m.url} />)}
//       {rest > 0 && <span className="text-xs text-muted-foreground">+{rest} more</span>}
//     </div>
//   );
// }

// export function AssignmentTable({
//   assignments, onAdd, onEdit, onDelete, loading = false,
// }: AssignmentTableProps) {
//   const [search, setSearch] = useState("");
//   const [addOpen, setAddOpen] = useState(false);
//   const [editOpen, setEditOpen] = useState(false);
//   const [deleteOpen, setDeleteOpen] = useState(false);
//   const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
//   const [actionLoading, setActionLoading] = useState(false);

//   const filtered = assignments.filter(
//     (a) =>
//       a.title.toLowerCase().includes(search.toLowerCase()) ||
//       a.description.toLowerCase().includes(search.toLowerCase())
//   );

//   const handleAdd = async (values: AssignmentPayload, _mode: SubmitMode) => {
//     setActionLoading(true);
//     try {
//       await onAdd(values);
//       setAddOpen(false);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleEdit = async (values: AssignmentPayload, mode: SubmitMode) => {
//     if (!selectedAssignment) return;
//     setActionLoading(true);
//     try {
//       await onEdit(selectedAssignment.id, values, mode);
//       setEditOpen(false);
//       setSelectedAssignment(null);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (!selectedAssignment) return;
//     setActionLoading(true);
//     try {
//       await onDelete(selectedAssignment.id);
//       setDeleteOpen(false);
//       setSelectedAssignment(null);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const formatDate = (date: string) => new Date(date).toLocaleDateString("en-GB");

//   const isOverdue = (date: string) => new Date(date) < new Date();

//   return (
//     <div className="space-y-4">
//       <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//           <Input
//             placeholder="Search by title or description..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="pl-9 w-full"
//           />
//         </div>
//         <Button
//           className="bg-black hover:bg-gray-700 text-white w-full sm:w-auto"
//           onClick={() => setAddOpen(true)}
//         >
//           <PlusCircle className="mr-2 h-4 w-4" />
//           Add Assignment
//         </Button>
//       </div>

//       {/* Desktop Table */}
//       <div className="hidden lg:block rounded-md border-b-4 border-t-4 overflow-hidden">
//         <ScrollArea className="h-[600px]">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead className="text-black font-semibold">Title</TableHead>
//                 <TableHead className="text-black font-semibold">Class</TableHead>
//                 <TableHead className="text-black font-semibold">Subject</TableHead>
//                 <TableHead className="text-black font-semibold">Teacher</TableHead>
//                 <TableHead className="text-black font-semibold">Due Date</TableHead>
//                 <TableHead className="text-black font-semibold">Marks</TableHead>
//                 <TableHead className="text-black font-semibold">Materials</TableHead>
//                 <TableHead className="text-black font-semibold">Status</TableHead>
//                 <TableHead className="text-right text-black font-semibold">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {loading ? (
//                 <TableRow>
//                   <TableCell colSpan={9} className="text-center py-10 text-muted-foreground">
//                     Loading...
//                   </TableCell>
//                 </TableRow>
//               ) : filtered.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={9} className="text-center py-10 text-muted-foreground">
//                     No assignments found.
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 filtered.map((assignment) => (
//                   <TableRow key={assignment.id}>
//                     <TableCell className="font-medium text-black">{assignment.title}</TableCell>
//                     <TableCell className="text-sm text-black">
//                       {assignment.class?.name || <span className="text-muted-foreground">—</span>}
//                     </TableCell>
//                     <TableCell className="text-sm text-black">
//                       {assignment.subject?.name || <span className="text-muted-foreground">—</span>}
//                     </TableCell>
//                     <TableCell className="text-sm text-black">
//                       {assignment.teacher?.username || <span className="text-muted-foreground">—</span>}
//                     </TableCell>
//                     <TableCell className="text-sm text-black">{formatDate(assignment.dueDate)}</TableCell>
//                     <TableCell className="text-sm text-black font-medium">{assignment.totalMarks} pts</TableCell>
//                     <TableCell className="max-w-[200px]">
//                       <MaterialSummary materials={assignment.materials} />
//                     </TableCell>
//                     <TableCell>
//                       <Badge variant={isOverdue(assignment.dueDate) ? "destructive" : "default"}>
//                         {isOverdue(assignment.dueDate) ? "Overdue" : "Active"}
//                       </Badge>
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <div className="flex justify-end gap-2">
//                         <Button
//                           variant="ghost" size="icon"
//                           className="bg-white text-black border border-gray-300 hover:bg-gray-100"
//                           onClick={() => { setSelectedAssignment(assignment); setEditOpen(true); }}
//                         >
//                           <Pencil className="h-4 w-4" />
//                         </Button>
//                         <Button
//                           variant="ghost" size="icon"
//                           className="hover:bg-red-600 border border-gray-300 text-destructive"
//                           onClick={() => { setSelectedAssignment(assignment); setDeleteOpen(true); }}
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </ScrollArea>
//       </div>

//       {/* Mobile Cards */}
//       <div className="lg:hidden">
//         <ScrollArea className="h-[600px]">
//           <div className="space-y-3 pr-4">
//             {loading ? (
//               <p className="text-center py-10 text-muted-foreground text-sm">Loading...</p>
//             ) : filtered.length === 0 ? (
//               <p className="text-center py-10 text-muted-foreground text-sm">No assignments found.</p>
//             ) : (
//               filtered.map((assignment) => (
//                 <div key={assignment.id} className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
//                   <div className="flex items-start justify-between gap-3">
//                     <div className="flex-1">
//                       <p className="font-semibold text-sm text-black">{assignment.title}</p>
//                       <div className="mt-2 space-y-1 text-xs text-muted-foreground">
//                         <p>Class: <span className="text-foreground font-medium">{assignment.class?.name || "—"}</span></p>
//                         <p>Subject: <span className="text-foreground font-medium">{assignment.subject?.name || "—"}</span></p>
//                         <p>Teacher: <span className="text-foreground font-medium">{assignment.teacher?.username || "—"}</span></p>
//                         <p>Marks: <span className="text-foreground font-medium">{assignment.totalMarks} pts</span></p>
//                       </div>
//                       {assignment.materials && assignment.materials.length > 0 && (
//                         <div className="flex flex-wrap gap-1 mt-2">
//                           {assignment.materials.map((m) => <MaterialPill key={m.id} title={m.title} type={m.type} url={m.url} />)}
//                         </div>
//                       )}
//                     </div>
//                     <div className="flex items-center gap-1 shrink-0">
//                       <Button
//                         variant="ghost" size="icon"
//                         className="h-8 w-8 bg-white text-black border border-gray-300 hover:bg-gray-100"
//                         onClick={() => { setSelectedAssignment(assignment); setEditOpen(true); }}
//                       >
//                         <Pencil className="h-3.5 w-3.5" />
//                       </Button>
//                       <Button
//                         variant="ghost" size="icon"
//                         className="h-8 w-8 border border-gray-300 text-destructive hover:bg-red-50"
//                         onClick={() => { setSelectedAssignment(assignment); setDeleteOpen(true); }}
//                       >
//                         <Trash2 className="h-3.5 w-3.5" />
//                       </Button>
//                     </div>
//                   </div>
//                   <div className="flex items-center justify-between pt-2 border-t">
//                     <p className="text-xs text-muted-foreground">Due: {formatDate(assignment.dueDate)}</p>
//                     <Badge variant={isOverdue(assignment.dueDate) ? "destructive" : "default"}>
//                       {isOverdue(assignment.dueDate) ? "Overdue" : "Active"}
//                     </Badge>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </ScrollArea>
//       </div>

//       <AssignmentDialog
//         open={addOpen}
//         onOpenChange={setAddOpen}
//         onSubmit={handleAdd}
//         loading={actionLoading}
//         isEdit={false}
//       />
//       <AssignmentDialog
//         open={editOpen}
//         onOpenChange={setEditOpen}
//         initialValues={selectedAssignment ?? undefined}
//         onSubmit={handleEdit}
//         loading={actionLoading}
//         isEdit={true}
//       />
//       <ConfirmDeleteDialog
//         open={deleteOpen}
//         onOpenChange={setDeleteOpen}
//         onConfirm={handleDelete}
//         loading={actionLoading}
//         assignmentTitle={selectedAssignment?.title}
//       />
//     </div>
//   );
// }






"use client";

import { useState } from "react";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { Badge } from "@/core/components/ui/badge";
import { ScrollArea } from "@/core/components/ui/scroll-area";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/core/components/ui/table";
import { Pencil, Trash2, PlusCircle, Search, FileText, ExternalLink, File, Video, Link2, Image, HelpCircle } from "lucide-react";
import { AssignmentDialog } from "./AssignmentDialog";
import { SubmitMode } from "./AssignmentForm";
import { ConfirmDeleteDialog } from "./ConfirmDelete";
import { Assignment } from "../types/assignment.types";

type AssignmentPayload = Partial<Assignment>;

interface AssignmentTableProps {
  assignments: Assignment[];
  onAdd: (values: AssignmentPayload) => Promise<void>;
  onEdit: (id: string, values: AssignmentPayload, mode: SubmitMode) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  loading?: boolean;
}

const MATERIAL_META: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  PDF:      { icon: <FileText className="h-3 w-3" />, color: "text-red-600",    bg: "bg-red-50 border-red-200"       },
  VIDEO:    { icon: <Video    className="h-3 w-3" />, color: "text-blue-600",   bg: "bg-blue-50 border-blue-200"     },
  LINK:     { icon: <Link2    className="h-3 w-3" />, color: "text-green-600",  bg: "bg-green-50 border-green-200"   },
  IMAGE:    { icon: <Image    className="h-3 w-3" />, color: "text-purple-600", bg: "bg-purple-50 border-purple-200" },
  DOCUMENT: { icon: <File     className="h-3 w-3" />, color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200" },
  OTHER:    { icon: <HelpCircle className="h-3 w-3" />, color: "text-gray-500", bg: "bg-gray-50 border-gray-200"    },
};

function MaterialPill({ title, type, url }: { title: string; type: string; url: string }) {
  const meta = MATERIAL_META[type] ?? MATERIAL_META["OTHER"];
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${meta.color} ${meta.bg} hover:opacity-80`}>
      {meta.icon}
      <span className="max-w-[100px] truncate">{title}</span>
      <ExternalLink className="h-2.5 w-2.5 shrink-0 opacity-60" />
    </a>
  );
}

function MaterialSummary({ materials }: { materials?: Assignment["materials"] }) {
  if (!materials?.length) return <span className="text-xs text-muted-foreground">—</span>;
  const visible = materials.slice(0, 2);
  const rest = materials.length - visible.length;
  return (
    <div className="flex flex-wrap gap-1 items-center">
      {visible.map((m) => <MaterialPill key={m.id} title={m.title} type={m.type} url={m.url} />)}
      {rest > 0 && <span className="text-xs text-muted-foreground">+{rest} more</span>}
    </div>
  );
}

export function AssignmentTable({
  assignments, onAdd, onEdit, onDelete, loading = false,
}: AssignmentTableProps) {
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const filtered = assignments.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async (values: AssignmentPayload, _mode: SubmitMode) => {
    setActionLoading(true);
    try {
      await onAdd(values);
      setAddOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = async (values: AssignmentPayload, mode: SubmitMode) => {
    if (!selectedAssignment) return;
    setActionLoading(true);
    try {
      await onEdit(selectedAssignment.id, values, mode);
      setEditOpen(false);
      setSelectedAssignment(null);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedAssignment) return;
    setActionLoading(true);
    try {
      await onDelete(selectedAssignment.id);
      setDeleteOpen(false);
      setSelectedAssignment(null);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString("en-GB");
  const isOverdue = (date: string) => new Date(date) < new Date();

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
        <Button
          className="bg-black hover:bg-gray-700 text-white w-full sm:w-auto"
          onClick={() => setAddOpen(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Assignment
        </Button>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block rounded-md border-b-4 border-t-4 overflow-hidden">
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-black font-semibold">Title</TableHead>
                <TableHead className="text-black font-semibold">Class</TableHead>
                <TableHead className="text-black font-semibold">Subject</TableHead>
                <TableHead className="text-black font-semibold">Teacher</TableHead>
                <TableHead className="text-black font-semibold">Due Date</TableHead>
                <TableHead className="text-black font-semibold">Marks</TableHead>
                <TableHead className="text-black font-semibold">Materials</TableHead>
                <TableHead className="text-black font-semibold">Status</TableHead>
                <TableHead className="text-right text-black font-semibold">Actions</TableHead>
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
                    No assignments found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell className="font-medium text-black">{assignment.title}</TableCell>

                    {/* ✅ FIXED: Access via classSubject */}
                    <TableCell className="text-sm text-black">
                      {assignment.classSubject?.class?.name || <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell className="text-sm text-black">
                      {assignment.classSubject?.subject?.name || <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell className="text-sm text-black">
                      {assignment.classSubject?.teacher?.username || <span className="text-muted-foreground">—</span>}
                    </TableCell>

                    <TableCell className="text-sm text-black">{formatDate(assignment.dueDate)}</TableCell>
                    <TableCell className="text-sm text-black font-medium">{assignment.totalMarks} pts</TableCell>
                    <TableCell className="max-w-[200px]">
                      <MaterialSummary materials={assignment.materials} />
                    </TableCell>
                    <TableCell>
                      <Badge variant={isOverdue(assignment.dueDate) ? "destructive" : "default"}>
                        {isOverdue(assignment.dueDate) ? "Overdue" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost" size="icon"
                          className="bg-white text-black border border-gray-300 hover:bg-gray-100"
                          onClick={() => { setSelectedAssignment(assignment); setEditOpen(true); }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost" size="icon"
                          className="hover:bg-red-600 border border-gray-300 text-destructive"
                          onClick={() => { setSelectedAssignment(assignment); setDeleteOpen(true); }}
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
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden">
        <ScrollArea className="h-[600px]">
          <div className="space-y-3 pr-4">
            {loading ? (
              <p className="text-center py-10 text-muted-foreground text-sm">Loading...</p>
            ) : filtered.length === 0 ? (
              <p className="text-center py-10 text-muted-foreground text-sm">No assignments found.</p>
            ) : (
              filtered.map((assignment) => (
                <div key={assignment.id} className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-black">{assignment.title}</p>
                      <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                        {/* ✅ FIXED: Access via classSubject */}
                        <p>Class: <span className="text-foreground font-medium">{assignment.classSubject?.class?.name || "—"}</span></p>
                        <p>Subject: <span className="text-foreground font-medium">{assignment.classSubject?.subject?.name || "—"}</span></p>
                        <p>Teacher: <span className="text-foreground font-medium">{assignment.classSubject?.teacher?.username || "—"}</span></p>
                        <p>Marks: <span className="text-foreground font-medium">{assignment.totalMarks} pts</span></p>
                      </div>
                      {assignment.materials && assignment.materials.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {assignment.materials.map((m) => <MaterialPill key={m.id} title={m.title} type={m.type} url={m.url} />)}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost" size="icon"
                        className="h-8 w-8 bg-white text-black border border-gray-300 hover:bg-gray-100"
                        onClick={() => { setSelectedAssignment(assignment); setEditOpen(true); }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost" size="icon"
                        className="h-8 w-8 border border-gray-300 text-destructive hover:bg-red-50"
                        onClick={() => { setSelectedAssignment(assignment); setDeleteOpen(true); }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <p className="text-xs text-muted-foreground">Due: {formatDate(assignment.dueDate)}</p>
                    <Badge variant={isOverdue(assignment.dueDate) ? "destructive" : "default"}>
                      {isOverdue(assignment.dueDate) ? "Overdue" : "Active"}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      <AssignmentDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={handleAdd}
        loading={actionLoading}
        isEdit={false}
      />
      <AssignmentDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        initialValues={selectedAssignment ?? undefined}
        onSubmit={handleEdit}
        loading={actionLoading}
        isEdit={true}
      />
      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        loading={actionLoading}
        assignmentTitle={selectedAssignment?.title}
      />
    </div>
  );
}