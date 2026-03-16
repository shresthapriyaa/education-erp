"use client";
import { useEffect } from "react";
import { useSchoolZones } from "@/features/schoolzones/hooks/useSchoolZones";
import { SchoolZoneTable } from "./SchoolzoneTable";
import { SchoolZonePayload, SubmitMode } from "./SchoolzoneForm";
export default function SchoolZonesPage() {
  const {
    zones, loading,
    fetchZones, createZone, updateZone, deleteZone,
  } = useSchoolZones();

  useEffect(() => {
    fetchZones();
  }, [fetchZones]);

  const handleAdd = async (values: SchoolZonePayload) => {
    await createZone(values);
  };

  const handleEdit = async (id: string, values: SchoolZonePayload, _mode: SubmitMode) => {
    await updateZone(id, values);
  };

  const handleDelete = async (id: string) => {
    await deleteZone(id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">School Zones</h1>
        <p className="text-muted-foreground">
          Manage GPS zones for attendance tracking.
        </p>
      </div>
      <SchoolZoneTable
        zones={zones}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}