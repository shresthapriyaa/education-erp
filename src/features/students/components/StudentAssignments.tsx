"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { ClipboardList, Calendar, FileText, Search, Upload, Eye, X } from "lucide-react";
import { ScrollArea } from "@/core/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog";

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  subject?: { name: string; id: string };
  class?: { name: string; id: string };
  materials?: Array<{ id: string; title: string; url: string; type: string }>;
}

export default function StudentAssignments() {
  const { data: session } = useSession();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [comments, setComments] = useState("");
  const [studentClassId, setStudentClassId] = useState<string | null>(null);

  useEffect(() => {
    loadStudentInfo();
    loadAssignments();
  }, [session]);

  async function loadStudentInfo() {
    if (!session?.user?.email) return;
    
    try {
      const res = await fetch(`/api/students?email=${encodeURIComponent(session.user.email)}`);
      const data = await res.json();
      const students = Array.isArray(data) ? data : (data.students || []);
      
      if (students.length > 0 && students[0].classId) {
        setStudentClassId(students[0].classId);
      }
    } catch (error) {
      console.error("Failed to load student info:", error);
    }
  }

  async function loadAssignments() {
    setLoading(true);
    try {
      const res = await fetch("/api/assignments");
      const data = await res.json();
      const allAssignments = Array.isArray(data) ? data : [];
      
      // Show all assignments for now (you can filter by class later if needed)
      setAssignments(allAssignments);
    } catch (error) {
      console.error("Failed to load assignments:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    if (!selectedFile || !selectedAssignment) return;
    
    setSubmitting(true);
    try {
      // Here you would upload the file and create a submission
      // For now, we'll just show a success message
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert("Assignment submitted successfully!");
      setShowSubmitDialog(false);
      setSelectedFile(null);
      setComments("");
    } catch (error) {
      console.error("Failed to submit assignment:", error);
      alert("Failed to submit assignment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const filtered = assignments.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.description?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const isOverdue = (dueDate: string) => new Date(dueDate) < new Date();

  const handleViewDetails = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setShowDetailsDialog(true);
  };

  const handleSubmitAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setShowSubmitDialog(true);
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
        <h1 className="text-3xl font-bold text-black">My Assignments</h1>
        <p className="text-muted-foreground mt-1">View and submit your assignments.</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search assignments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Assignments List */}
      <ScrollArea className="h-[600px]">
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <Card>
              <CardContent className="py-20 text-center text-muted-foreground">
                <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No assignments found</p>
              </CardContent>
            </Card>
          ) : (
            filtered.map((assignment) => {
              const overdue = isOverdue(assignment.dueDate);
              return (
                <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-black">{assignment.title}</CardTitle>
                        <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                          {assignment.subject && (
                            <span className="flex items-center gap-1">
                              <FileText className="h-4 w-4" />
                              {assignment.subject.name}
                            </span>
                          )}
                          {assignment.class && (
                            <span>Class: {assignment.class.name}</span>
                          )}
                        </div>
                      </div>
                      <Badge variant={overdue ? "destructive" : "default"}>
                        {overdue ? "Overdue" : "Pending"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">{assignment.description}</p>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className={overdue ? "text-red-600 font-medium" : "text-muted-foreground"}>
                        Due: {formatDate(assignment.dueDate)}
                      </span>
                    </div>

                    {/* Materials */}
                    {assignment.materials && assignment.materials.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-black">Materials:</p>
                        <div className="flex flex-wrap gap-2">
                          {assignment.materials.map((material) => (
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
                              <FileText className="h-3 w-3" />
                              {material.title}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button 
                        className="bg-black hover:bg-gray-800"
                        onClick={() => handleSubmitAssignment(assignment)}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Submit Assignment
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => handleViewDetails(assignment)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </ScrollArea>

      {/* View Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedAssignment?.title}</DialogTitle>
            <DialogDescription>Assignment Details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-black mb-1">Description:</p>
              <p className="text-sm text-muted-foreground">{selectedAssignment?.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-black mb-1">Subject:</p>
                <p className="text-sm text-muted-foreground">{selectedAssignment?.subject?.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-black mb-1">Class:</p>
                <p className="text-sm text-muted-foreground">{selectedAssignment?.class?.name || "N/A"}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-black mb-1">Due Date:</p>
              <p className="text-sm text-muted-foreground">
                {selectedAssignment && formatDate(selectedAssignment.dueDate)}
              </p>
            </div>

            {selectedAssignment?.materials && selectedAssignment.materials.length > 0 && (
              <div>
                <p className="text-sm font-medium text-black mb-2">Materials:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedAssignment.materials.map((material) => (
                    <a
                      key={material.id}
                      href={material.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                    >
                      <FileText className="h-3 w-3" />
                      {material.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Submit Assignment Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Assignment</DialogTitle>
            <DialogDescription>
              Upload your completed assignment for: {selectedAssignment?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-black mb-2 block">
                Upload File *
              </label>
              <Input 
                type="file" 
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                accept=".pdf,.doc,.docx,.txt,.zip"
              />
              {selectedFile && (
                <p className="text-xs text-muted-foreground mt-1">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium text-black mb-2 block">
                Comments (Optional)
              </label>
              <textarea
                className="w-full min-h-[100px] px-3 py-2 text-sm border rounded-md"
                placeholder="Add any comments about your submission..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowSubmitDialog(false);
                  setSelectedFile(null);
                  setComments("");
                }}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button 
                className="bg-black hover:bg-gray-800"
                onClick={handleSubmit}
                disabled={!selectedFile || submitting}
              >
                {submitting ? (
                  <>Submitting...</>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Submit
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
