// // "use client";

// // import { useState } from "react";
// // import { Button } from "@/core/components/ui/button";
// // import { Input } from "@/core/components/ui/input";
// // import { Badge } from "@/core/components/ui/badge";
// // import {
// //   Table, TableBody, TableCell, TableHead,
// //   TableHeader, TableRow,
// // } from "@/core/components/ui/table";
// // import { Pencil, Trash2, PlusCircle, Search, BookOpen } from "lucide-react";
// // import { LessonDialog } from "./LessonDialog";
// // import { SubmitMode } from "./LessonForm";
// // import { ConfirmDeleteDialog } from "./ConfirmDelete";
// // import { Lesson } from "../types/lesson.types";

// // type LessonPayload = Partial<Lesson>;

// // interface LessonTableProps {
// //   lessons: Lesson[];
// //   onAdd: (values: LessonPayload) => Promise<void>;
// //   onEdit: (id: string, values: LessonPayload, mode: SubmitMode) => Promise<void>;
// //   onDelete: (id: string) => Promise<void>;
// //   loading?: boolean;
// // }

// // export function LessonTable({
// //   lessons, onAdd, onEdit, onDelete, loading = false,
// // }: LessonTableProps) {
// //   const [search, setSearch] = useState("");
// //   const [addOpen, setAddOpen] = useState(false);
// //   const [editOpen, setEditOpen] = useState(false);
// //   const [deleteOpen, setDeleteOpen] = useState(false);
// //   const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
// //   const [actionLoading, setActionLoading] = useState(false);

// //   const filtered = lessons.filter(
// //     (l) =>
// //       l.title.toLowerCase().includes(search.toLowerCase()) ||
// //       l.content.toLowerCase().includes(search.toLowerCase())
// //   );

// //   const handleAdd = async (values: LessonPayload, _mode: SubmitMode) => {
// //     setActionLoading(true);
// //     try {
// //       await onAdd(values);
// //       setAddOpen(false);
// //     } finally {
// //       setActionLoading(false);
// //     }
// //   };

// //   const handleEdit = async (values: LessonPayload, mode: SubmitMode) => {
// //     if (!selectedLesson) return;
// //     setActionLoading(true);
// //     try {
// //       await onEdit(selectedLesson.id, values, mode);
// //       setEditOpen(false);
// //       setSelectedLesson(null);
// //     } finally {
// //       setActionLoading(false);
// //     }
// //   };

// //   const handleDelete = async () => {
// //     if (!selectedLesson) return;
// //     setActionLoading(true);
// //     try {
// //       await onDelete(selectedLesson.id);
// //       setDeleteOpen(false);
// //       setSelectedLesson(null);
// //     } finally {
// //       setActionLoading(false);
// //     }
// //   };

// //   const formatDate = (date: string) => new Date(date).toLocaleDateString("en-GB");

// //   return (
// //     <div className="space-y-4">
// //       <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
// //         <div className="relative flex-1">
// //           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
// //           <Input
// //             placeholder="Search by title or content..."
// //             value={search}
// //             onChange={(e) => setSearch(e.target.value)}
// //             className="pl-9 w-full"
// //           />
// //         </div>
// //         <Button
// //           className="bg-black hover:bg-gray-700 text-white w-full sm:w-auto"
// //           onClick={() => setAddOpen(true)}
// //         >
// //           <PlusCircle className="mr-2 h-4 w-4" />
// //           Add Lesson
// //         </Button>
// //       </div>

