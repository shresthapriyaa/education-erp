// // "use client";

// // import { useState } from "react";
// // import { Button } from "@/core/components/ui/button";
// // import { Input } from "@/core/components/ui/input";
// // import { Badge } from "@/core/components/ui/badge";
// // import {
// //   Table, TableBody, TableCell, TableHead,
// //   TableHeader, TableRow,
// // } from "@/core/components/ui/table";
// // import { Pencil, Trash2, PlusCircle, Search } from "lucide-react";
// // import { ResultDialog } from "./ResultDialog";
// // import { SubmitMode } from "./ResultForm";
// // import { ConfirmDeleteDialog } from "./ConfirmDelete";
// // import { Result } from "../types/result.types";

// // type ResultPayload = Partial<Result> & { studentId?: string; subjectId?: string };

// // interface ResultTableProps {
// //   results: Result[];
// //   onAdd: (values: ResultPayload) => Promise<void>;
// //   onEdit: (id: string, values: ResultPayload, mode: SubmitMode) => Promise<void>;
// //   onDelete: (id: string) => Promise<void>;
// //   loading?: boolean;
// // }

// // const gradeColor = (grade: string) => {
// //   if (["A+", "A", "A-"].includes(grade)) return "default";
// //   if (["B+", "B", "B-"].includes(grade)) return "secondary";
// //   if (["C+", "C", "C-"].includes(grade)) return "outline";
// //   return "destructive";
// // };

// // export function ResultTable({
// //   results, onAdd, onEdit, onDelete, loading = false,
// // }: ResultTableProps) {
// //   const [search, setSearch] = useState("");
// //   const [addOpen, setAddOpen] = useState(false);
// //   const [editOpen, setEditOpen] = useState(false);
// //   const [deleteOpen, setDeleteOpen] = useState(false);
// //   const [selectedResult, setSelectedResult] = useState<Result | null>(null);
// //   const [actionLoading, setActionLoading] = useState(false);

// //   const filtered = results.filter(
// //     (r) =>
// //       (r.student?.username ?? "").toLowerCase().includes(search.toLowerCase()) ||
// //       (r.subject?.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
// //       r.grade.toLowerCase().includes(search.toLowerCase())
// //   );

// //   const handleAdd = async (values: ResultPayload, _mode: SubmitMode) => {
// //     setActionLoading(true);
// //     try {
// //       await onAdd(values);
// //       setAddOpen(false);
// //     } finally {
// //       setActionLoading(false);
// //     }
// //   };

// //   const handleEdit = async (values: ResultPayload, mode: SubmitMode) => {
// //     if (!selectedResult) return;
// //     setActionLoading(true);
// //     try {
// //       await onEdit(selectedResult.id, values, mode);
// //       setEditOpen(false);
// //       setSelectedResult(null);
// //     } finally {
// //       setActionLoading(false);
// //     }
// //   };

// //   const handleDelete = async () => {
// //     if (!selectedResult) return;
// //     setActionLoading(true);
// //     try {
// //       await onDelete(selectedResult.id);
// //       setDeleteOpen(false);
// //       setSelectedResult(null);
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
// //             placeholder="Search by student, subject or grade..."
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
// //           Add Result
// //         </Button>
// //       </div>

