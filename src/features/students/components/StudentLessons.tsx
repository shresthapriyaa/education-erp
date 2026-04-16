"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Badge } from "@/core/components/ui/badge";
import { Input } from "@/core/components/ui/input";
import { BookOpen, FileText, Image, Search } from "lucide-react";
import { ScrollArea } from "@/core/components/ui/scroll-area";

interface Lesson {
  id: string;
  title: string;
  content: string;
  subject?: { name: string };
  class?: { name: string };
  materials?: Array<{ id: string; title: string; url: string; type: string }>;
  createdAt: string;
}

export default function StudentLessons() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadLessons();
  }, []);

  async function loadLessons() {
    setLoading(true);
    try {
      const res = await fetch("/api/lessons");
      const data = await res.json();
      setLessons(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load lessons:", error);
    } finally {
      setLoading(false);
    }
  }

  const filtered = lessons.filter((l) =>
    (l.title?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (l.content?.toLowerCase() || "").includes(search.toLowerCase())
  );

  const getFileIcon = (type: string) => {
    if (type?.toLowerCase().includes("image")) return <Image className="h-3 w-3" />;
    return <FileText className="h-3 w-3" />;
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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-black">My Lessons</h1>
        <p className="text-muted-foreground mt-1">View all your lessons and study materials.</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search lessons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Lessons Grid */}
      <ScrollArea className="h-[600px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="py-20 text-center text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No lessons found</p>
              </CardContent>
            </Card>
          ) : (
            filtered.map((lesson) => (
              <Card key={lesson.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-black">{lesson.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        {lesson.subject && (
                          <Badge variant="secondary" className="text-xs">
                            {lesson.subject.name}
                          </Badge>
                        )}
                        {lesson.class && (
                          <Badge variant="outline" className="text-xs">
                            {lesson.class.name}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {lesson.content}
                  </p>

                  {/* Materials */}
                  {lesson.materials && lesson.materials.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-black">Study Materials:</p>
                      <div className="flex flex-wrap gap-2">
                        {lesson.materials.map((material) => (
                          <a
                            key={material.id}
                            href={material.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(material.url, '_blank');
                            }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
                          >
                            {getFileIcon(material.type)}
                            {material.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">
                    Added: {new Date(lesson.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
