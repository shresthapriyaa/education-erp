"use client";

import { Label } from "@/core/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/components/ui/select";
import { Input } from "@/core/components/ui/input";
import { useClassSubjectCascade } from "@/core/hooks/useClassSubjectCascade";
import { useEffect, useRef } from "react";

interface ClassSubjectSelectorProps {
  selectedClass?: string;
  selectedSubject?: string;
  onClassChange: (classId: string) => void;
  onSubjectChange: (subjectId: string) => void;
  onClassSubjectChange?: (classSubjectId: string | null) => void;
  disabled?: boolean;
  required?: boolean;
}

export function ClassSubjectSelector({
  selectedClass = "",
  selectedSubject = "",
  onClassChange,
  onSubjectChange,
  onClassSubjectChange,
  disabled = false,
  required = false
}: ClassSubjectSelectorProps) {
  const {
    classes,
    subjects,
    assignedTeacher,
    classSubject,
    loadingClasses,
    loadingSubjects,
    loadingTeacher,
    isSubjectDisabled,
    selectedClass: internalSelectedClass,
    selectedSubject: internalSelectedSubject,
    handleClassChange: internalHandleClassChange,
    handleSubjectChange: internalHandleSubjectChange
  } = useClassSubjectCascade();

  const prevClassRef = useRef(selectedClass);
  const prevSubjectRef = useRef(selectedSubject);

  // Sync parent's selectedClass with internal state
  useEffect(() => {
    if (selectedClass !== prevClassRef.current) {
      prevClassRef.current = selectedClass;
      if (selectedClass !== internalSelectedClass) {
        internalHandleClassChange(selectedClass);
      }
    }
  }, [selectedClass, internalSelectedClass]);

  // Sync parent's selectedSubject with internal state
  useEffect(() => {
    if (selectedSubject !== prevSubjectRef.current) {
      prevSubjectRef.current = selectedSubject;
      if (selectedSubject !== internalSelectedSubject) {
        internalHandleSubjectChange(selectedSubject);
      }
    }
  }, [selectedSubject, internalSelectedSubject]);

  // Notify parent of classSubject changes
  useEffect(() => {
    if (onClassSubjectChange) {
      onClassSubjectChange(classSubject?.id || null);
    }
  }, [classSubject?.id]);

  const handleClassChange = (value: string) => {
    internalHandleClassChange(value);
    onClassChange(value);
  };

  const handleSubjectChange = (value: string) => {
    internalHandleSubjectChange(value);
    onSubjectChange(value);
  };

  return (
    <div className="space-y-4">
      {/* Class Selection */}
      <div className="space-y-2">
        <Label htmlFor="class">
          Class {required && <span className="text-red-500">*</span>}
        </Label>
        <Select
          value={selectedClass || ""}
          onValueChange={handleClassChange}
          disabled={disabled || loadingClasses}
        >
          <SelectTrigger>
            <SelectValue placeholder={loadingClasses ? "Loading classes..." : "Select a class"} />
          </SelectTrigger>
          <SelectContent>
            {classes.map((cls) => (
              <SelectItem key={cls.id} value={cls.id}>
                {cls.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Subject Selection */}
      <div className="space-y-2">
        <Label htmlFor="subject">
          Subject {required && <span className="text-red-500">*</span>}
        </Label>
        <Select
          value={selectedSubject || ""}
          onValueChange={handleSubjectChange}
          disabled={disabled || isSubjectDisabled}
        >
          <SelectTrigger>
            <SelectValue 
              placeholder={
                !selectedClass 
                  ? "Select a class first" 
                  : loadingSubjects 
                    ? "Loading subjects..." 
                    : subjects.length === 0
                      ? "No subjects available for this class"
                      : "Select a subject"
              } 
            />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((subject) => (
              <SelectItem key={subject.id} value={subject.id}>
                {subject.name} {subject.code && `(${subject.code})`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Assigned Teacher (Read-only) */}
      <div className="space-y-2">
        <Label htmlFor="teacher">Assigned Teacher</Label>
        <Input
          id="teacher"
          value={
            loadingTeacher 
              ? "Loading teacher..." 
              : assignedTeacher 
                ? `${assignedTeacher.username} (${assignedTeacher.email})`
                : selectedClass && selectedSubject 
                  ? "No teacher assigned"
                  : ""
          }
          disabled
          placeholder="Teacher will be auto-filled"
          className="bg-muted"
        />
      </div>

      {/* Debug info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-muted-foreground p-2 bg-muted rounded space-y-1">
          <div>Selected Class: {selectedClass || "none"}</div>
          <div>Internal Class: {internalSelectedClass || "none"}</div>
          <div>Subjects loaded: {subjects.length}</div>
          <div>ClassSubject ID: {classSubject?.id || "none"}</div>
        </div>
      )}
    </div>
  );
}