// //       {/* Desktop Table */}
// //       <div className="hidden lg:block rounded-md border-b-4 border-t-4 overflow-x-auto">
// //         <Table>
// //           <TableHeader>
// //             <TableRow>
// //               <TableHead className="text-black font-semibold w-[30%]">Student</TableHead>
// //               <TableHead className="text-black font-semibold w-[30%]">Subject</TableHead>
// //               <TableHead className="text-black font-semibold w-[15%]">Grade</TableHead>
// //               <TableHead className="text-black font-semibold w-[15%]" >Date</TableHead>
// //               <TableHead className=" text-right text-black font-semibold w-[10%]">Actions</TableHead>
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
// //                   No results found.
// //                 </TableCell>
// //               </TableRow>
// //             ) : (
// //               filtered.map((result) => (
// //                 <TableRow key={result.id}>
// //                   <TableCell className="font-medium text-black">
// //                     {result.student?.username ?? "—"}
// //                   </TableCell>
// //                   <TableCell className="text-sm text-black">
// //                     {result.subject?.name ?? "—"}
// //                   </TableCell>
// //                   <TableCell>
// //                     <Badge variant={gradeColor(result.grade)}>
// //                       {result.grade}
// //                     </Badge>
// //                   </TableCell>
// //                   <TableCell className="text-sm text-black">
// //                     {formatDate(result.createdAt)}
// //                   </TableCell>
// //                   <TableCell className="text-right">
// //                     <div className="flex justify-end gap-2">
// //                       <Button
// //                         variant="ghost" size="icon"
// //                         className="bg-white text-black border border-gray-300 hover:bg-gray-100"
// //                         onClick={() => { setSelectedResult(result); setEditOpen(true); }}
// //                       >
// //                         <Pencil className="h-4 w-4" />
// //                       </Button>
// //                       <Button
// //                         variant="ghost" size="icon"
// //                         className="hover:bg-red-600 border border-gray-300 text-destructive"
// //                         onClick={() => { setSelectedResult(result); setDeleteOpen(true); }}
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
// //           <p className="text-center py-10 text-muted-foreground text-sm">No results found.</p>
// //         ) : (
// //           filtered.map((result) => (
// //             <div key={result.id} className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
// //               <div className="flex items-start justify-between gap-3">
// //                 <div>
// //                   <p className="font-semibold text-sm text-black">
// //                     {result.student?.username ?? "—"}
// //                   </p>
// //                   <p className="text-xs text-muted-foreground mt-1">
// //                     {result.subject?.name ?? "—"}
// //                   </p>
// //                 </div>
// //                 <div className="flex items-center gap-1 shrink-0">
// //                   <Button
// //                     variant="ghost" size="icon"
// //                     className="h-8 w-8 bg-white text-black border border-gray-300 hover:bg-gray-100"
// //                     onClick={() => { setSelectedResult(result); setEditOpen(true); }}
// //                   >
// //                     <Pencil className="h-3.5 w-3.5" />
// //                   </Button>
// //                   <Button
// //                     variant="ghost" size="icon"
// //                     className="h-8 w-8 border border-gray-300 text-destructive hover:bg-red-50"
// //                     onClick={() => { setSelectedResult(result); setDeleteOpen(true); }}
// //                   >
// //                     <Trash2 className="h-3.5 w-3.5" />
// //                   </Button>
// //                 </div>
// //               </div>
// //               <div className="flex items-center justify-between">
// //                 <p className="text-xs text-muted-foreground">{formatDate(result.createdAt)}</p>
// //                 <Badge variant={gradeColor(result.grade)}>{result.grade}</Badge>
// //               </div>
// //             </div>
// //           ))
// //         )}
// //       </div>

// //       <ResultDialog
// //         open={addOpen}
// //         onOpenChange={setAddOpen}
// //         onSubmit={handleAdd}
// //         loading={actionLoading}
// //         isEdit={false}
// //       />
// //       <ResultDialog
// //         open={editOpen}
// //         onOpenChange={setEditOpen}
// //         initialValues={selectedResult ?? undefined}
// //         onSubmit={handleEdit}
// //         loading={actionLoading}
// //         isEdit={true}
// //       />
// //       <ConfirmDeleteDialog 
// //         open={deleteOpen}
// //         onOpenChange={setDeleteOpen}
// //         onConfirm={handleDelete}
// //         loading={actionLoading}
// //         resultInfo={selectedResult?.student?.username}
// //       />
// //     </div>
// //   );
// // }







// // "use client";

