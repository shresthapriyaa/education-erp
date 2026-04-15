// // "use client";

// // import { useEffect, useState } from "react";
// // import { Plus, Search } from "lucide-react";
// // import { Button } from "@/core/components/ui/button";
// // import { Input } from "@/core/components/ui/input";
// // import { SchoolDialog } from "@/features/schools/components/SchoolDialog";
// // import { SchoolTable } from "@/features/schools/components/SchoolTable";
// // import { ConfirmDelete } from "@/features/schools/components/ConfirmDelete";
// // import { useSchools } from "@/features/schools/hooks/useSchool";
// // import type {
// //   SchoolDTO,
// //   SchoolFormValues,
// // } from "@/features/schools/types/school.types";

// // export default function SchoolsPage() {
// //   const { schools, loading, load, create, update, remove } = useSchools();

// //   const [search, setSearch] = useState("");
// //   const [dialogOpen, setDialogOpen] = useState(false);
// //   const [editRecord, setEditRecord] = useState<SchoolDTO | undefined>();
// //   const [deleteTarget, setDeleteTarget] = useState<SchoolDTO | null>(null);

// //   useEffect(() => {
// //     load();
// //   }, [load]);

// //   // client-side search filter
// //   const filtered = schools.filter(
// //     (s) =>
// //       s.name.toLowerCase().includes(search.toLowerCase()) ||
// //       (s.address ?? "").toLowerCase().includes(search.toLowerCase()),
// //   );

// //   function openCreate() {
// //     setEditRecord(undefined);
// //     setDialogOpen(true);
// //   }
// //   function openEdit(s: SchoolDTO) {
// //     setEditRecord(s);
// //     setDialogOpen(true);
// //   }

// //   async function handleSubmit(values: SchoolFormValues) {
// //     if (editRecord) {
// //       await update(editRecord.id, values);
// //     } else {
// //       await create(values);
// //     }
// //     setDialogOpen(false);
// //   }

// //   async function handleDelete() {
// //     if (!deleteTarget) return;
// //     await remove(deleteTarget.id);
// //     setDeleteTarget(null);
// //   }

// //   return (
// //     <div className="p-6 space-y-6">
// //       {/* Header */}
// //       <div className="flex items-center justify-between">
// //         <div>
// //           <h1 className="text-2xl font-bold">Schools</h1>
// //           <p className="text-muted-foreground text-sm">
// //             Manage schools and their GPS attendance zones
// //           </p>
// //         </div>
// //         <Button onClick={openCreate}>
// //           <Plus className="mr-2 h-4 w-4" /> Add School
// //         </Button>
// //       </div>

// //       {/* Stats */}
// //       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-sm">
// //         <div className="rounded-xl border bg-card p-4 text-center">
// //           <p className="text-3xl font-bold">{schools.length}</p>
// //           <p className="text-sm text-muted-foreground mt-1">Total Schools</p>
// //         </div>
// //       </div>

// //       {/* Search */}
// //       <div className="relative max-w-sm">
// //         <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
// //         <Input
// //           placeholder="Search schools…"
// //           value={search}
// //           onChange={(e) => setSearch(e.target.value)}
// //           className="pl-9"
// //         />
// //       </div>

// //       {/* Table */}
// //       <SchoolTable
// //         schools={filtered}
// //         loading={loading}
// //         onEdit={openEdit}
// //         onDelete={(s) => setDeleteTarget(s)}
// //       />

// //       {/* Create / Edit dialog */}
// //       <SchoolDialog
// //         open={dialogOpen}
// //         onOpenChange={setDialogOpen}
// //         record={editRecord}
// //         onSubmit={handleSubmit}
// //         isLoading={loading}
// //       />

// //       {/* Delete confirm */}
// //       <ConfirmDelete
// //         open={!!deleteTarget}
// //         onOpenChange={(o) => !o && setDeleteTarget(null)}
// //         title="Delete School?"
// //         description={
// //           deleteTarget
// //             ? `Permanently delete "${deleteTarget.name}"? All classes and attendance records linked to this school will also be affected.`
// //             : "This action cannot be undone."
// //         }
// //         onConfirm={handleDelete}
// //         isLoading={loading}
// //       />
// //     </div>
// //   );
// // }