// //       {/* Desktop Table */}
// //       <div className="hidden lg:block rounded-md border-b-4 border-t-4 overflow-x-auto">
// //         <Table>
// //           <TableHeader>
// //             <TableRow>
// //               <TableHead className="text-black font-semibold">Title</TableHead>
// //               <TableHead className="text-black font-semibold">Content</TableHead>
// //               <TableHead className="text-black font-semibold">Materials</TableHead>
// //               <TableHead className="text-black font-semibold">Created</TableHead>
// //               <TableHead className="text-right text-black font-semibold">Actions</TableHead>
// //             </TableRow>
// //           </TableHeader>
// //           <TableBody>
// //             {loading ? (
// //               <TableRow>
// //                 <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
// //                   Loading...
// //                 </TableCell>
// //               </TableRow>
// //             ) : filtered.length === 0 ? (
// //               <TableRow>
// //                 <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
// //                   No lessons found.
// //                 </TableCell>
// //               </TableRow>
// //             ) : (
// //               filtered.map((lesson) => (
// //                 <TableRow key={lesson.id}>
// //                   <TableCell className="font-medium text-black">{lesson.title}</TableCell>
// //                   <TableCell className="text-sm text-black max-w-[250px] truncate">
// //                     {lesson.content}
// //                   </TableCell>
// //                   <TableCell>
// //                     <Badge variant="secondary">
// //                       <BookOpen className="mr-1 h-3 w-3" />
// //                       {lesson.materials?.length ?? 0}
// //                     </Badge>
// //                   </TableCell>
// //                   <TableCell className="text-sm text-black">{formatDate(lesson.createdAt)}</TableCell>
// //                   <TableCell className="text-right">
// //                     <div className="flex justify-end gap-2">
// //                       <Button
// //                         variant="ghost" size="icon"
// //                         className="bg-white text-black border border-gray-300 hover:bg-gray-100"
// //                         onClick={() => { setSelectedLesson(lesson); setEditOpen(true); }}
// //                       >
// //                         <Pencil className="h-4 w-4" />
// //                       </Button>
// //                       <Button
// //                         variant="ghost" size="icon"
// //                         className="hover:bg-red-600 border border-gray-300 text-destructive"
// //                         onClick={() => { setSelectedLesson(lesson); setDeleteOpen(true); }}
// //                       >
// //                         <Trash2 className="h-4 w-4" />
// //                       </Button>
// //                     </div>
// //                   </TableCell>
// //                 </TableRow>
// //               ))
// //             )}
// //           </TableBody>
// //         </Table>
// //       </div>

// //       {/* Mobile Cards */}
// //       <div className="lg:hidden space-y-3">
// //         {loading ? (
// //           <p className="text-center py-10 text-muted-foreground text-sm">Loading...</p>
// //         ) : filtered.length === 0 ? (
// //           <p className="text-center py-10 text-muted-foreground text-sm">No lessons found.</p>
// //         ) : (
// //           filtered.map((lesson) => (
// //             <div key={lesson.id} className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
// //               <div className="flex items-start justify-between gap-3">
// //                 <div>
// //                   <p className="font-semibold text-sm text-black">{lesson.title}</p>
// //                   <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{lesson.content}</p>
// //                 </div>
// //                 <div className="flex items-center gap-1 shrink-0">
// //                   <Button
// //                     variant="ghost" size="icon"
// //                     className="h-8 w-8 bg-white text-black border border-gray-300 hover:bg-gray-100"
// //                     onClick={() => { setSelectedLesson(lesson); setEditOpen(true); }}
// //                   >
// //                     <Pencil className="h-3.5 w-3.5" />
// //                   </Button>
// //                   <Button
// //                     variant="ghost" size="icon"
// //                     className="h-8 w-8 border border-gray-300 text-destructive hover:bg-red-50"
// //                     onClick={() => { setSelectedLesson(lesson); setDeleteOpen(true); }}
// //                   >
// //                     <Trash2 className="h-3.5 w-3.5" />
// //                   </Button>
// //                 </div>
// //               </div>
// //               <div className="flex items-center justify-between text-xs text-muted-foreground">
// //                 <Badge variant="secondary">
// //                   <BookOpen className="mr-1 h-3 w-3" />
// //                   {lesson.materials?.length ?? 0} materials
// //                 </Badge>
// //                 <span>{formatDate(lesson.createdAt)}</span>
// //               </div>
// //             </div>
// //           ))
// //         )}
// //       </div>

// //       <LessonDialog
// //         open={addOpen}
// //         onOpenChange={setAddOpen}
// //         onSubmit={handleAdd}
// //         loading={actionLoading}
// //         isEdit={false}
// //       />
// //       <LessonDialog
// //         open={editOpen}
// //         onOpenChange={setEditOpen}
// //         initialValues={selectedLesson ?? undefined}
// //         onSubmit={handleEdit}
// //         loading={actionLoading}
// //         isEdit={true}
// //       />
// //       <ConfirmDeleteDialog
// //         open={deleteOpen}
// //         onOpenChange={setDeleteOpen}
// //         onConfirm={handleDelete}
// //         loading={actionLoading}
// //         lessonTitle={selectedLesson?.title}
// //       />
// //     </div>
// //   );
// // }



