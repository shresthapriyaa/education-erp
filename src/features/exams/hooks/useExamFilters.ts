// "use client";

// import { useState } from "react";

// export function useExamFilters() {
//   const [filters, setFilters] = useState<{ search?: string }>({});

//   const updateFilter = (key: string, value: string) => {
//     setFilters((prev) => ({ ...prev, [key]: value }));
//   };

//   return { filters, updateFilter };
// }





"use client";

import { useState } from "react";

export interface ExamFilters {
  search?:    string;
  classId?:   string;
  type?:      string;
  from?:      string;
  to?:        string;
}

export function useExamFilters() {
  const [filters, setFilters] = useState<ExamFilters>({});

  const updateFilter = (key: keyof ExamFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }));
  };

  const resetFilters = () => setFilters({});

  return { filters, updateFilter, resetFilters };
}