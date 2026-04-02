"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import * as z from "zod";
import { Button } from "@/core/components/ui/button";
import {
  Form, FormControl, FormField, FormItem,
  FormLabel, FormMessage,
} from "@/core/components/ui/form";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/core/components/ui/select";
import { Input } from "@/core/components/ui/input";
import { Textarea } from "@/core/components/ui/textarea";
import { Switch } from "@/core/components/ui/switch";
import { Loader2, Save, PlusCircle } from "lucide-react";
import { SchoolZone, SchoolZonePayload } from "../types/Schoolzone.types";
// import type { SchoolZone, SchoolZonePayload } from "../types/schoolzone.types";

const schema = z.object({
  schoolId:     z.string().min(1, "Please select a school"),
  name:         z.string().min(1, "Name is required"),
  description:  z.string().optional(),
  latitude:     z.coerce.number(),
  longitude:    z.coerce.number(),
  radiusMeters: z.coerce.number().min(1, "Radius must be at least 1"),
  color:        z.string().optional(),
  isActive:     z.boolean().default(true),
});

type FormValues = z.infer<typeof schema>;

export type SubmitMode = "create" | "put";
export type { SchoolZonePayload };

interface SchoolOption { id: string; name: string; }

interface SchoolZoneFormProps {
  initialValues?: Partial<SchoolZone>;
  onSubmit: (values: SchoolZonePayload, mode: SubmitMode) => void;
  loading?: boolean;
  isEdit?: boolean;
  onCancel?: () => void;
}

export function SchoolZoneForm({
  initialValues,
  onSubmit,
  loading = false,
  isEdit = false,
  onCancel,
}: SchoolZoneFormProps) {
  const [schools, setSchools] = useState<SchoolOption[]>([]);

  useEffect(() => {
    fetch("/api/schools")
      .then((r) => r.json())
      .then((d) => setSchools(Array.isArray(d) ? d : []))
      .catch(() => setSchools([]));
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      schoolId:     initialValues?.schoolId     ?? "",
      name:         initialValues?.name         ?? "",
      description:  initialValues?.description  ?? "",
      latitude:     initialValues?.latitude     ?? 0,
      longitude:    initialValues?.longitude    ?? 0,
      radiusMeters: initialValues?.radiusMeters ?? 100,
      color:        initialValues?.color        ?? "#3B82F6",
      isActive:     initialValues?.isActive     ?? true,
    },
  });

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit(values as SchoolZonePayload, isEdit ? "put" : "create");
  });

  return (
    <Form {...form}>
      <form className="space-y-4">

        {/* School */}
        <FormField
          control={form.control as any}
          name="schoolId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>School</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Select a school" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  {schools.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Name */}
        <FormField
          control={form.control as any}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zone Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Main Gate" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control as any}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description <span className="text-muted-foreground text-xs">(optional)</span></FormLabel>
              <FormControl>
                <Textarea placeholder="Zone description..." rows={2} className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Lat / Long */}
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control as any}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitude</FormLabel>
                <FormControl>
                  <Input type="number" step="any" placeholder="e.g. 27.7172" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control as any}
            name="longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitude</FormLabel>
                <FormControl>
                  <Input type="number" step="any" placeholder="e.g. 85.3240" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Radius + Color */}
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control as any}
            name="radiusMeters"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Radius (meters)</FormLabel>
                <FormControl>
                  <Input type="number" min={1} placeholder="e.g. 100" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control as any}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color <span className="text-muted-foreground text-xs">(optional)</span></FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={field.value ?? "#3B82F6"}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="h-9 w-12 rounded border cursor-pointer"
                    />
                    <Input placeholder="#3B82F6" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* isActive */}
        <FormField
          control={form.control as any}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <FormLabel>Active</FormLabel>
                <p className="text-xs text-muted-foreground">Enable or disable this zone</p>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-2 pt-2 justify-end w-full">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          )}
          {isEdit ? (
            <Button type="button" onClick={handleSubmit} disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
              Save All
            </Button>
          ) : (
            <Button type="button" onClick={handleSubmit} disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
              Submit
              <PlusCircle className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}