// // import { useState } from "react";
// // import { Button } from "@/core/components/ui/button";
// // import { Input } from "@/core/components/ui/input";
// // import { Badge } from "@/core/components/ui/badge";
// // import {
// //   Table, TableBody, TableCell, TableHead,
// //   TableHeader, TableRow,
// // } from "@/core/components/ui/table";
// // import { Pencil, Trash2, PlusCircle, Search } from "lucide-react";
// // import { ResultDialog } from "./ResultDialog";
// // import { SubmitMode } from "./ResultForm";
// // import { ConfirmDeleteDialog } from "./ConfirmDelete";
// // import { Result } from "../types/result.types";

// // type ResultPayload = Partial<Result> & { studentId?: string; subjectId?: string };

// // interface ResultTableProps {
// //   results: Result[];
// //   onAdd: (values: ResultPayload) => Promise<void>;
// //   onEdit: (id: string, values: ResultPayload, mode: SubmitMode) => Promise<void>;
// //   onDelete: (id: string) => Promise<void>;
// //   loading?: boolean;
// // }

// // const gradeColor = (grade: string) => {
// //   if (["A+", "A", "A-"].includes(grade)) return "default";
// //   if (["B+", "B", "B-"].includes(grade)) return "secondary";
// //   if (["C+", "C", "C-"].includes(grade)) return "outline";
// //   return "destructive";
// // };

// // export function ResultTable({
// //   results, onAdd, onEdit, onDelete, loading = false,
// // }: ResultTableProps) {
// //   const [search, setSearch] = useState("");
// //   const [addOpen, setAddOpen] = useState(false);
// //   const [editOpen, setEditOpen] = useState(false);
// //   const [deleteOpen, setDeleteOpen] = useState(false);
// //   const [selectedResult, setSelectedResult] = useState<Result | null>(null);
// //   const [actionLoading, setActionLoading] = useState(false);

// //   const filtered = results.filter(
// //     (r) =>
// //       (r.student?.username ?? "").toLowerCase().includes(search.toLowerCase()) ||
// //       (r.subject?.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
// //       r.grade.toLowerCase().includes(search.toLowerCase())
// //   );

// //   const handleAdd = async (values: ResultPayload, _mode: SubmitMode) => {
// //     setActionLoading(true);
// //     try {
// //       await onAdd(values);
// //       setAddOpen(false);
// //     } finally {
// //       setActionLoading(false);
// //     }
// //   };

// //   const handleEdit = async (values: ResultPayload, mode: SubmitMode) => {
// //     if (!selectedResult) return;
// //     setActionLoading(true);
// //     try {
// //       await onEdit(selectedResult.id, values, mode);
// //       setEditOpen(false);
// //       setSelectedResult(null);
// //     } finally {
// //       setActionLoading(false);
// //     }
// //   };

// //   const handleDelete = async () => {
// //     if (!selectedResult) return;
// //     setActionLoading(true);
// //     try {
// //       await onDelete(selectedResult.id);
// //       setDeleteOpen(false);
// //       setSelectedResult(null);
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
// //             placeholder="Search by student, subject or grade..."
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
// //           Add Result
// //         </Button>
// //       </div>

