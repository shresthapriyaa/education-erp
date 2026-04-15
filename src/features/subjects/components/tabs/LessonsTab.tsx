"use client";

import { useState, useEffect } from "react";
import { Button } from "@/core/components/ui/button";
import { ScrollArea } from "@/core/components/ui/scroll-area";
import { PlusCircle, Loader2, BookOpen } from "lucide-react";
import { LessonDialog } from "@/features/lessons/components/LessonDialog";
import { LessonCard } from "../cards/LessonCard";
import { Lesson } from "@/features/lessons/types/lesson.types";
import { toast } from "sonner";

interface LessonsTabProps {
  subjectId: string;
  subjectName: string;
}

export function LessonsTab({ subjectId, subjectName }: LessonsTabProps) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadLessons();
  }, [subjectId]);

  async function loadLessons() {
    setLoading(true);
    try {
      const res = await fetch(`/api/lessons?subjectId=${subjectId}`);
      if (!res.ok) throw new Error("Failed to load lessons");
      const data = await res.json();
      setLessons(Array.isArray(data) ? data : []);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(values: any, mode: string) {
    setSubmitting(true);
    try {
      const url = editingLesson ? `/api/lessons/${editingLesson.id}` : "/api/lessons";
      const method = editingLesson ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, subjectId }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save lesson");
      }

      toast.success(editingLesson ? "Lesson updated" : "Lesson created");
      setDialogOpen(false);
      setEditingLesson(null);
      loadLessons();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this lesson?")) return;
    try {
      const res = await fetch(`/api/lessons/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Lesson deleted");
      loadLessons();
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  function handleEdit(lesson: Lesson) {
    setEditingLesson(lesson);
    setDialogOpen(true);
  }

  function handleAdd() {
    setEditingLesson(null);
    setDialogOpen(true);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {lessons.length} {lessons.length === 1 ? "lesson" : "lessons"}
        </p>
        <Button onClick={handleAdd} className="bg-black hover:bg-gray-800">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Lesson
        </Button>
      </div>

      {lessons.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground mb-4">No lessons yet</p>
          <Button onClick={handleAdd} variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create First Lesson
          </Button>
        </div>
      ) : (
        <ScrollArea className="h-[600px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
            {lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </ScrollArea>
      )}

      <LessonDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingLesson(null);
        }}
        initialValues={editingLesson || undefined}
        onSubmit={handleSubmit}
        loading={submitting}
        isEdit={!!editingLesson}
      />
    </div>
  );
}
