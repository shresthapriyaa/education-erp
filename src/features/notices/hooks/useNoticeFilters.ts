"use client";

import { useState } from "react";

export function useNoticeFilters() {
  const [filters, setFilters] = useState<{ search?: string }>({});

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return { filters, updateFilter };
}