// "use client";

// import { useState } from "react";
// import { Button } from "@/core/components/ui/button";
// import { Input } from "@/core/components/ui/input";
// import { Badge } from "@/core/components/ui/badge";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/core/components/ui/table";
// import {
//   Pencil,
//   Trash2,
//   PlusCircle,
//   Search,
//   FileText,
//   Video,
//   Link2,
//   Image,
//   File,
//   HelpCircle,
//   ExternalLink,
// } from "lucide-react";
// import { LessonDialog } from "./LessonDialog";
// import { SubmitMode } from "./LessonForm";
// import { ConfirmDeleteDialog } from "./ConfirmDelete";
// import { Lesson } from "../types/lesson.types";

// type LessonPayload = Partial<Lesson>;

// interface LessonTableProps {
//   lessons: Lesson[];
//   onAdd: (values: LessonPayload) => Promise<void>;
//   onEdit: (
//     id: string,
//     values: LessonPayload,
//     mode: SubmitMode
//   ) => Promise<void>;
//   onDelete: (id: string) => Promise<void>;
//   loading?: boolean;
// }

// /** Same map as in LessonForm — keep in sync or extract to a shared util */
// const MATERIAL_META: Record<
//   string,
//   { icon: React.ReactNode; color: string; bg: string }
// > = {
//   PDF: {
//     icon: <FileText className="h-3 w-3" />,
//     color: "text-red-600",
//     bg: "bg-red-50 border-red-200",
//   },
//   VIDEO: {
//     icon: <Video className="h-3 w-3" />,
//     color: "text-blue-600",
//     bg: "bg-blue-50 border-blue-200",
//   },
//   LINK: {
//     icon: <Link2 className="h-3 w-3" />,
//     color: "text-green-600",
//     bg: "bg-green-50 border-green-200",
//   },
//   IMAGE: {
//     icon: <Image className="h-3 w-3" />,
//     color: "text-purple-600",
//     bg: "bg-purple-50 border-purple-200",
//   },
//   DOCUMENT: {
//     icon: <File className="h-3 w-3" />,
//     color: "text-yellow-700",
//     bg: "bg-yellow-50 border-yellow-200",
//   },
//   OTHER: {
//     icon: <HelpCircle className="h-3 w-3" />,
//     color: "text-gray-500",
//     bg: "bg-gray-50 border-gray-200",
//   },
// };

// /** A small pill for each material that links to its URL */
// function MaterialPill({
//   title,
//   type,
//   url,
// }: {
//   title: string;
//   type: string;
//   url: string;
// }) {
//   const meta = MATERIAL_META[type] ?? MATERIAL_META["OTHER"];
//   return (
//     <a
//       href={url}
//       target="_blank"
//       rel="noopener noreferrer"
//       title={`Open ${title} (${type})`}
//       className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${meta.color} ${meta.bg} hover:opacity-80 transition-opacity`}
//     >
//       {meta.icon}
//       <span className="max-w-[100px] truncate">{title}</span>
//       <ExternalLink className="h-2.5 w-2.5 shrink-0 opacity-60" />
//     </a>
//   );
// }

// /** Compact summary badge used when there are many materials */
// function MaterialSummary({ materials }: { materials: Lesson["materials"] }) {
//   if (!materials?.length) {
//     return <span className="text-xs text-muted-foreground">—</span>;
//   }

//   // Show up to 2 pills inline; overflow as "+N more"
//   const visible = materials.slice(0, 2);
//   const rest = materials.length - visible.length;

//   return (
//     <div className="flex flex-wrap gap-1 items-center">
//       {visible.map((m, i) => (
//         <MaterialPill key={i} title={m.title} type={m.type} url={m.url} />
//       ))}
//       {rest > 0 && (
//         <span className="text-xs text-muted-foreground">+{rest} more</span>
//       )}
//     </div>
//   );
// }

