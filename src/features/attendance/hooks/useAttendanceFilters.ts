"use client";

/**
 * src/features/attendance/hooks/useAttendanceFilters.ts
 * Filter state synced to URL search params.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { AttendanceFilters, AttendanceStatus } from "../types/attendance.types";

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

const DEFAULT: AttendanceFilters = {
  status: "", classId: "", dateFrom: "", dateTo: "",
  search: "", page: 1, pageSize: 20,
};

export function useAttendanceFilters() {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  // Read from URL
  const filters = useMemo((): AttendanceFilters => ({
    status:   (searchParams.get("status")   ?? "") as AttendanceStatus | "",
    classId:  searchParams.get("classId")   ?? "",
    dateFrom: searchParams.get("dateFrom")  ?? "",
    dateTo:   searchParams.get("dateTo")    ?? "",
    search:   searchParams.get("search")    ?? "",
    page:     parseInt(searchParams.get("page")     ?? "1"),
    pageSize: parseInt(searchParams.get("pageSize") ?? "20"),
  }), [searchParams]);

  // Write to URL
  const apply = useCallback((updates: Partial<AttendanceFilters>) => {
    const next = { ...filters, ...updates };
    if (!("page" in updates)) next.page = 1;

    const p = new URLSearchParams();
    if (next.status)   p.set("status",   next.status);
    if (next.classId)  p.set("classId",  next.classId);
    if (next.dateFrom) p.set("dateFrom", next.dateFrom);
    if (next.dateTo)   p.set("dateTo",   next.dateTo);
    if (next.search)   p.set("search",   next.search);
    if (next.page > 1) p.set("page",     String(next.page));
    if (next.pageSize !== 20) p.set("pageSize", String(next.pageSize));

    router.push(`${pathname}?${p.toString()}`);
  }, [filters, pathname, router]);

  const setStatus   = useCallback((v: AttendanceStatus | "") => apply({ status: v }),   [apply]);
  const setClassId  = useCallback((v: string) => apply({ classId: v }),                 [apply]);
  const setDateFrom = useCallback((v: string) => apply({ dateFrom: v }),                [apply]);
  const setDateTo   = useCallback((v: string) => apply({ dateTo: v }),                  [apply]);
  const setSearch   = useCallback((v: string) => apply({ search: v }),                  [apply]);
  const setPage     = useCallback((v: number) => apply({ page: v }),                    [apply]);
  const setPageSize = useCallback((v: number) => apply({ pageSize: v }),                [apply]);
  const resetFilters = useCallback(() => router.push(pathname),                         [router, pathname]);

  const hasActiveFilters = useMemo(() =>
    !!(filters.status || filters.classId || filters.dateFrom || filters.dateTo || filters.search),
    [filters]
  );
  const activeFilterCount = useMemo(() =>
    [filters.status, filters.classId, filters.dateFrom, filters.dateTo, filters.search].filter(Boolean).length,
    [filters]
  );

  // Local search — commit on Enter or blur (avoid URL spam on keystroke)
  // Initialize with "" to avoid SSR/hydration mismatch — useSearchParams is undefined on server
  const [localSearch, setLocalSearch] = useState("");
  useEffect(() => { setLocalSearch(filters.search ?? ""); }, [filters.search]);
  const commitSearch = useCallback(() => setSearch(localSearch), [localSearch, setSearch]);
  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent) => { if (e.key === "Enter") commitSearch(); },
    [commitSearch]
  );

  return {
    filters,
    setStatus, setClassId, setDateFrom, setDateTo,
    setSearch, setPage, setPageSize, resetFilters,
    localSearch, setLocalSearch, commitSearch, handleSearchKeyDown,
    hasActiveFilters, activeFilterCount,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
  };
}