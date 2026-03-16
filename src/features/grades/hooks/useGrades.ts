// "use client";
// import { useState, useCallback } from "react";
// import { toast } from "sonner";
// import { Grade } from "@/generated/prisma/browser";
// import { gradeApi } from "../services/grade.api";


// type GradePayload = Partial<Grade> & { studentId?: string; assignmentId?: string };

// export function useGrades() {
//   const [grades, setGrades] = useState<Grade[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchGrades = useCallback(async (filters?: { search?: string }) => {
//     setLoading(true);
//     try {
//       const data = await gradeApi.getAll(filters);
//       setGrades(data);
//     } catch (err: any) {
//       setError(err.message || "Failed to fetch grades");
//       toast.error("Failed to fetch grades");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const createGrade = async (data: GradePayload) => {
//     setLoading(true);
//     try {
//       await gradeApi.create(data);
//       toast.success("Grade created successfully");
//       await fetchGrades();
//       return true;
//     } catch (err: any) {
//       toast.error(err?.response?.data?.error || "Failed to create grade");
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateGrade = async (id: string, data: GradePayload) => {
//     setLoading(true);
//     try {
//       await gradeApi.update(id, data);
//       toast.success("Grade updated successfully");
//       await fetchGrades();
//       return true;
//     } catch (err: any) {
//       toast.error(err?.response?.data?.error || "Failed to update grade");
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteGrade = async (id: string) => {
//     setLoading(true);
//     try {
//       await gradeApi.delete(id);
//       toast.success("Grade deleted successfully");
//       setGrades((prev) => prev.filter((g) => g.id !== id));
//       return true;
//     } catch (err: any) {
//       toast.error(err?.response?.data?.error || "Failed to delete grade");
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     grades,
//     loading,
//     error,
//     fetchGrades,
//     createGrade,
//     updateGrade,
//     deleteGrade,
//   };
// }\


// features/grades/hooks/useGrades.ts
"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { Grade } from "../types/grade.types";
import { gradeApi } from "../services/grade.api";
import type { GradePayload } from "../components/GradeForm";

export function useGrades() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGrades = useCallback(async (filters?: { search?: string }) => {
    setLoading(true);
    try {
      const data = await gradeApi.getAll(filters);
      setGrades(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch grades");
      toast.error("Failed to fetch grades");
    } finally {
      setLoading(false);
    }
  }, []);

  const createGrade = async (data: GradePayload) => {
    setLoading(true);
    try {
      await gradeApi.create(data);
      toast.success("Grade created successfully");
      await fetchGrades();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to create grade");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateGrade = async (id: string, data: GradePayload) => {
    setLoading(true);
    try {
      await gradeApi.update(id, data);
      toast.success("Grade updated successfully");
      await fetchGrades();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to update grade");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteGrade = async (id: string) => {
    setLoading(true);
    try {
      await gradeApi.delete(id);
      toast.success("Grade deleted successfully");
      setGrades((prev) => prev.filter((g) => g.id !== id));
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to delete grade");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    grades,
    loading,
    error,
    fetchGrades,
    createGrade,
    updateGrade,
    deleteGrade,
  };
}