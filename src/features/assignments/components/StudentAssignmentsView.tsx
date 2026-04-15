"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { ScrollArea } from "@/core/components/ui/scroll-area";
import { FileText, Calendar, Award, Search, ExternalLink } from "lucide-react";
import { Assignment } from "../types/assignment.types";
import { toast } from "sonner";

/** Clickable pill for attachment file */
function AttachmentPill({ url }: { url: string }) {
  const filename = url.split("/").pop() || "File";
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium text-blue-600 bg-blue-50 border-blue-200 hover:opacity-80 transition-opacity"
    >
      <FileText className="h-3.5 w-3.5" />
      <span className="max-w-[120px] truncate">{filename}</span>
      <ExternalLink className="h-3 w-3 shrink-0 opacity-60" />
    </a>
  );
}

export function StudentAssignmentsView() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadAssignments();
  }, []);

  async function loadAssignments() {
    setLoading(true);
    try {
      const res = await fetch("/api/assignments");
      if (!res.ok) throw new Error("Failed to load assignments");
      const data = await res.json();
      setAssignments(Array.isArray(data) ? data : []);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  const filtered = assignments.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.subject?.name.toLowerCase().includes(search.toLowerCase()) ||
      a.class?.name.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (date: string) => new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const isOverdue = (date: string) => new Date(date) < new Date();

  // Simple markdown to HTML converter
  const renderDescription = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/^## (.*$)/gim, "<h3 class='text-base font-bold mt-3 mb-1'>$1</h3>")
      .replace(/^- (.*$)/gim, "<li class='ml-4'>$1</li>")
      .replace(/^\d+\. (.*$)/gim, "<li class='ml-4 list-decimal'>$1</li>")
      .replace(/\[(.*?)\]\((.*?)\)/g, "<a href='$2' class='text-blue-500 underline' target='_blank'>$1</a>")
      .replace(/\n/g, "<br />");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-black">My Assignments</h1>
        <p className="text-muted-foreground mt-1">View and download your assignments</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search assignments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Assignments Grid */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No assignments found</p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[600px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
            {filtered.map((assignment) => (
              <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base font-semibold line-clamp-2">
                      {assignment.title}
                    </CardTitle>
                    {isOverdue(assignment.dueDate) && (
                      <Badge variant="destructive" className="shrink-0">Overdue</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Description */}
                  <div
                    className="text-sm text-muted-foreground line-clamp-3 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: renderDescription(assignment.description) }}
                  />

                  {/* Info */}
                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Due: {formatDate(assignment.dueDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Award className="h-3.5 w-3.5" />
                      <span>{assignment.totalMarks} points</span>
                    </div>
                    {assignment.subject && (
                      <div className="text-xs">
                        <span className="text-muted-foreground">Subject: </span>
                        <span className="font-medium text-foreground">{assignment.subject.name}</span>
                      </div>
                    )}
                    {assignment.class && (
                      <div className="text-xs">
                        <span className="text-muted-foreground">Class: </span>
                        <span className="font-medium text-foreground">{assignment.class.name}</span>
                      </div>
                    )}
                    {assignment.teacher && (
                      <div className="text-xs">
                        <span className="text-muted-foreground">Teacher: </span>
                        <span className="font-medium text-foreground">{assignment.teacher.username}</span>
                      </div>
                    )}
                  </div>

                  {/* Attachment */}
                  {assignment.fileUrl && (
                    <div className="pt-2 border-t">
                      <AttachmentPill url={assignment.fileUrl} />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