// export function LessonTable({
//   lessons,
//   onAdd,
//   onEdit,
//   onDelete,
//   loading = false,
// }: LessonTableProps) {
//   const [search, setSearch] = useState("");
//   const [addOpen, setAddOpen] = useState(false);
//   const [editOpen, setEditOpen] = useState(false);
//   const [deleteOpen, setDeleteOpen] = useState(false);
//   const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
//   const [actionLoading, setActionLoading] = useState(false);

//   const filtered = lessons.filter(
//     (l) =>
//       l.title.toLowerCase().includes(search.toLowerCase()) ||
//       l.content.toLowerCase().includes(search.toLowerCase())
//   );

//   const handleAdd = async (values: LessonPayload, _mode: SubmitMode) => {
//     setActionLoading(true);
//     try {
//       await onAdd(values);
//       setAddOpen(false);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleEdit = async (values: LessonPayload, mode: SubmitMode) => {
//     if (!selectedLesson) return;
//     setActionLoading(true);
//     try {
//       await onEdit(selectedLesson.id, values, mode);
//       setEditOpen(false);
//       setSelectedLesson(null);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (!selectedLesson) return;
//     setActionLoading(true);
//     try {
//       await onDelete(selectedLesson.id);
//       setDeleteOpen(false);
//       setSelectedLesson(null);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const formatDate = (date: string) =>
//     new Date(date).toLocaleDateString("en-GB");

//   return (
//     <div className="space-y-4">
//       <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//           <Input
//             placeholder="Search by title or content..."
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
//           Add Lesson
//         </Button>
//       </div>

//       {/* Desktop Table */}
//       <div className="hidden lg:block rounded-md border-b-4 border-t-4 overflow-x-auto">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead className="text-black font-semibold">Title</TableHead>
//               <TableHead className="text-black font-semibold">Content</TableHead>
//               <TableHead className="text-black font-semibold">
//                 Materials
//               </TableHead>
//               <TableHead className="text-black font-semibold">Created</TableHead>
//               <TableHead className="text-right text-black font-semibold">
//                 Actions
//               </TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {loading ? (
//               <TableRow>
//                 <TableCell
//                   colSpan={5}
//                   className="text-center py-10 text-muted-foreground"
//                 >
//                   Loading...
//                 </TableCell>
//               </TableRow>
//             ) : filtered.length === 0 ? (
//               <TableRow>
//                 <TableCell
//                   colSpan={5}
//                   className="text-center py-10 text-muted-foreground"
//                 >
//                   No lessons found.
//                 </TableCell>
//               </TableRow>
//             ) : (
//               filtered.map((lesson) => (
//                 <TableRow key={lesson.id}>
//                   <TableCell className="font-medium text-black">
//                     {lesson.title}
//                   </TableCell>
//                   <TableCell className="text-sm text-black max-w-[220px] truncate">
//                     {lesson.content}
//                   </TableCell>
//                   {/* Replaced the plain badge with clickable material pills */}
//                   <TableCell className="max-w-[200px]">
//                     <MaterialSummary materials={lesson.materials} />
//                   </TableCell>
//                   <TableCell className="text-sm text-black">
//                     {formatDate(lesson.createdAt)}
//                   </TableCell>
//                   <TableCell className="text-right">
//                     <div className="flex justify-end gap-2">
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="bg-white text-black border border-gray-300 hover:bg-gray-100"
//                         onClick={() => {
//                           setSelectedLesson(lesson);
//                           setEditOpen(true);
//                         }}
//                       >
//                         <Pencil className="h-4 w-4" />
//                       </Button>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="hover:bg-red-600 border border-gray-300 text-destructive"
//                         onClick={() => {
//                           setSelectedLesson(lesson);
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

