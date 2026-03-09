"use client";
import { useEffect } from "react";
import { useFees } from "../hooks/useFees";
import { FeeTable } from "./Feetable";
import { Fee } from "../types/fee.types";

type FeePayload = Partial<Fee> & { studentId?: string };

export default function FeesPage() {
  const { fees, loading, fetchFees, createFee, updateFee, patchFee, deleteFee } = useFees();

  useEffect(() => { fetchFees(); }, [fetchFees]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fees</h1>
        <p className="text-muted-foreground">Manage student fee records.</p>
      </div>
      <FeeTable
        fees={fees}
        loading={loading}
        onAdd={async (values) => { await createFee(values); }}
        onEdit={async (id, values, mode) => {
          if (mode === "patch") await patchFee(id, values);
          else await updateFee(id, values);
        }}
        onDelete={async (id) => { await deleteFee(id); }}
      />
    </div>
  );
}