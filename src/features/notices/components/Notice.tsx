"use client";

import { useEffect } from "react";
import { useNotices } from "@/features/notices/hooks/useNotices";
import { NoticeTable } from "@/features/notices/components/NoticeTable";
import type { Notice } from "@/features/notices/types/notice.types";

type NoticePayload = Partial<Notice>;

export default function NoticesPage() {
  const { notices, loading, fetchNotices, createNotice, updateNotice, patchNotice, deleteNotice } = useNotices();

  useEffect(() => { fetchNotices(); }, [fetchNotices]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notices</h1>
        <p className="text-muted-foreground">Manage school notices.</p>
      </div>
      <NoticeTable
        notices={notices}
        loading={loading}
        onAdd={async (values) => { await createNotice(values); }}
        onEdit={async (id, values, mode) => {
          if (mode === "patch") await patchNotice(id, values);
          else await updateNotice(id, values);
        }}
        onDelete={async (id) => { await deleteNotice(id); }}
      />
    </div>
  );
}