//       {/* Mobile Cards */}
//       <div className="lg:hidden space-y-3">
//         {loading ? (
//           <p className="text-center py-10 text-muted-foreground text-sm">
//             Loading...
//           </p>
//         ) : filtered.length === 0 ? (
//           <p className="text-center py-10 text-muted-foreground text-sm">
//             No lessons found.
//           </p>
//         ) : (
//           filtered.map((lesson) => (
//             <div
//               key={lesson.id}
//               className="rounded-xl border bg-card p-4 shadow-sm space-y-3"
//             >
//               <div className="flex items-start justify-between gap-3">
//                 <div>
//                   <p className="font-semibold text-sm text-black">
//                     {lesson.title}
//                   </p>
//                   <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
//                     {lesson.content}
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-1 shrink-0">
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8 bg-white text-black border border-gray-300 hover:bg-gray-100"
//                     onClick={() => {
//                       setSelectedLesson(lesson);
//                       setEditOpen(true);
//                     }}
//                   >
//                     <Pencil className="h-3.5 w-3.5" />
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8 border border-gray-300 text-destructive hover:bg-red-50"
//                     onClick={() => {
//                       setSelectedLesson(lesson);
//                       setDeleteOpen(true);
//                     }}
//                   >
//                     <Trash2 className="h-3.5 w-3.5" />
//                   </Button>
//                 </div>
//               </div>

//               {/* Clickable material pills on mobile too */}
//               {!!lesson.materials?.length && (
//                 <div className="flex flex-wrap gap-1">
//                   {lesson.materials.map((m, i) => (
//                     <MaterialPill
//                       key={i}
//                       title={m.title}
//                       type={m.type}
//                       url={m.url}
//                     />
//                   ))}
//                 </div>
//               )}

//               <div className="flex items-center justify-between text-xs text-muted-foreground">
//                 <Badge variant="secondary">
//                   {lesson.materials?.length ?? 0} materials
//                 </Badge>
//                 <span>{formatDate(lesson.createdAt)}</span>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       <LessonDialog
//         open={addOpen}
//         onOpenChange={setAddOpen}
//         onSubmit={handleAdd}
//         loading={actionLoading}
//         isEdit={false}
//       />
//       <LessonDialog
//         open={editOpen}
//         onOpenChange={setEditOpen}
//         initialValues={selectedLesson ?? undefined}
//         onSubmit={handleEdit}
//         loading={actionLoading}
//         isEdit={true}
//       />
//       <ConfirmDeleteDialog
//         open={deleteOpen}
//         onOpenChange={setDeleteOpen}
//         onConfirm={handleDelete}
//         loading={actionLoading}
//         lessonTitle={selectedLesson?.title}
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
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/core/components/ui/table";
import {
  Pencil, Trash2, PlusCircle, Search,
  FileText, Video, Link2, Image, File, HelpCircle, ExternalLink,
} from "lucide-react";
import { LessonDialog } from "./LessonDialog";
import { SubmitMode } from "./LessonForm";
import { ConfirmDeleteDialog } from "./ConfirmDelete";
import { Lesson } from "../types/lesson.types";

type LessonPayload = Partial<Lesson>;

