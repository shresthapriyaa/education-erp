"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/button";
import { Badge } from "@/core/components/ui/badge";
import { Pencil, Trash2, Calendar, Award } from "lucide-react";
import { Assignment } from "@/features/assignments/types/assignment.types";

interface AssignmentCardProps {
  assignment: Assignment;
  onEdit: (assignment: Assignment) => void;
  onDelete: (id: string) => void;
}

export function AssignmentCard({ assignment, onEdit, onDelete }: AssignmentCardProps) {
  const dueDate = new Date(assignment.dueDate);
  const isOverdue = dueDate < new Date();
  const formattedDate = dueDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold line-clamp-2">
            {assignment.title}
          </CardTitle>
          <div className="flex gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(assignment)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onDelete(assignment.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {assignment.description}
        </p>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-1.5 text-xs">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <span className={isOverdue ? "text-destructive font-medium" : "text-muted-foreground"}>
              {formattedDate}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <Award className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-medium">{assignment.totalMarks} pts</span>
          </div>
        </div>

        {assignment.class && (
          <div className="text-xs text-muted-foreground">
            Class: <span className="font-medium text-foreground">{assignment.class.name}</span>
          </div>
        )}

        {isOverdue && (
          <Badge variant="destructive" className="w-full justify-center">
            Overdue
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