// //       {/* Desktop Table */}
// //       <div className="hidden lg:block rounded-md border-b-4 border-t-4 overflow-x-auto">
// //         <Table className="table-fixed w-full">
// //           <TableHeader>
// //             <TableRow>
// //               <TableHead className="text-black font-semibold w-[30%]">Student</TableHead>
// //               <TableHead className="text-black font-semibold w-[30%]">Subject</TableHead>
// //               <TableHead className="text-black font-semibold w-[15%]">Grade</TableHead>
// //               <TableHead className="text-black font-semibold w-[15%]">Date</TableHead>
// //               <TableHead className="text-black font-semibold w-[10%]">Actions</TableHead>
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
// //                   No results found.
// //                 </TableCell>
// //               </TableRow>
// //             ) : (
// //               filtered.map((result) => (
// //                 <TableRow key={result.id}>
// //                   <TableCell className="font-medium text-black truncate">
// //                     {result.student?.username ?? "—"}
// //                   </TableCell>
// //                   <TableCell className="text-sm text-black truncate">
// //                     {result.subject?.name ?? "—"}
// //                   </TableCell>
// //                   <TableCell>
// //                     <Badge variant={gradeColor(result.grade)}>
// //                       {result.grade}
// //                     </Badge>
// //                   </TableCell>
// //                   <TableCell className="text-sm text-black">
// //                     {formatDate(result.createdAt)}
// //                   </TableCell>
// //                   <TableCell>
// //                     <div className="flex gap-2">
// //                       <Button
// //                         variant="ghost" size="icon"
// //                         className="bg-white text-black border border-gray-300 hover:bg-gray-100"
// //                         onClick={() => { setSelectedResult(result); setEditOpen(true); }}
// //                       >
// //                         <Pencil className="h-4 w-4" />
// //                       </Button>
// //                       <Button
// //                         variant="ghost" size="icon"
// //                         className="hover:bg-red-600 border border-gray-300 text-destructive"
// //                         onClick={() => { setSelectedResult(result); setDeleteOpen(true); }}
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
// //           <p className="text-center py-10 text-muted-foreground text-sm">No results found.</p>
// //         ) : (
// //           filtered.map((result) => (
// //             <div key={result.id} className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
// //               <div className="flex items-start justify-between gap-3">
// //                 <div>
// //                   <p className="font-semibold text-sm text-black">
// //                     {result.student?.username ?? "—"}
// //                   </p>
// //                   <p className="text-xs text-muted-foreground mt-1">
// //                     {result.subject?.name ?? "—"}
// //                   </p>
// //                 </div>
// //                 <div className="flex items-center gap-1 shrink-0">
// //                   <Button
// //                     variant="ghost" size="icon"
// //                     className="h-8 w-8 bg-white text-black border border-gray-300 hover:bg-gray-100"
// //                     onClick={() => { setSelectedResult(result); setEditOpen(true); }}
// //                   >
// //                     <Pencil className="h-3.5 w-3.5" />
// //                   </Button>
// //                   <Button
// //                     variant="ghost" size="icon"
// //                     className="h-8 w-8 border border-gray-300 text-destructive hover:bg-red-50"
// //                     onClick={() => { setSelectedResult(result); setDeleteOpen(true); }}
// //                   >
// //                     <Trash2 className="h-3.5 w-3.5" />
// //                   </Button>
// //                 </div>
// //               </div>
// //               <div className="flex items-center justify-between">
// //                 <p className="text-xs text-muted-foreground">{formatDate(result.createdAt)}</p>
// //                 <Badge variant={gradeColor(result.grade)}>{result.grade}</Badge>
// //               </div>
// //             </div>
// //           ))
// //         )}
// //       </div>

// //       <ResultDialog
// //         open={addOpen}
// //         onOpenChange={setAddOpen}
// //         onSubmit={handleAdd}
// //         loading={actionLoading}
// //         isEdit={false}
// //       />
// //       <ResultDialog
// //         open={editOpen}
// //         onOpenChange={setEditOpen}
// //         initialValues={selectedResult ?? undefined}
// //         onSubmit={handleEdit}
// //         loading={actionLoading}
// //         isEdit={true}
// //       />
// //       <ConfirmDeleteDialog
// //         open={deleteOpen}
// //         onOpenChange={setDeleteOpen}
// //         onConfirm={handleDelete}
// //         loading={actionLoading}
// //         resultInfo={selectedResult?.student?.username}
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
//   Table, TableBody, TableCell, TableHead,
//   TableHeader, TableRow,
// } from "@/core/components/ui/table";
// import { Pencil, Trash2, PlusCircle, Search } from "lucide-react";
// import { ResultDialog } from "./ResultDialog";
// import { SubmitMode } from "./ResultForm";
// import { ConfirmDeleteDialog } from "./ConfirmDelete";
// import { Result } from "../types/result.types";

// type ResultPayload = Partial<Result> & { studentId?: string; subjectId?: string };

// interface ResultTableProps {
//   results: Result[];
//   onAdd: (values: ResultPayload) => Promise<void>;
//   onEdit: (id: string, values: ResultPayload, mode: SubmitMode) => Promise<void>;
//   onDelete: (id: string) => Promise<void>;
//   loading?: boolean;
// }

