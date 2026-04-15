"use client";

import { useState, useEffect } from "react";
import { Button } from "@/core/components/ui/button";
import { ScrollArea } from "@/core/components/ui/scroll-area";
import { PlusCircle, Loader2, FileText } from "lucide-react";
import { AssignmentDialog } from "@/features/assignments/components/AssignmentDialog";
import { AssignmentCard } from "../cards/AssignmentCard";
import { Assignment } from "@/features/assignments/types/assignment.types";
import { toast } from "sonner";

interface AssignmentsTabProps {
  subjectId: string;
  subjectName: string;
}

export function AssignmentsTab({ subjectId, subjectName }: AssignmentsTabProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadAssignments();
  }, [subjectId]);

  async function loadAssignments() {
    setLoading(true);
    try {
      const res = await fetch(`/api/assignments?subjectId=${subjectId}`);
      if (!res.ok) throw new Error("Failed to load assignments");
      const data = await res.json();
      setAssignments(Array.isArray(data) ? data : []);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(values: any) {
    setSubmitting(true);
    try {
      const url = editingAssignment ? `/api/assignments/${editingAssignment.id}` : "/api/assignments";
      const method = editingAssignment ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, subjectId }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save assignment");
      }

      toast.success(editingAssignment ? "Assignment updated" : "Assignment created");
      setDialogOpen(false);
      setEditingAssignment(null);
      loadAssignments();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this assignment?")) return;
    try {
      const res = await fetch(`/api/assignments/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Assignment deleted");
      loadAssignments();
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  function handleEdit(assignment: Assignment) {
    setEditingAssignment(assignment);
    setDialogOpen(true);
  }

  function handleAdd() {
    setEditingAssignment(null);
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
          {assignments.length} {assignments.length === 1 ? "assignment" : "assignments"}
        </p>
        <Button onClick={handleAdd} className="bg-black hover:bg-gray-800">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Assignment
        </Button>
      </div>

      {assignments.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground mb-4">No assignments yet</p>
          <Button onClick={handleAdd} variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create First Assignment
          </Button>
        </div>
      ) : (
        <ScrollArea className="h-[600px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
            {assignments.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </ScrollArea>
      )}

      <AssignmentDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingAssignment(null);
        }}
        initialValues={editingAssignment || undefined}
        onSubmit={handleSubmit}
        loading={submitting}
        isEdit={!!editingAssignment}
      />
    </div>
  );
}
