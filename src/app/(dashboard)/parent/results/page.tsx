"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ChildSelector } from "@/features/parents/components/ChildSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { TrendingUp, Award } from "lucide-react";
import { Badge } from "@/core/components/ui/badge";
import { ScrollArea } from "@/core/components/ui/scroll-area";

interface Child {
  id: string;
  username: string;
  email: string;
  class: { name: string } | null;
  img: string | null;
}

interface Result {
  id: string;
  obtainedMarks: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  subject?: { name: string };
  academicYear: string;
  term: string;
}

export default function ParentResultsPage() {
  const { data: session } = useSession();
  const [selectedChild, setSelectedChild] = useState<{ email: string; data: Child } | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedChild?.email) {
      loadResults();
    }
  }, [selectedChild]);

  async function loadResults() {
    if (!selectedChild?.email) return;
    
    setLoading(true);
    try {
      // Get student by email first
      const studentRes = await fetch(`/api/students?email=${selectedChild.email}`);
      const studentData = await studentRes.json();
      const students = studentData.students || [];
      
      if (students.length > 0) {
        const studentId = students[0].id;
        
        // Fetch results for this student
        const res = await fetch(`/api/results?studentId=${studentId}`);
        if (res.ok) {
          const data = await res.json();
          setResults(Array.isArray(data) ? data : []);
        }
      }
    } catch (error) {
      console.error("Failed to load results:", error);
    } finally {
      setLoading(false);
    }
  }

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "bg-green-100 text-green-800 border-green-300";
    if (percentage >= 75) return "bg-blue-100 text-blue-800 border-blue-300";
    if (percentage >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    return "bg-red-100 text-red-800 border-red-300";
  };

  return (
    <div className="space-y-4">
      <ChildSelector
        onChildSelect={(email, data) => setSelectedChild({ email, data })}
        selectedChildEmail={selectedChild?.email}
      />
      
      {selectedChild && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Viewing results for:</span> {selectedChild.data.username}
            {selectedChild.data.class && <span className="ml-2">({selectedChild.data.class.name})</span>}
          </p>
        </div>
      )}

      {!selectedChild ? (
        <div className="text-center py-10 text-muted-foreground">
          Please select a child to view their results
        </div>
      ) : loading ? (
        <div className="space-y-6">
          <div className="h-12 bg-muted animate-pulse rounded" />
          <div className="h-96 bg-muted animate-pulse rounded" />
        </div>
      ) : results.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            <Award className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No results available yet</p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[calc(100vh-250px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
            {results.map((result) => (
              <Card key={result.id} className="hover:shadow-md transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm text-black">{result.subject?.name || "Subject"}</CardTitle>
                    <Badge className={`${getGradeColor(result.percentage)} border`}>
                      {result.grade}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {result.term} - {result.academicYear}
                  </p>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground text-xs">Marks:</span>
                    <span className="font-semibold text-black text-xs">
                      {result.obtainedMarks} / {result.totalMarks}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground text-xs">Percentage:</span>
                    <span className="font-semibold text-black text-xs">{result.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className={`h-2 rounded-full ${
                        result.percentage >= 90 ? "bg-green-600" :
                        result.percentage >= 75 ? "bg-blue-600" :
                        result.percentage >= 60 ? "bg-yellow-600" : "bg-red-600"
                      }`}
                      style={{ width: `${result.percentage}%` }}
                    />
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
