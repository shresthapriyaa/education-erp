// "use client";

// import { useEffect, useState } from "react";
// import { Plus, Search } from "lucide-react";
// import { Button } from "@/core/components/ui/button";
// import { Input }  from "@/core/components/ui/input";
// import { SessionDialog } from "@/features/sessions/components/SessionDialog";
// import { SessionTable }  from "@/features/sessions/components/SessionTable";
// import { ConfirmDelete } from "@/features/sessions/components/ConfirmDelete";
// import { useSessions }   from "@/features/sessions/hooks/useSessions";
// import type { SessionDTO, SessionFormValues } from "@/features/sessions/types/session.types";

// export default function SessionsPage() {
//   const { sessions, loading, load, create, update, toggle, remove } = useSessions();

//   const [search,       setSearch]       = useState("");
//   const [dialogOpen,   setDialogOpen]   = useState(false);
//   const [editRecord,   setEditRecord]   = useState<SessionDTO | undefined>();
//   const [deleteTarget, setDeleteTarget] = useState<SessionDTO | null>(null);

//   useEffect(() => { load(); }, [load]);

//   const filtered = sessions.filter(s =>
//     s.class.name.toLowerCase().includes(search.toLowerCase()) ||
//     s.school.name.toLowerCase().includes(search.toLowerCase())
//   );

//   function openCreate() {
//     setEditRecord(undefined);
//     setDialogOpen(true);
//   }

//   function openEdit(s: SessionDTO) {
//     setEditRecord(s);
//     setDialogOpen(true);
//   }

//   async function handleSubmit(values: SessionFormValues) {
//     if (editRecord) {
//       await update(editRecord.id, values);
//     } else {
//       await create(values);
//     }
//     setDialogOpen(false);
//   }

//   async function handleDelete() {
//     if (!deleteTarget) return;
//     await remove(deleteTarget.id);
//     setDeleteTarget(null);
//   }

//   const total  = sessions.length;
//   const open   = sessions.filter(s => s.isOpen).length;
//   const closed = total - open;

//   return (
//     <div className="p-6 space-y-6">

//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold">Sessions</h1>
//           <p className="text-muted-foreground text-sm">Manage class attendance sessions</p>
//         </div>
//         <Button onClick={openCreate}>
//           <Plus className="mr-2 h-4 w-4" /> Add Session
//         </Button>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-3 gap-4">
//         {[
//           { label: "Total",  value: total,  color: "" },
//           { label: "Open",   value: open,   color: "text-emerald-600" },
//           { label: "Closed", value: closed, color: "text-muted-foreground" },
//         ].map(stat => (
//           <div key={stat.label} className="rounded-xl border bg-card p-4 text-center">
//             <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
//             <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
//           </div>
//         ))}
//       </div>

//       {/* Search */}
//       <div className="relative max-w-sm">
//         <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//         <Input
//           placeholder="Search class or school…"
//           value={search}
//           onChange={e => setSearch(e.target.value)}
//           className="pl-9"
//         />
//       </div>

//       {/* Table */}
//       <SessionTable
//         sessions={filtered}
//         loading={loading}
//         onEdit={openEdit}
//         onDelete={s => setDeleteTarget(s)}
//         onToggle={s => toggle(s.id, !s.isOpen)}
//       />

//       {/* Create / Edit dialog */}
//       <SessionDialog
//         open={dialogOpen}
//         onOpenChange={setDialogOpen}
//         record={editRecord}
//         onSubmit={handleSubmit}
//         isLoading={loading}
//       />

//       {/* Delete confirm */}
//       <ConfirmDelete
//         open={!!deleteTarget}
//         onOpenChange={o => !o && setDeleteTarget(null)}
//         title="Delete Session?"
//         description={
//           deleteTarget
//             ? `Permanently delete the session for "${deleteTarget.class.name}" on ${new Date(deleteTarget.date).toLocaleDateString()}? This cannot be undone.`
//             : "This action cannot be undone."
//         }
//         onConfirm={handleDelete}
//         isLoading={loading}
//       />
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { Input }  from "@/core/components/ui/input";
import { SessionDialog } from "@/features/sessions/components/SessionDialog";
import { SessionTable }  from "@/features/sessions/components/SessionTable";
import { ConfirmDelete } from "@/features/sessions/components/ConfirmDelete";
import { useSessions }   from "@/features/sessions/hooks/useSessions";
import type { SessionDTO, SessionFormValues } from "@/features/sessions/types/session.types";

export default function SessionsPage() {
  const { sessions, loading, load, create, update, toggle, remove } = useSessions();

  const [search,       setSearch]       = useState("");
  const [dialogOpen,   setDialogOpen]   = useState(false);
  const [editRecord,   setEditRecord]   = useState<SessionDTO | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<SessionDTO | null>(null);

  useEffect(() => { load(); }, [load]);

  // ✅ safe fallbacks — skip sessions missing class/school
  const filtered = sessions.filter(s =>
    s?.class?.name && s?.school?.name
  ).filter(s =>
    s.class.name.toLowerCase().includes(search.toLowerCase()) ||
    s.school.name.toLowerCase().includes(search.toLowerCase())
  );

  function openCreate() {
    setEditRecord(undefined);
    setDialogOpen(true);
  }

  function openEdit(s: SessionDTO) {
    setEditRecord(s);
    setDialogOpen(true);
  }

  async function handleSubmit(values: SessionFormValues) {
    if (editRecord) {
      await update(editRecord.id, values);
    } else {
      await create(values);
    }
    setDialogOpen(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await remove(deleteTarget.id);
    setDeleteTarget(null);
  }

  const total  = sessions.length;
  const open   = sessions.filter(s => s.isOpen).length;
  const closed = total - open;

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sessions</h1>
          <p className="text-muted-foreground text-sm">Manage class attendance sessions</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Session
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total",  value: total,  color: "" },
          { label: "Open",   value: open,   color: "text-emerald-600" },
          { label: "Closed", value: closed, color: "text-muted-foreground" },
        ].map(stat => (
          <div key={stat.label} className="rounded-xl border bg-card p-4 text-center">
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search class or school…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <SessionTable
        sessions={filtered}
        loading={loading}
        onEdit={openEdit}
        onDelete={s => setDeleteTarget(s)}
        onToggle={s => toggle(s.id, !s.isOpen)}
      />

      {/* Create / Edit dialog */}
      <SessionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        record={editRecord}
        onSubmit={handleSubmit}
        isLoading={loading}
      />

      {/* Delete confirm */}
      <ConfirmDelete
        open={!!deleteTarget}
        onOpenChange={o => !o && setDeleteTarget(null)}
        title="Delete Session?"
        description={
          deleteTarget
            ? `Permanently delete the session for "${deleteTarget.class.name}" on ${new Date(deleteTarget.date).toLocaleDateString()}? This cannot be undone.`
            : "This action cannot be undone."
        }
        onConfirm={handleDelete}
        isLoading={loading}
      />
    </div>
  );
}
