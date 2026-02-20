import { useState } from "react";
import type { StudentFiltersState } from "./useStudents";

export function useStudentFilters(initial?: Partial<StudentFiltersState>) {
  const [filters, setFilters] = useState<StudentFiltersState>({
    search: initial?.search ?? "",
    sex: initial?.sex ?? "all",
    bloodGroup: initial?.bloodGroup ?? "all",
  });

  const handleFilterChange = (newFilters: Partial<StudentFiltersState>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      sex: "all",
      bloodGroup: "all",
    });
  };

  return { filters, setFilters: handleFilterChange, resetFilters };
}