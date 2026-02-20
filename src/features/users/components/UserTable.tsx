"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/components/ui/table";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/core/components/ui/tooltip";
import { Pencil, Trash2, Loader2, Search, UserPlus, X } from "lucide-react";
import { StatusBadge } from "@/core/components/StatusBadge";
import { User } from "../types/user.types";
// import { UserFiltersState } from "@/app/admin/users/page";
import { cn } from "@/core/lib/utils";
import { UserFiltersState } from "@/app/(dashboard)/admin/users/page";

const ROLES = ["ADMIN", "TEACHER", "STUDENT", "PARENT", "ACCOUNTANT"] as const;
type Role = (typeof ROLES)[number];

const ROLE_STYLES: Record<Role, string> = {
  ADMIN:      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 ring-1 ring-slate-200 dark:ring-slate-700",
  TEACHER:    "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 ring-1 ring-blue-200 dark:ring-blue-800",
  STUDENT:    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 ring-1 ring-emerald-200 dark:ring-emerald-800",
  PARENT:     "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 ring-1 ring-amber-200 dark:ring-amber-800",
  ACCOUNTANT: "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 ring-1 ring-purple-200 dark:ring-purple-800",
};

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onAddUser: () => void;
  filters: UserFiltersState;
  onFilterChange: (filters: UserFiltersState) => void;
  loading?: boolean;
}

export function UserTable({
  users,
  onEdit,
  onDelete,
  onAddUser,
  filters,
  onFilterChange,
  loading = false,
}: UserTableProps) {
  const hasActiveFilters =
    filters.search || filters.role !== "all" || filters.isVerified !== "all";

  const clearFilters = () =>
    onFilterChange({ search: "", role: "all", isVerified: "all" });

  if (loading) {
    return (
      <div className="rounded-xl border bg-card p-14">
        <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
          <Loader2 className="h-7 w-7 animate-spin opacity-60" />
          <p className="text-sm">Loading users…</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-3">
        {/* ── Single toolbar line ── */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search by name, email or ID…"
              value={filters.search}
              onChange={(e) =>
                onFilterChange({ ...filters, search: e.target.value })
              }
              className="pl-8 h-9 text-sm bg-background"
            />
          </div>

          {/* Role filter */}
          <Select
            value={filters.role ?? "all"}
            onValueChange={(v) => onFilterChange({ ...filters, role: v })}
          >
            <SelectTrigger className="h-9 w-[140px] text-sm bg-background">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {ROLES.map((r) => (
                <SelectItem key={r} value={r}>
                  <span className="capitalize">{r.toLowerCase()}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status filter */}
          <Select
            value={
              filters.isVerified === "all"
                ? "all"
                : filters.isVerified
                ? "verified"
                : "unverified"
            }
            onValueChange={(v) =>
              onFilterChange({
                ...filters,
                isVerified:
                  v === "all" ? "all" : v === "verified" ? true : false,
              })
            }
          >
            <SelectTrigger className="h-9 w-[140px] text-sm bg-background">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="unverified">Unverified</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear filters */}
          {hasActiveFilters && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-muted-foreground hover:text-foreground shrink-0"
                  onClick={clearFilters}
                >
                  <X className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Clear filters</TooltipContent>
            </Tooltip>
          )}

          <div className="flex-1" />

          {/* Add User */}
          <Button size="sm" className="h-9 gap-1.5 shrink-0" onClick={onAddUser}>
            <UserPlus className="h-4 w-4" />
            Add User
          </Button>
        </div>

        {/* ── Table ── */}
        {users.length === 0 ? (
          <div className="rounded-xl border bg-card p-12 text-center">
            <p className="text-base font-medium">No users found</p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {hasActiveFilters
                ? "Try adjusting your filters."
                : "Add a new user to get started."}
            </p>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" className="mt-4" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="w-[180px] text-sm text-black font-semibold uppercase tracking-wide ">ID</TableHead>
                    <TableHead className="w-[200px] text-sm font-semibold  text-black">Username</TableHead>
                    <TableHead className="w-[260px] text-sm font-semibold  text-black">Email</TableHead>
                    <TableHead className="w-[130px] text-center text-sm font-semibold text-black">Status</TableHead>
                    <TableHead className="w-[140px] text-sm font-semibold  text-black">Role</TableHead>
                    <TableHead className="w-[110px] text-center text-sm font-semibold text-black">Password</TableHead>
                    <TableHead className="w-[110px] text-right pr-5 text-sm font-semibold  text-black">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/50 transition-colors group">
                      <TableCell className="font-mono text-[11px] text-black">
                        {user.id.slice(0, 8)}…{user.id.slice(-4)}
                      </TableCell>
                      <TableCell className="font-medium text-sm text-black">{user.username}</TableCell>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <TableCell className="text-sm text-black max-w-[240px]">
                            <span className="block truncate">{user.email}</span>
                          </TableCell>
                        </TooltipTrigger>
                        <TooltipContent>{user.email}</TooltipContent>
                      </Tooltip>
                      <TableCell className="text-center ">
                        <StatusBadge
                          status={user.isVerified}
                          trueLabel="Verified"
                          falseLabel="Unverified"
                          size="sm"
                        />
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium capitalize",
                            ROLE_STYLES[user.role as Role] ?? "bg-gray-100 text-black"
                          )}
                        >
                          {user.role.toLowerCase()}
                        </span>
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground text-sm">—</TableCell>
                      <TableCell className="text-right pr-5">
                        <div className="flex items-center justify-end gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(user)}>
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => onDelete(user.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger >
                            <TooltipContent >Delete</TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}