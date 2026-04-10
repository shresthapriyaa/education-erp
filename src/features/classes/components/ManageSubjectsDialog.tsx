"use client";

import { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription,
} from "@/core/components/ui/dialog";
import { Button } from "@/core/components/ui/button";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/core/components/ui/select";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ClassSubject {
  id: string;
  subject: { id: string; name: string; code?: string | null };
  teacher?: { id: string; username: string; email: string } | null;
}

interface Subject {
  id: string;
  name: string;
  code?: string | null;
}

interface Teacher {
  id: string;
  username: string;
  email: string;
}

interface ManageSubjectsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classId: string;
  className: string;
  onSuccess?: () => void;
}

export function ManageSubjectsDialog({
  open, onOpenChange, classId, className, onSuccess,
}: ManageSubjectsDialogProps) {
  const [classSubjects, setClassSubjects] = useState<ClassSubject[]>([]);
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedTeacher, setSelectedTeacher] = useState<string>("none");

  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open, classId]);

  async function loadData() {
    setLoading(true);
    try {
      const [csRes, subRes, teachRes] = await Promise.all([
        fetch(`/api/classes/${classId}/subjects`),
        fetch("/api/subjects"),
        fetch("/api/teachers"),
      ]);

      const cs = await csRes.json();
      const subs = await subRes.json();
      const techs = await teachRes.json();

      setClassSubjects(Array.isArray(cs) ? cs : []);
      setAllSubjects(Array.isArray(subs) ? subs : []);
      setTeachers(Array.isArray(techs) ? techs : []);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddSubject() {
    if (!selectedSubject) return;

    try {
      const res = await fetch(`/api/classes/${classId}/subjects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectId: selectedSubject,
          teacherId: selectedTeacher && selectedTeacher !== "none" ? selectedTeacher : null,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to add subject");
      }

      toast.success("Subject added to class");
      setSelectedSubject("");
      setSelectedTeacher("none");
      loadData();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  async function handleUpdateTeacher(subjectId: string, teacherId: string) {
    try {
      const res = await fetch(`/api/classes/${classId}/subjects/${subjectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacherId: teacherId && teacherId !== "none" ? teacherId : null }),
      });

      if (!res.ok) throw new Error("Failed to update teacher");

      toast.success("Teacher updated");
      loadData();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  async function handleRemoveSubject(subjectId: string) {
    try {
      const res = await fetch(`/api/classes/${classId}/subjects/${subjectId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to remove subject");

      toast.success("Subject removed from class");
      loadData();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  const availableSubjects = allSubjects.filter(
    (s) => !classSubjects.some((cs) => cs.subject.id === s.id)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Subjects - {className}</DialogTitle>
          <DialogDescription>
            Add subjects and assign teachers for this class
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Add New Subject */}
            <div className="border rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-sm">Add Subject</h3>
              <div className="grid grid-cols-2 gap-3">
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSubjects.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name} {s.code ? `(${s.code})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select teacher (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {teachers.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleAddSubject}
                disabled={!selectedSubject}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Subject
              </Button>
            </div>

            {/* Current Subjects */}
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Current Subjects ({classSubjects.length})</h3>
              {classSubjects.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No subjects added yet
                </p>
              ) : (
                <div className="space-y-2">
                  {classSubjects.map((cs) => (
                    <div
                      key={cs.id}
                      className="flex items-center gap-3 p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {cs.subject.name}
                          {cs.subject.code && (
                            <span className="ml-2 text-xs text-muted-foreground">
                              ({cs.subject.code})
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="w-48">
                        <Select
                          value={cs.teacher?.id || "none"}
                          onValueChange={(val) =>
                            handleUpdateTeacher(cs.subject.id, val)
                          }
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Assign teacher" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No teacher</SelectItem>
                            {teachers.map((t) => (
                              <SelectItem key={t.id} value={t.id}>
                                {t.username}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-red-50"
                        onClick={() => handleRemoveSubject(cs.subject.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
