"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/button";
import { Badge } from "@/core/components/ui/badge";
import { Pencil, Trash2, FileText, Eye } from "lucide-react";
import { Lesson } from "@/features/lessons/types/lesson.types";

interface LessonCardProps {
  lesson: Lesson;
  onEdit: (lesson: Lesson) => void;
  onDelete: (id: string) => void;
}

export function LessonCard({ lesson, onEdit, onDelete }: LessonCardProps) {
  const materialCount = lesson.materials?.length || 0;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold line-clamp-2">
            {lesson.title}
          </CardTitle>
          <div className="flex gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(lesson)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onDelete(lesson.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {lesson.content}
        </p>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <FileText className="h-3.5 w-3.5" />
            <span>{materialCount} {materialCount === 1 ? "material" : "materials"}</span>
          </div>
          
          {lesson.isPublished ? (
            <Badge variant="default" className="bg-green-500 hover:bg-green-600">
              <Eye className="h-3 w-3 mr-1" />
              Published
            </Badge>
          ) : (
            <Badge variant="secondary">Draft</Badge>
          )}
        </div>

        {lesson.class && (
          <div className="text-xs text-muted-foreground">
            Class: <span className="font-medium text-foreground">{lesson.class.name}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
