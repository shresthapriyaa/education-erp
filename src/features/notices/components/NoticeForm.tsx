"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import * as z from "zod";
import { Button } from "@/core/components/ui/button";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/core/components/ui/form";
import { Input } from "@/core/components/ui/input";
import { Textarea } from "@/core/components/ui/textarea";
import { Loader2, Save, PlusCircle } from "lucide-react";
import { Notice } from "../types/notice.types";

const schema = z.object({
  title: z.string().min(2, "Minimum 2 characters"),
  content: z.string().min(5, "Minimum 5 characters"),
});

type FormValues = z.infer<typeof schema>;
export type SubmitMode = "create" | "put" | "patch";
type NoticePayload = Partial<Notice>;

interface NoticeFormProps {
  initialValues?: Partial<Notice>;
  onSubmit: (values: NoticePayload, mode: SubmitMode) => void;
  loading?: boolean;
  isEdit?: boolean;
  onCancel?: () => void;
}

export function NoticeForm({
  initialValues, onSubmit, loading = false, isEdit = false, onCancel,
}: NoticeFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      title: initialValues?.title ?? "",
      content: initialValues?.content ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      title: initialValues?.title ?? "",
      content: initialValues?.content ?? "",
    });
  }, [initialValues]);

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit(values as NoticePayload, isEdit ? "put" : "create");
  });

  return (
    <Form {...form}>
      <form className="space-y-4">
        <FormField control={form.control} name="title" render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl><Input placeholder="e.g. Holiday Notice" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="content" render={({ field }) => (
          <FormItem>
            <FormLabel>Content</FormLabel>
            <FormControl>
              <Textarea placeholder="Write notice content here..." className="resize-none" rows={5} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <div className="flex gap-2 pt-2 justify-end">
          {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>}
          {isEdit ? (
            <Button type="button" onClick={handleSubmit} disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
              Save All
            </Button>
          ) : (
            <Button type="button" onClick={handleSubmit} disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
              Submit
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}