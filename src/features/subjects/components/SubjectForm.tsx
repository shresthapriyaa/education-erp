"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/core/components/ui/button";
import {
  Form, FormControl, FormField, FormItem,
  FormLabel, FormMessage,
} from "@/core/components/ui/form";
import { Input } from "@/core/components/ui/input";
import { Textarea } from "@/core/components/ui/textarea";
import { Loader2, Save, PlusCircle } from "lucide-react";
import { Subject } from "../types/subject.types";

const schema = z.object({
  name: z.string().min(2, "Minimum 2 characters"),
  description: z.string().min(5, "Minimum 5 characters"),
});

type FormValues = z.infer<typeof schema>;

export type SubmitMode = "create" | "put" | "patch";
type SubjectPayload = Partial<Subject>;

interface SubjectFormProps {
  initialValues?: Partial<Subject>;
  onSubmit: (values: SubjectPayload, mode: SubmitMode) => void;
  loading?: boolean;
  isEdit?: boolean;
  onCancel?: () => void;
}

export function SubjectForm({
  initialValues,
  onSubmit,
  loading = false,
  isEdit = false,
  onCancel,
}: SubjectFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialValues?.name ?? "",
      description: initialValues?.description ?? "",
    },
  });

  const handlePut = form.handleSubmit((values) => {
    onSubmit(values, isEdit ? "put" : "create");
  });

  return (
    <Form {...form}>
      <form className="space-y-4">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel>Subject Name</FormLabel>
            <FormControl><Input placeholder="e.g. Mathematics" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Brief description of the subject..."
                className="resize-none"
                rows={3}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="flex gap-2 pt-2 justify-end">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          )}
          {isEdit ? (
            <Button type="button" onClick={handlePut} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : <Save />}
              Save All
            </Button>
          ) : (
            <Button type="button" onClick={handlePut} disabled={loading}>
              Submit
              <PlusCircle className="ml-2" />
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}