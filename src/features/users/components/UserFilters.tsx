"use client";

import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import { Search, X } from "lucide-react";
import { cn } from "@/core/lib/utils";

// Type for filters (use "all" for no filter)
export interface UserFilters {
  search: string;              // always string (empty = no search)
  role?: string | "all";       // "all" = no role filter
  isVerified?: boolean | "all"; // "all" = no verified filter
}

interface UserFiltersProps {
  filters: UserFilters;
  onFilterChange: (filters: UserFilters) => void;
}

export function UserFilters({ filters, onFilterChange }: UserFiltersProps) {
  // Make sure values are always valid for <Select>
  const safeFilters: UserFilters = {
    search: filters.search ?? "",
    role: filters.role ?? "all",
    isVerified: filters.isVerified ?? "all",
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trimStart();
    onFilterChange({
      ...safeFilters,
      search: value,
    });
  };

  const handleRoleChange = (value: string) => {
    onFilterChange({
      ...safeFilters,
      role: value === "all" ? undefined : value,
    });
  };

  const handleVerifiedChange = (value: string) => {
    onFilterChange({
      ...safeFilters,
      isVerified: value === "all" ? undefined : value === "true",
    });
  };

  const handleClearAll = () => {
    onFilterChange({
      search: "",
      role: "all",
      isVerified: "all",
    });
  };

  const clearSearch = () => {
    onFilterChange({
      ...safeFilters,
      search: "",
    });
  };

  const hasActiveFilters =
    safeFilters.search !== "" ||
    safeFilters.role !== "all" ||
    safeFilters.isVerified !== "all";

  return (
    <div className="bg-card rounded-lg border p-4 mb-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
       
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search by username or email..."
            value={safeFilters.search}
            onChange={handleSearchChange}
            className={cn("pl-10", safeFilters.search && "pr-10")}
          />
          {safeFilters.search && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={clearSearch}
              title="Clear search"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>

        {/* Role select */}
        <Select
          value={safeFilters.role}
          onValueChange={handleRoleChange}
        >
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="TEACHER">Teacher</SelectItem>
            <SelectItem value="STUDENT">Student</SelectItem>
            <SelectItem value="PARENT">Parent</SelectItem>
            <SelectItem value="ACCOUNTANT">Accountant</SelectItem>
          </SelectContent>
        </Select>

        {/* Verified select + clear all */}
        <div className="flex items-center gap-2">
          <Select
            value={String(safeFilters.isVerified)}
            onValueChange={handleVerifiedChange}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Verification status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="true">Verified</SelectItem>
              <SelectItem value="false">Not Verified</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={handleClearAll}
              title="Clear all filters"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear all filters</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
