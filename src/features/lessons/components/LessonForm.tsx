"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/core/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/core/components/ui/form";
import { Input } from "@/core/components/ui/input";
import { Textarea } from "@/core/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import { Loader2, Save, PlusCircle, Trash2 } from "lucide-react";
import { Lesson } from "../types/lesson.types";

const materialSchema = z.object({
  title: z.string().min(1, "Title required"),
  type: z.string().min(1, "Type required"),
  url: z.string().min(1, "URL is required"),
});

const schema = z.object({
  title: z.string().min(2, "Minimum 2 characters"),
  content: z.string().min(10, "Minimum 10 characters"),
  materials: z.array(materialSchema).optional(),
});

type FormValues = z.infer<typeof schema>;

export type SubmitMode = "create" | "put" | "patch";
type LessonPayload = Partial<Lesson>;

const MATERIAL_TYPES = ["PDF", "VIDEO", "LINK", "IMAGE", "DOCUMENT", "OTHER"];

interface LessonFormProps {
  initialValues?: Partial<Lesson>;
  onSubmit: (values: LessonPayload, mode: SubmitMode) => void;
  loading?: boolean;
  isEdit?: boolean;
  onCancel?: () => void;
}

export function LessonForm({
  initialValues,
  onSubmit,
  loading = false,
  isEdit = false,
  onCancel,
}: LessonFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialValues?.title ?? "",
      content: initialValues?.content ?? "",
      materials:
        initialValues?.materials?.map((m) => ({
          title: m.title,
          type: m.type,
          url: m.url,
        })) ?? [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "materials",
  });

  //   const handlePut = form.handleSubmit((values) => {
  //     onSubmit(values, isEdit ? "put" : "create");
  //   });
  const handlePut = form.handleSubmit((values) => {
    onSubmit(values as LessonPayload, isEdit ? "put" : "create");
  });
  return (
    <Form {...form}>
      <form className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lesson Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Introduction to Algebra" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write lesson content here..."
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Materials */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <FormLabel>Materials</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ title: "", type: "PDF", url: "" })}
            >
              <PlusCircle className="mr-1 h-3.5 w-3.5" />
              Add Material
            </Button>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="rounded-lg border p-3 space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Material {index + 1}</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name={`materials.${index}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Chapter 1 PDF" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`materials.${index}.type`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {MATERIAL_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* <FormField control={form.control} name={`materials.${index}.url`} render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">URL</FormLabel>
                  <FormControl><Input placeholder="https://example.com/file.pdf" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} /> */}

              <FormField
                control={form.control}
                name={`materials.${index}.url`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Link</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Paste Google Drive, YouTube or any link here"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-2 justify-end">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
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
