"use client";

import { useState, useEffect } from "react";

interface Class {
  id: string;
  name: string;
  grade: string;
  section: string;
}

interface Subject {
  id: string;
  name: string;
  code?: string;
  description?: string;
  assignedTeacher?: {
    id: string;
    username: string;
    email: string;
  } | null;
}

interface Teacher {
  id: string;
  username: string;
  email: string;
}

interface ClassSubject {
  id: string;
  class: Class;
  subject: Subject;
  teacher: Teacher | null;
}

export function useClassSubjectCascade() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [assignedTeacher, setAssignedTeacher] = useState<Teacher | null>(null);
  const [classSubject, setClassSubject] = useState<ClassSubject | null>(null);
  
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingTeacher, setLoadingTeacher] = useState(false);

  // Load all classes on mount
  useEffect(() => {
    loadClasses();
  }, []);

  // Load subjects when class changes
  useEffect(() => {
    if (selectedClass) {
      loadSubjects(selectedClass);
    } else {
      setSubjects([]);
      setSelectedSubject("");
      setAssignedTeacher(null);
      setClassSubject(null);
    }
  }, [selectedClass]);

  // Load teacher when both class and subject are selected
  useEffect(() => {
    if (selectedClass && selectedSubject) {
      loadClassSubject(selectedClass, selectedSubject);
    } else {
      setAssignedTeacher(null);
      setClassSubject(null);
    }
  }, [selectedClass, selectedSubject]);

  async function loadClasses() {
    setLoadingClasses(true);
    try {
      const response = await fetch('/api/classes');
      if (response.ok) {
        const data = await response.json();
        setClasses(data);
      } else {
        console.error('Failed to load classes');
      }
    } catch (error) {
      console.error('Error loading classes:', error);
    } finally {
      setLoadingClasses(false);
    }
  }

  async function loadSubjects(classId: string) {
    setLoadingSubjects(true);
    try {
      const response = await fetch(`/api/subjects?classId=${classId}`);
      if (response.ok) {
        const data = await response.json();
        setSubjects(data);
      } else {
        console.error('Failed to load subjects');
        setSubjects([]);
      }
    } catch (error) {
      console.error('Error loading subjects:', error);
      setSubjects([]);
    } finally {
      setLoadingSubjects(false);
    }
  }

  async function loadClassSubject(classId: string, subjectId: string) {
    setLoadingTeacher(true);
    try {
      const response = await fetch(`/api/class-subject?classId=${classId}&subjectId=${subjectId}`);
      if (response.ok) {
        const data = await response.json();
        setClassSubject(data);
        setAssignedTeacher(data.teacher);
      } else {
        console.error('Failed to load class-subject assignment');
        setAssignedTeacher(null);
        setClassSubject(null);
      }
    } catch (error) {
      console.error('Error loading class-subject assignment:', error);
      setAssignedTeacher(null);
      setClassSubject(null);
    } finally {
      setLoadingTeacher(false);
    }
  }

  function handleClassChange(classId: string) {
    setSelectedClass(classId);
    // Reset dependent fields
    setSelectedSubject("");
    setAssignedTeacher(null);
    setClassSubject(null);
  }

  function handleSubjectChange(subjectId: string) {
    setSelectedSubject(subjectId);
    // Reset dependent fields
    setAssignedTeacher(null);
    setClassSubject(null);
  }

  function reset() {
    setSelectedClass("");
    setSelectedSubject("");
    setAssignedTeacher(null);
    setClassSubject(null);
  }

  return {
    // Data
    classes,
    subjects,
    selectedClass,
    selectedSubject,
    assignedTeacher,
    classSubject,
    
    // Loading states
    loadingClasses,
    loadingSubjects,
    loadingTeacher,
    
    // Actions
    handleClassChange,
    handleSubjectChange,
    reset,
    
    // Computed values
    isSubjectDisabled: !selectedClass || loadingSubjects,
    isTeacherLoading: loadingTeacher,
    hasValidSelection: !!(selectedClass && selectedSubject && assignedTeacher),
  };
}