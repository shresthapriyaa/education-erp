import { useState } from "react";
import type { UserFilters } from "../components/UserFilters";

export function useUserFilters(initial?: Partial<UserFilters>) {
  const [filters, setFilters] = useState<UserFilters>({
    search: initial?.search ?? "",
    role: initial?.role ?? "all",
    isVerified: initial?.isVerified ?? "all",
  });

  const handleFilterChange = (newFilters: Partial<UserFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      role: "all",
      isVerified: "all",
    });
  };

  return { filters, setFilters: handleFilterChange, resetFilters };
}
