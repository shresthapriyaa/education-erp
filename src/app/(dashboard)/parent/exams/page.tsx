"use client";

import { useState, useEffect } from "react";
import { ChildSelector } from "@/features/parents/components/ChildSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { FileText, Calendar, Clock } from "lucide-react";
import { Badge } from "@/core/components/ui/badge";
import { ScrollArea } from "@/core/components/ui/scroll-area";

interface Child {
  id: string;
  username: string;
  email: string;
  class: { name: string } | null;
  img: string | null;
}

interface Exam {
  id: string;
  title: string;
  date: string;
  subject?: { name: string };
  class?: { name: string };
}

export default function ParentExamsPage() {
  const [selectedChild, setSelectedChild] = useState<{ email: string; data: Child } | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedChild?.data?.class?.name) {
      loadExams();
    }
  }, [selectedChild]);

  async function loadExams() {
    if (!selectedChild?.data?.class?.name) return;
    
    setLoading(true);
    try {
      // Fetch exams for the child's class
      const res = await fetch(`/api/exams?className=${encodeURIComponent(selectedChild.data.class.name)}`);
      if (res.ok) {
        const data = await res.json();
        setExams(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Failed to load exams:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <ChildSelector
        onChildSelect={(email, data) => setSelectedChild({ email, data })}
        selectedChildEmail={selectedChild?.email}
      />
      
      {selectedChild && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Viewing exams for:</span> {selectedChild.data.username}
            {selectedChild.data.class && <span className="ml-2">({selectedChild.data.class.name})</span>}
          </p>
        </div>
      )}

      {!selectedChild ? (
        <div className="text-center py-10 text-muted-foreground">
          Please select a child to view their exams
        </div>
      ) : loading ? (
        <div className="space-y-6">
          <div className="h-12 bg-muted animate-pulse rounded" />
          <div className="h-96 bg-muted animate-pulse rounded" />
        </div>
      ) : exams.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            <FileText className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No upcoming exams scheduled</p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[calc(100vh-250px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
            {exams.map((exam) => (
              <Card key={exam.id} className="hover:shadow-md transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base text-black line-clamp-2">{exam.title}</CardTitle>
                    <Badge variant="outline" className="shrink-0 text-xs">
                      {exam.subject?.name || "Subject"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-blue-600 shrink-0" />
                    <span className="text-black text-xs">
                      {new Date(exam.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
