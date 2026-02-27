"use client";

import { useEffect } from "react";
import { useAccountants } from "@/features/accountants/hooks/useAccountant";
import { useAccountantFilters } from "@/features/accountants/hooks/useAccountantFilter";
import { AccountantTable } from "@/features/accountants/components/AccountantTable";
import type { Accountant } from "@/features/accountants/types/accountant.types";
import { SubmitMode } from "@/features/accountants/components/AccountantForm";

type AccountantPayload = Partial<Accountant>;

export default function AccountantsPage() {
  const {
    accountants, loading, fetchAccountants,
    createAccountant, updateAccountant, patchAccountant, deleteAccountant,
  } = useAccountants();

  const { filters } = useAccountantFilters();

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAccountants(filters);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters, fetchAccountants]);

  const handleAdd = async (values: AccountantPayload) => {
    await createAccountant(values);
  };

  const handleEdit = async (id: string, values: AccountantPayload, mode: SubmitMode) => {
    if (mode === "patch") {
      await patchAccountant(id, values);
    } else {
      await updateAccountant(id, values);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteAccountant(id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Accountants</h1>
        <p className="text-muted-foreground">
          Manage accountant records and their access.
        </p>
      </div>
      <AccountantTable
        accountants={accountants}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}