"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { School, MapPin, Loader2, Save } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/core/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/core/components/ui/form";
import { Input } from "@/core/components/ui/input";
import { Button } from "@/core/components/ui/button";
import { Badge } from "@/core/components/ui/badge";
import { useSchools } from "@/features/schools/hooks/useSchool";
import type { SchoolDTO } from "@/features/schools/types/school.types";

// Leaflet must never SSR
const SchoolMap = dynamic(
  () => import("@/features/schools/components/SchoolMap").then((m) => m.SchoolMap),
  { ssr: false, loading: () => (
    <div className="h-80 rounded-lg bg-muted flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
    </div>
  )}
);

// SchoolFormValues uses strings (matches your existing type)
const schema = z.object({
  name:         z.string().min(2, "School name is required"),
  address:      z.string().min(3, "Address is required"),
  latitude:     z.string().min(1, "Pin the location on the map"),
  longitude:    z.string().min(1, "Pin the location on the map"),
  radiusMeters: z.string(),
});

type FormValues = z.infer<typeof schema>;

// Default to Kathmandu centre if no school yet
const DEFAULT_LAT = 27.7172;
const DEFAULT_LON = 85.324;
const DEFAULT_RADIUS = 20;

export default function SchoolPage() {
  const { schools, loading, load, create, update } = useSchools();
  const [school, setSchool] = useState<SchoolDTO | null>(null);
  const [mapLat, setMapLat] = useState(DEFAULT_LAT);
  const [mapLon, setMapLon] = useState(DEFAULT_LON);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name:         "",
      address:      "",
      latitude:     "",
      longitude:    "",
      radiusMeters: String(DEFAULT_RADIUS),
    },
  });

  // Load once — grab the single school if it exists
  useEffect(() => {
    load();
  }, [load]);

  // Once loaded, populate form with existing school
  useEffect(() => {
    if (schools.length === 0) return;
    const s = schools[0];
    setSchool(s);
    setMapLat(s.latitude);
    setMapLon(s.longitude);
    form.reset({
      name:         s.name,
      address:      s.address ?? "",
      latitude:     String(s.latitude),
      longitude:    String(s.longitude),
      radiusMeters: String(s.radiusMeters),
    });
  }, [schools, form]);

  // When admin clicks the map — update both the map pin and the hidden form fields
  const handleMapPick = (lat: number, lon: number) => {
    setMapLat(lat);
    setMapLon(lon);
    form.setValue("latitude",  lat.toFixed(7), { shouldValidate: true });
    form.setValue("longitude", lon.toFixed(7), { shouldValidate: true });
  };

  const onSubmit = async (values: FormValues) => {
    if (school) {
      await update(school.id, values);
    } else {
      await create(values);
    }
  };

  const radius = Number(form.watch("radiusMeters") || DEFAULT_RADIUS);
  const isSetup = !school && !loading;

  if (loading && schools.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin w-8 h-8 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
          <School className="w-5 h-5 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">
            {isSetup ? "Set up your school" : "School Settings"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isSetup
              ? "One-time setup. Enter your school details and pin its location."
              : "Update your school details and geofence location."}
          </p>
        </div>
        {school && (
          <Badge variant="outline" className="ml-auto">
            Configured
          </Badge>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          {/* Basic info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Basic information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Sunrise Academy" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Street, City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Map + geofence */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Geofence location
              </CardTitle>
              <CardDescription>
                Click on the map to place your school pin. Teachers must be
                within the radius to mark attendance.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">

              {/* Map */}
              <SchoolMap
                lat={mapLat}
                lon={mapLon}
                radius={radius}
                onPick={handleMapPick}
              />

              {/* Coordinates — read-only, set by map */}
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly className="bg-muted text-xs" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly className="bg-muted text-xs" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Radius */}
              <FormField
                control={form.control}
                name="radiusMeters"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allowed radius (metres)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={10}
                        max={500}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Teachers must be within this distance from the pin to mark
                      attendance. Recommended: 20 m.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </CardContent>
          </Card>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {school ? "Update school" : "Save school"}
          </Button>

        </form>
      </Form>
    </div>
  );
}
