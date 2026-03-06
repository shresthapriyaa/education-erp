"use client";

import { useEffect } from "react";
import { useResults } from "@/features/results/hooks/useResults";
import { useResultFilters } from "@/features/results/hooks/useResultFilters";
import { ResultTable } from "@/features/results/components/ResultTable";
import type { Result } from "@/features/results/types/result.types";
import { SubmitMode } from "@/features/results/components/ResultForm";

type ResultPayload = Partial<Result> & { studentId?: string; subjectId?: string };

export default function ResultsPage() {
  const {
    results, loading, fetchResults,
    createResult, updateResult, patchResult, deleteResult,
  } = useResults();

  const { filters } = useResultFilters();

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchResults(filters);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters, fetchResults]);

  const handleAdd = async (values: ResultPayload) => {
    await createResult(values);
  };

  const handleEdit = async (id: string, values: ResultPayload, mode: SubmitMode) => {
    if (mode === "patch") {
      await patchResult(id, values);
    } else {
      await updateResult(id, values);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteResult(id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Results</h1>
        <p className="text-muted-foreground">
          Manage student results per subject.
        </p>
      </div>
      <ResultTable
        results={results}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}