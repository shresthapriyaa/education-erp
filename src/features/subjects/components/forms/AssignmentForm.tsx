"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import * as z from "zod";
import { Button } from "@/core/components/ui/button";
import {
  Form, FormControl, FormField, FormItem,
  FormLabel, FormMessage, FormDescription,
} from "@/core/components/ui/form";
import { Input } from "@/core/components/ui/input";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/core/components/ui/select";
import { RichTextEditor } from "@/core/components/ui/rich-text-editor";
import { Loader2, Save, PlusCircle, Upload, X, FileText } from "lucide-react";
import { Assignment } from "@/features/assignments/types/assignment.types";

const schema = z.object({
  title: z.string().min(3, "Minimum 3 characters"),
  description: z.string().min(10, "Minimum 10 characters"),
  dueDate: z.string().min(1, "Due date is required"),
  totalMarks: z.number().min(1, "Must be at least 1").max(1000, "Maximum 1000"),
  classId: z.string().min(1, "Please select a class"),
  teacherId: z.string().min(1, "Please select a teacher"),
  fileUrl: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface ClassOption { id: string; name: string; }
interface TeacherOption { id: string; username: string; }

interface AssignmentFormProps {
  initialValues?: Partial<Assignment>;
  onSubmit: (values: any) => void;
  loading?: boolean;
  isEdit?: boolean;
  onCancel?: () => void;
  subjectId: string;
}

export function AssignmentForm({
  initialValues,
  onSubmit,
  loading = false,
  isEdit = false,
  onCancel,
  subjectId,
}: AssignmentFormProps) {
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [teachers, setTeachers] = useState<TeacherOption[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/classes")
      .then((r) => r.json())
      .then((d) => setClasses(Array.isArray(d) ? d : []))
      .catch(() => setClasses([]));

    fetch("/api/teachers")
      .then((r) => r.json())
      .then((d) => setTeachers(Array.isArray(d) ? d : []))
      .catch(() => setTeachers([]));
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialValues?.title ?? "",
      description: initialValues?.description ?? "",
      dueDate: initialValues?.dueDate
        ? new Date(initialValues.dueDate).toISOString().split("T")[0]
        : "",
      totalMarks: initialValues?.totalMarks ?? 100,
      classId: initialValues?.classId ?? "",
      teacherId: initialValues?.teacherId ?? "",
      fileUrl: (initialValues as any)?.fileUrl ?? "",
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");

    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/assignments/upload", {
        method: "POST",
        body: fd,
      });

      const contentType = res.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) {
        throw new Error("Upload route not found");
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");

      form.setValue("fileUrl", data.url, { shouldValidate: true });
    } catch (err: any) {
      setUploadError(err.message ?? "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit({ ...values, subjectId });
  });

  const currentFileUrl = form.watch("fileUrl");

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Chapter 5 Homework" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description with Rich Text Editor */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Write assignment instructions here... Use markdown for formatting."
                />
              </FormControl>
              <FormDescription>
                Use the toolbar to format text. Supports bold, italic, headings, lists, and links.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Due Date + Total Marks */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="totalMarks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Marks</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    max="1000"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Class + Teacher */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="classId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {classes.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="teacherId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teacher</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select teacher" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {teachers.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* File Upload (Optional) */}
        <FormField
          control={form.control}
          name="fileUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Attachment (Optional)</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  {currentFileUrl && !uploadError ? (
                    <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm">
                      <FileText className="h-4 w-4 text-green-600" />
                      <a
                        href={currentFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-green-700 hover:underline truncate"
                      >
                        {currentFileUrl.split("/").pop()}
                      </a>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => {
                          form.setValue("fileUrl", "", { shouldValidate: true });
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <div
                        className={`flex items-center gap-2 rounded-md border border-dashed px-4 py-3 text-sm transition-colors ${
                          uploading
                            ? "border-muted text-muted-foreground"
                            : "border-gray-300 hover:border-gray-400 hover:bg-muted/30"
                        }`}
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4" />
                            Click to upload file (PDF, DOC, etc.)
                          </>
                        )}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.xlsx,.xls"
                        className="hidden"
                        disabled={uploading}
                        onChange={handleFileUpload}
                      />
                    </label>
                  )}
                  {uploadError && (
                    <p className="text-xs text-destructive">{uploadError}</p>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                Upload supporting materials (PDF, Word, Excel, PowerPoint)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="flex gap-2 pt-2 justify-end">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={loading} className="bg-black hover:bg-gray-800">
            {loading ? (
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
            ) : isEdit ? (
              <Save className="mr-2 h-4 w-4" />
            ) : (
              <PlusCircle className="mr-2 h-4 w-4" />
            )}
            {isEdit ? "Save Changes" : "Create Assignment"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
