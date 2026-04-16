"use client";

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { TrendingUp, Award } from "lucide-react";
import { Badge } from "@/core/components/ui/badge";
import { ScrollArea } from "@/core/components/ui/scroll-area";

interface Result {
  id: string;
  score: number;
  exam?: {
    title: string;
    subject?: {
      name: string;
    };
  };
  student?: {
    name: string;
  };
  createdAt: string;
}

const ResultsPage = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, []);

  async function loadResults() {
    setLoading(true);
    try {
      const res = await fetch("/api/results");
      if (res.ok) {
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Failed to load results:", error);
    } finally {
      setLoading(false);
    }
  }

  const getGradeColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800 border-green-300";
    if (score >= 75) return "bg-blue-100 text-blue-800 border-blue-300";
    if (score >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    return "bg-red-100 text-red-800 border-red-300";
  };

  const getGrade = (score: number) => {
    if (score >= 90) return "A+";
    if (score >= 80) return "A";
    if (score >= 70) return "B";
    if (score >= 60) return "C";
    if (score >= 50) return "D";
    return "F";
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
        <h1 className="text-2xl font-bold text-black">Exam Results</h1>
        <p className="text-sm text-muted-foreground mt-1">View your exam results and performance.</p>
      </div>

      {results.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            <TrendingUp className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No exam results available yet</p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
            {results.map((result) => (
              <Card key={result.id} className="hover:shadow-md transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base text-black line-clamp-2">
                        {result.exam?.title || "Exam Result"}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">
                        {result.exam?.subject?.name || "Subject"}
                      </p>
                    </div>
                    <Badge className={`${getGradeColor(result.score)} border shrink-0 font-bold`}>
                      {getGrade(result.score)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Score:</span>
                    <span className="text-xl font-bold text-black">{result.score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        result.score >= 90 ? "bg-green-500" :
                        result.score >= 75 ? "bg-blue-500" :
                        result.score >= 60 ? "bg-yellow-500" : "bg-red-500"
                      }`}
                      style={{ width: `${result.score}%` }}
                    />
                  </div>
                  <div className="pt-2 border-t flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      {new Date(result.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    {result.score >= 75 && (
                      <Award className="h-4 w-4 text-yellow-500" />
                    )}
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

export default ResultsPage;