// const gradeColor = (grade: string) => {
//   if (["A+", "A", "A-"].includes(grade)) return "default";
//   if (["B+", "B", "B-"].includes(grade)) return "secondary";
//   if (["C+", "C", "C-"].includes(grade)) return "outline";
//   return "destructive";
// };

// export function ResultTable({
//   results, onAdd, onEdit, onDelete, loading = false,
// }: ResultTableProps) {
//   const [search, setSearch] = useState("");
//   const [addOpen, setAddOpen] = useState(false);
//   const [editOpen, setEditOpen] = useState(false);
//   const [deleteOpen, setDeleteOpen] = useState(false);
//   const [selectedResult, setSelectedResult] = useState<Result | null>(null);
//   const [actionLoading, setActionLoading] = useState(false);

//   const filtered = results.filter(
//     (r) =>
//       (r.student?.username ?? "").toLowerCase().includes(search.toLowerCase()) ||
//       (r.subject?.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
//       r.grade.toLowerCase().includes(search.toLowerCase())
//   );

//   const handleAdd = async (values: ResultPayload, _mode: SubmitMode) => {
//     setActionLoading(true);
//     try {
//       await onAdd(values);
//       setAddOpen(false);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleEdit = async (values: ResultPayload, mode: SubmitMode) => {
//     if (!selectedResult) return;
//     setActionLoading(true);
//     try {
//       await onEdit(selectedResult.id, values, mode);
//       setEditOpen(false);
//       setSelectedResult(null);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (!selectedResult) return;
//     setActionLoading(true);
//     try {
//       await onDelete(selectedResult.id);
//       setDeleteOpen(false);
//       setSelectedResult(null);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const formatDate = (date: string) => new Date(date).toLocaleDateString("en-GB");

//   return (
//     <div className="space-y-4">
//       <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//           <Input
//             placeholder="Search by student, subject or grade..."
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
//           Add Result
//         </Button>
//       </div>

