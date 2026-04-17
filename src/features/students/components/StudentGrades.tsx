"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Badge } from "@/core/components/ui/badge";
import { Award, TrendingUp } from "lucide-react";
import { ScrollArea } from "@/core/components/ui/scroll-area";

interface Grade {
  id: string;
  score: number;
  remarks: string | null;
  assignment?: {
    title: string;
    totalMarks: number;
  };
  createdAt: string;
}

interface StudentGradesProps {
  studentEmail?: string; // Optional: if provided, fetch for this student; otherwise use session
}

export default function StudentGrades({ studentEmail }: StudentGradesProps = {}) {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGrades();
  }, [studentEmail]);

  async function loadGrades() {
    setLoading(true);
    try {
      const url = studentEmail 
        ? `/api/grades?studentEmail=${studentEmail}`
        : "/api/grades";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setGrades(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Failed to load grades:", error);
    } finally {
      setLoading(false);
    }
  }

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "bg-green-100 text-green-700 border-green-200";
    if (percentage >= 75) return "bg-blue-100 text-blue-700 border-blue-200";
    if (percentage >= 60) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-12 bg-muted animate-pulse rounded" />
        <div className="h-96 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black">My Grades</h1>
        <p className="text-sm text-muted-foreground mt-1">View your assignment grades and feedback.</p>
      </div>

      {grades.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            <Award className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No grades available yet</p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
            {grades.map((grade) => {
              const totalMarks = grade.assignment?.totalMarks || 100;
              const percentage = (grade.score / totalMarks) * 100;
              return (
                <Card key={grade.id} className="hover:shadow-md transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base text-black line-clamp-2">
                        {grade.assignment?.title || "Assignment"}
                      </CardTitle>
                      <Badge 
                        variant="secondary"
                        className={`${getGradeColor(percentage)} shrink-0 font-semibold`}
                      >
                        {percentage.toFixed(0)}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Score:</span>
                      <span className="font-bold text-black">
                        {grade.score} / {totalMarks}
                      </span>
                    </div>
                    {grade.remarks && (
                      <div className="pt-2 border-t">
                        <p className="text-xs font-medium text-black mb-1">Feedback:</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{grade.remarks}</p>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground pt-2 border-t">
                      {new Date(grade.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