interface LessonTableProps {
  lessons: Lesson[];
  onAdd: (values: LessonPayload) => Promise<void>;
  onEdit: (id: string, values: LessonPayload, mode: SubmitMode) => Promise<void>;
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

function MaterialSummary({ materials }: { materials: Lesson["materials"] }) {
  if (!materials?.length) return <span className="text-xs text-muted-foreground">—</span>;
  const visible = materials.slice(0, 2);
  const rest = materials.length - visible.length;
  return (
    <div className="flex flex-wrap gap-1 items-center">
      {visible.map((m, i) => <MaterialPill key={i} title={m.title} type={m.type} url={m.url} />)}
      {rest > 0 && <span className="text-xs text-muted-foreground">+{rest} more</span>}
    </div>
  );
}

export function LessonTable({ lessons, onAdd, onEdit, onDelete, loading = false }: LessonTableProps) {
  const [search, setSearch]               = useState("");
  const [addOpen, setAddOpen]             = useState(false);
  const [editOpen, setEditOpen]           = useState(false);
  const [deleteOpen, setDeleteOpen]       = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const filtered = lessons.filter(l =>
    l.title.toLowerCase().includes(search.toLowerCase()) ||
    l.content.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async (values: LessonPayload, _mode: SubmitMode) => {
    setActionLoading(true);
    try { await onAdd(values); setAddOpen(false); } finally { setActionLoading(false); }
  };

  const handleEdit = async (values: LessonPayload, mode: SubmitMode) => {
    if (!selectedLesson) return;
    setActionLoading(true);
    try { await onEdit(selectedLesson.id, values, mode); setEditOpen(false); setSelectedLesson(null); }
    finally { setActionLoading(false); }
  };

  const handleDelete = async () => {
    if (!selectedLesson) return;
    setActionLoading(true);
    try { await onDelete(selectedLesson.id); setDeleteOpen(false); setSelectedLesson(null); }
    finally { setActionLoading(false); }
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString("en-GB");

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by title or content..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-full" />
        </div>
        <Button className="bg-black hover:bg-gray-700 text-white w-full sm:w-auto" onClick={() => setAddOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />Add Lesson
        </Button>
      </div>

      {/* Desktop Table */}
      <ScrollArea className="h-[600px] hidden lg:block rounded-md border-b-4 border-t-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-black font-semibold">Title</TableHead>
              <TableHead className="text-black font-semibold">Class</TableHead>
              <TableHead className="text-black font-semibold">Subject</TableHead>
              <TableHead className="text-black font-semibold">Teacher</TableHead>
              <TableHead className="text-black font-semibold">Materials</TableHead>
              <TableHead className="text-black font-semibold">Published</TableHead>
              <TableHead className="text-black font-semibold">Created</TableHead>
              <TableHead className="text-right text-black font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={8} className="text-center py-10 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={8} className="text-center py-10 text-muted-foreground">No lessons found.</TableCell></TableRow>
            ) : (
              filtered.map((lesson) => (
                <TableRow key={lesson.id}>
                  <TableCell className="font-medium text-black">{lesson.title}</TableCell>
                  <TableCell className="text-sm text-black">{lesson.classSubject?.class?.name ?? "—"}</TableCell>
                  <TableCell className="text-sm text-black">{lesson.classSubject?.subject?.name ?? "—"}</TableCell>
                  <TableCell className="text-sm text-black">{lesson.classSubject?.teacher?.username ?? "—"}</TableCell>
                  <TableCell className="max-w-[200px]"><MaterialSummary materials={lesson.materials} /></TableCell>
                  <TableCell>
                    {lesson.isPublished
                      ? <Badge variant="default">Published</Badge>
                      : <Badge variant="secondary">Draft</Badge>}
                  </TableCell>
                  <TableCell className="text-sm text-black">{formatDate(lesson.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="bg-white text-black border border-gray-300 hover:bg-gray-100"
                        onClick={() => { setSelectedLesson(lesson); setEditOpen(true); }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="hover:bg-red-600 border border-gray-300 text-destructive"
                        onClick={() => { setSelectedLesson(lesson); setDeleteOpen(true); }}>
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
          <p className="text-center py-10 text-muted-foreground text-sm">No lessons found.</p>
        ) : (
          filtered.map((lesson) => (
            <div key={lesson.id} className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-sm text-black">{lesson.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {lesson.classSubject?.class?.name ?? "—"} · {lesson.classSubject?.subject?.name ?? "—"} · {lesson.classSubject?.teacher?.username ?? "—"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{lesson.content}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8 bg-white text-black border border-gray-300 hover:bg-gray-100"
                    onClick={() => { setSelectedLesson(lesson); setEditOpen(true); }}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 border border-gray-300 text-destructive hover:bg-red-50"
                    onClick={() => { setSelectedLesson(lesson); setDeleteOpen(true); }}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              {!!lesson.materials?.length && (
                <div className="flex flex-wrap gap-1">
                  {lesson.materials.map((m, i) => <MaterialPill key={i} title={m.title} type={m.type} url={m.url} />)}
                </div>
              )}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex gap-2">
                  <Badge variant="secondary">{lesson.materials?.length ?? 0} materials</Badge>
                  {lesson.isPublished ? <Badge variant="default">Published</Badge> : <Badge variant="secondary">Draft</Badge>}
                </div>
                <span>{formatDate(lesson.createdAt)}</span>
              </div>
            </div>
          ))
        )}
        </div>
      </ScrollArea>

      <LessonDialog open={addOpen} onOpenChange={setAddOpen} onSubmit={handleAdd} loading={actionLoading} isEdit={false} />
      <LessonDialog open={editOpen} onOpenChange={setEditOpen} initialValues={selectedLesson ?? undefined} onSubmit={handleEdit} loading={actionLoading} isEdit={true} />
      <ConfirmDeleteDialog open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={handleDelete} loading={actionLoading} lessonTitle={selectedLesson?.title} />
    </div>
  );
}