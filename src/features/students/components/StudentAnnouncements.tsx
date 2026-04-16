"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Badge } from "@/core/components/ui/badge";
import { Bell, Calendar, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/core/components/ui/scroll-area";

interface Announcement {
  id: string;
  title: string;
  content: string;
  publishDate: string | null;
  createdAt: string;
}

export default function StudentAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  async function loadAnnouncements() {
    setLoading(true);
    try {
      const res = await fetch("/api/announcements");
      const data = await res.json();
      setAnnouncements(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load announcements:", error);
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const isRecent = (date: string) => {
    const announcementDate = new Date(date);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - announcementDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 7; // Recent if within 7 days
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
        <h1 className="text-2xl font-bold text-black">Announcements</h1>
        <p className="text-sm text-muted-foreground mt-1">View school announcements and important notices.</p>
      </div>

      {announcements.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            <Bell className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No announcements available</p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-3 pr-4">
            {announcements.map((announcement) => {
              const publishedDate = announcement.publishDate || announcement.createdAt;
              const recent = isRecent(publishedDate);
              
              return (
                <Card key={announcement.id} className="hover:shadow-md transition-all border-l-4 border-l-blue-500">
                  <CardHeader className="pb-2 pt-3 px-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2 flex-1 min-w-0">
                        <div className="bg-blue-100 p-1.5 rounded-md shrink-0">
                          <Bell className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-sm font-semibold text-black leading-tight">
                            {announcement.title}
                          </CardTitle>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {formatDate(publishedDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                      {recent && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 shrink-0 text-xs px-2 py-0">
                          New
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 pb-3 pt-2">
                    <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap line-clamp-3">
                      {announcement.content}
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