//       {/* Desktop Table */}
//       <div className="hidden lg:block rounded-md border-b-4 border-t-4 overflow-x-auto">
//         <Table className="w-full">
//           <TableHeader>
//             <TableRow>
//               <TableHead className="text-black font-semibold w-[25%]">Student</TableHead>
//               <TableHead className="text-black font-semibold w-[25%]">Subject</TableHead>
//               <TableHead className="text-black font-semibold w-[15%]">Grade</TableHead>
//               <TableHead className="text-black font-semibold w-[20%]">Date</TableHead>
//               <TableHead className="text-black font-semibold w-auto">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {loading ? (
//               <TableRow>
//                 <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
//                   Loading...
//                 </TableCell>
//               </TableRow>
//             ) : filtered.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
//                   No results found.
//                 </TableCell>
//               </TableRow>
//             ) : (
//               filtered.map((result) => (
//                 <TableRow key={result.id}>
//                   <TableCell className="font-medium text-black truncate">
//                     {result.student?.username ?? "—"}
//                   </TableCell>
//                   <TableCell className="text-sm text-black truncate">
//                     {result.subject?.name ?? "—"}
//                   </TableCell>
//                   <TableCell>
//                     <Badge variant={gradeColor(result.grade)}>
//                       {result.grade}
//                     </Badge>
//                   </TableCell>
//                   <TableCell className="text-sm text-black">
//                     {formatDate(result.createdAt)}
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex gap-2">
//                       <Button
//                         variant="ghost" size="icon"
//                         className="bg-white text-black border border-gray-300 hover:bg-gray-100"
//                         onClick={() => { setSelectedResult(result); setEditOpen(true); }}
//                       >
//                         <Pencil className="h-4 w-4" />
//                       </Button>
//                       <Button
//                         variant="ghost" size="icon"
//                         className="hover:bg-red-600 border border-gray-300 text-destructive"
//                         onClick={() => { setSelectedResult(result); setDeleteOpen(true); }}
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
//           <p className="text-center py-10 text-muted-foreground text-sm">No results found.</p>
//         ) : (
//           filtered.map((result) => (
//             <div key={result.id} className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
//               <div className="flex items-start justify-between gap-3">
//                 <div>
//                   <p className="font-semibold text-sm text-black">
//                     {result.student?.username ?? "—"}
//                   </p>
//                   <p className="text-xs text-muted-foreground mt-1">
//                     {result.subject?.name ?? "—"}
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-1 shrink-0">
//                   <Button
//                     variant="ghost" size="icon"
//                     className="h-8 w-8 bg-white text-black border border-gray-300 hover:bg-gray-100"
//                     onClick={() => { setSelectedResult(result); setEditOpen(true); }}
//                   >
//                     <Pencil className="h-3.5 w-3.5" />
//                   </Button>
//                   <Button
//                     variant="ghost" size="icon"
//                     className="h-8 w-8 border border-gray-300 text-destructive hover:bg-red-50"
//                     onClick={() => { setSelectedResult(result); setDeleteOpen(true); }}
//                   >
//                     <Trash2 className="h-3.5 w-3.5" />
//                   </Button>
//                 </div>
//               </div>
//               <div className="flex items-center justify-between">
//                 <p className="text-xs text-muted-foreground">{formatDate(result.createdAt)}</p>
//                 <Badge variant={gradeColor(result.grade)}>{result.grade}</Badge>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       <ResultDialog
//         open={addOpen}
//         onOpenChange={setAddOpen}
//         onSubmit={handleAdd}
//         loading={actionLoading}
//         isEdit={false}
//       />
//       <ResultDialog
//         open={editOpen}
//         onOpenChange={setEditOpen}
//         initialValues={selectedResult ?? undefined}
//         onSubmit={handleEdit}
//         loading={actionLoading}
//         isEdit={true}
//       />
//       <ConfirmDeleteDialog
//         open={deleteOpen}
//         onOpenChange={setDeleteOpen}
//         onConfirm={handleDelete}
//         loading={actionLoading}
//         resultInfo={selectedResult?.student?.username}
//       />
//     </div>
//   );
// }




"use client";

import { useState } from "react";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { Badge } from "@/core/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/core/components/ui/table";
import { Pencil, Trash2, PlusCircle, Search } from "lucide-react";
import { ResultDialog } from "./ResultDialog";
import { SubmitMode } from "./ResultForm";
import { ConfirmDeleteDialog } from "./ConfirmDelete";
import { Result } from "../types/result.types";

type ResultPayload = Partial<Result>;

interface ResultTableProps {
  results: Result[];
  onAdd: (values: ResultPayload) => Promise<void>;
  onEdit: (id: string, values: ResultPayload, mode: SubmitMode) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  loading?: boolean;
}

const gradeColor = (grade: string) => {
  if (["A+", "A", "A-"].includes(grade)) return "default";
  if (["B+", "B", "B-"].includes(grade)) return "secondary";
  if (["C+", "C", "C-"].includes(grade)) return "outline";
  return "destructive";
};

