"use client";

import { useEffect } from "react";
import { useAnnouncements } from "@/features/announcements/hooks/useAnnouncements";
import { useAnnouncementFilters } from "@/features/announcements/hooks/useAnnouncementFilters";
import { AnnouncementTable } from "@/features/announcements/components/AnnouncementTable";
import type { Announcement } from "@/features/announcements/types/announcement.types";
import { SubmitMode } from "@/features/announcements/components/AnnouncementForm";

type AnnouncementPayload = Partial<Announcement>;

export default function AnnouncementsPage() {
  const {
    announcements, loading, fetchAnnouncements,
    createAnnouncement, updateAnnouncement, patchAnnouncement, deleteAnnouncement,
  } = useAnnouncements();

  const { filters } = useAnnouncementFilters();

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAnnouncements(filters);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters, fetchAnnouncements]);

  const handleAdd = async (values: AnnouncementPayload) => {
    await createAnnouncement(values);
  };

  const handleEdit = async (id: string, values: AnnouncementPayload, mode: SubmitMode) => {
    if (mode === "patch") {
      await patchAnnouncement(id, values);
    } else {
      await updateAnnouncement(id, values);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteAnnouncement(id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
        <p className="text-muted-foreground">
          Manage school announcements and notices.
        </p>
      </div>
      <AnnouncementTable
        announcements={announcements}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}