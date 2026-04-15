"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/button";
import { ArrowLeft, BookOpen, FileText, Loader2 } from "lucide-react";
import { LessonsTab } from "./tabs/LessonsTab";
import { AssignmentsTab } from "./tabs/AssignmentsTab";

interface Subject {
  id: string;
  name: string;
  description: string;
}

interface SubjectDetailPageProps {
  subjectId: string;
}

export function SubjectDetailPage({ subjectId }: SubjectDetailPageProps) {
  const router = useRouter();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSubject() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/subjects/${subjectId}`);
        if (!res.ok) throw new Error("Failed to load subject");
        const data = await res.json();
        setSubject(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    loadSubject();
  }, [subjectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !subject) {
    return (
      <Card className="max-w-2xl mx-auto mt-8">
        <CardContent className="pt-6 text-center">
          <p className="text-destructive mb-4">{error || "Subject not found"}</p>
          <Button onClick={() => router.push("/admin/subjects")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Subjects
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push("/admin/subjects")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-black">{subject.name}</h1>
          {subject.description && (
            <p className="text-sm text-muted-foreground mt-1">{subject.description}</p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="lessons" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="lessons" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Lessons
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Assignments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lessons" className="mt-6">
          <LessonsTab subjectId={subjectId} subjectName={subject.name} />
        </TabsContent>

        <TabsContent value="assignments" className="mt-6">
          <AssignmentsTab subjectId={subjectId} subjectName={subject.name} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