export function ResultTable({ results, onAdd, onEdit, onDelete, loading = false }: ResultTableProps) {
  const [search, setSearch]                 = useState("");
  const [addOpen, setAddOpen]               = useState(false);
  const [editOpen, setEditOpen]             = useState(false);
  const [deleteOpen, setDeleteOpen]         = useState(false);
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);
  const [actionLoading, setActionLoading]   = useState(false);

  const filtered = results.filter(r =>
    (r.student?.username ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (r.subject?.name     ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (r.class?.name       ?? "").toLowerCase().includes(search.toLowerCase()) ||
    r.grade.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async (values: ResultPayload, _mode: SubmitMode) => {
    setActionLoading(true);
    try { await onAdd(values); setAddOpen(false); } finally { setActionLoading(false); }
  };

  const handleEdit = async (values: ResultPayload, mode: SubmitMode) => {
    if (!selectedResult) return;
    setActionLoading(true);
    try { await onEdit(selectedResult.id, values, mode); setEditOpen(false); setSelectedResult(null); }
    finally { setActionLoading(false); }
  };

  const handleDelete = async () => {
    if (!selectedResult) return;
    setActionLoading(true);
    try { await onDelete(selectedResult.id); setDeleteOpen(false); setSelectedResult(null); }
    finally { setActionLoading(false); }
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString("en-GB");

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by student, subject or grade..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-full" />
        </div>
        <Button className="bg-black hover:bg-gray-700 text-white w-full sm:w-auto" onClick={() => setAddOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />Add Result
        </Button>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block rounded-md border-b-4 border-t-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-black font-semibold">Student</TableHead>
              <TableHead className="text-black font-semibold">Class</TableHead>
              <TableHead className="text-black font-semibold">Subject</TableHead>
              <TableHead className="text-black font-semibold">Term</TableHead>
              <TableHead className="text-black font-semibold">Marks</TableHead>
              <TableHead className="text-black font-semibold">%</TableHead>
              <TableHead className="text-black font-semibold">Grade</TableHead>
              <TableHead className="text-black font-semibold">Status</TableHead>
              <TableHead className="text-right text-black font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={9} className="text-center py-10 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={9} className="text-center py-10 text-muted-foreground">No results found.</TableCell></TableRow>
            ) : (
              filtered.map((result) => (
                <TableRow key={result.id}>
                  <TableCell className="font-medium text-black">{result.student?.username ?? "—"}</TableCell>
                  <TableCell className="text-sm text-black">{result.class?.name ?? "—"}</TableCell>
                  <TableCell className="text-sm text-black">{result.subject?.name ?? "—"}</TableCell>
                  <TableCell className="text-sm text-black">{result.term}</TableCell>
                  <TableCell className="text-sm text-black">{result.obtainedMarks}/{result.totalMarks}</TableCell>
                  <TableCell className="text-sm text-black">{result.percentage}%</TableCell>
                  <TableCell><Badge variant={gradeColor(result.grade)}>{result.grade}</Badge></TableCell>
                  <TableCell>
                    {result.isPassed
                      ? <Badge variant="default">Passed</Badge>
                      : <Badge variant="destructive">Failed</Badge>}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="bg-white text-black border border-gray-300 hover:bg-gray-100"
                        onClick={() => { setSelectedResult(result); setEditOpen(true); }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="hover:bg-red-600 border border-gray-300 text-destructive"
                        onClick={() => { setSelectedResult(result); setDeleteOpen(true); }}>
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

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {loading ? (
          <p className="text-center py-10 text-muted-foreground text-sm">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center py-10 text-muted-foreground text-sm">No results found.</p>
        ) : (
          filtered.map((result) => (
            <div key={result.id} className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-sm text-black">{result.student?.username ?? "—"}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {result.class?.name ?? "—"} · {result.subject?.name ?? "—"} · {result.term}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {result.obtainedMarks}/{result.totalMarks} marks · {result.percentage}%
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8 bg-white text-black border border-gray-300 hover:bg-gray-100"
                    onClick={() => { setSelectedResult(result); setEditOpen(true); }}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 border border-gray-300 text-destructive hover:bg-red-50"
                    onClick={() => { setSelectedResult(result); setDeleteOpen(true); }}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant={gradeColor(result.grade)}>{result.grade}</Badge>
                {result.isPassed ? <Badge variant="default">Passed</Badge> : <Badge variant="destructive">Failed</Badge>}
              </div>
            </div>
          ))
        )}
      </div>

      <ResultDialog open={addOpen} onOpenChange={setAddOpen} onSubmit={handleAdd} loading={actionLoading} isEdit={false} />
      <ResultDialog open={editOpen} onOpenChange={setEditOpen} initialValues={selectedResult ?? undefined} onSubmit={handleEdit} loading={actionLoading} isEdit={true} />
      <ConfirmDeleteDialog open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={handleDelete} loading={actionLoading} resultInfo={selectedResult?.student?.username} />
    </div>
  );
}