"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { useEffect, useState, useRef } from "react";
import * as z from "zod";
import { Button } from "@/core/components/ui/button";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription,
} from "@/core/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/core/components/ui/select";
import { Input } from "@/core/components/ui/input";
import { RichTextEditor } from "@/core/components/ui/rich-text-editor";
import { Loader2, Save, PlusCircle, Trash2, UploadCloud, FileText, File } from "lucide-react";
import { Assignment } from "../types/assignment.types";
import { ClassSubjectSelector } from "@/core/components/ClassSubjectSelector";

const materialSchema = z.object({
  title: z.string().min(1, "Title required"),
  type: z.string().min(1, "Type required"),
  url: z.string().min(1, "URL required"),
});

const schema = z.object({
  title:           z.string().min(2, "Minimum 2 characters"),
  description:     z.string().min(5, "Minimum 5 characters"),
  dueDate:         z.string().min(1, "Please select a due date"),
  totalMarks:      z.coerce.number().min(1, "Total marks required"),
  classSubjectId:  z.string().min(1, "Please select a class and subject"),
  materials:       z.array(materialSchema).optional(),
});

type FormValues = z.infer<typeof schema>;
export type SubmitMode = "create" | "put" | "patch";
type AssignmentPayload = Partial<Assignment>;

const MATERIAL_TYPES = ["PDF", "DOCUMENT"];

interface MaterialRowProps {
  index: number;
  control: any;
  onRemove: () => void;
  setValue: any;
}

function MaterialRow({ index, control, onRemove, setValue }: MaterialRowProps) {
  const currentUrl = useWatch({ control, name: `materials.${index}.url` });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/assignments/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      
      // Auto-fill title from filename if empty
      const currentTitle = control._formValues.materials[index]?.title;
      if (!currentTitle || currentTitle.trim() === "") {
        const filename = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
        setValue(`materials.${index}.title`, filename, { shouldValidate: true });
      }
      
      // Auto-detect type from file extension
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'pdf') {
        setValue(`materials.${index}.type`, 'PDF', { shouldValidate: true });
      } else {
        setValue(`materials.${index}.type`, 'DOCUMENT', { shouldValidate: true });
      }
      
      setValue(`materials.${index}.url`, data.url, { shouldValidate: true });
    } catch (err: any) {
      setUploadError(err.message ?? "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="rounded-lg border p-3 space-y-3">
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium">Material {index + 1}</p>
        <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={onRemove}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FormField control={control} name={`materials.${index}.title`} render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs">Title</FormLabel>
            <FormControl><Input placeholder="e.g. Assignment PDF" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={control} name={`materials.${index}.type`} render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs">Type</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              </FormControl>
              <SelectContent>
                {MATERIAL_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />
      </div>

      {currentUrl && !uploadError ? (
        <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">
          <FileText className="h-4 w-4" />
          <span className="flex-1 truncate">{currentUrl.split("/").pop()}</span>
          <button type="button" className="text-xs underline text-muted-foreground"
            onClick={() => { setValue(`materials.${index}.url`, "", { shouldValidate: true }); }}>
            Remove
          </button>
        </div>
      ) : (
        <label className="cursor-pointer">
          <div className={`flex items-center gap-2 rounded-md border border-dashed px-3 py-2 text-sm ${uploading ? "border-muted text-muted-foreground" : "border-gray-300 hover:border-gray-400"}`}>
            {uploading ? <><Loader2 className="h-4 w-4 animate-spin" />Uploading...</> : <><UploadCloud className="h-4 w-4" />Click to upload PDF or DOC</>}
          </div>
          <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.xlsx,.xls" className="hidden" disabled={uploading} onChange={handleFileChange} />
        </label>
      )}
      {uploadError && <p className="text-xs text-destructive">{uploadError}</p>}
    </div>
  );
}

interface AssignmentFormProps {
  initialValues?: Partial<Assignment>;
  onSubmit: (values: AssignmentPayload, mode: SubmitMode) => void;
  loading?: boolean;
  isEdit?: boolean;
  onCancel?: () => void;
}

export function AssignmentForm({
  initialValues, onSubmit, loading = false, isEdit = false, onCancel,
}: AssignmentFormProps) {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [classSubjectId, setClassSubjectId] = useState<string | null>(null);

  // Load initial class/subject from classSubjectId if editing
  useEffect(() => {
    if (initialValues?.classSubjectId) {
      // In edit mode, we need to fetch the class and subject from the classSubjectId
      fetch(`/api/class-subject/${initialValues.classSubjectId}`)
        .then(r => r.json())
        .then(data => {
          if (data.class && data.subject) {
            setSelectedClass(data.class.id);
            setSelectedSubject(data.subject.id);
            setClassSubjectId(data.id);
          }
        })
        .catch(console.error);
    }
  }, [initialValues?.classSubjectId]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      title:           initialValues?.title       ?? "",
      description:     initialValues?.description ?? "",
      dueDate:         initialValues?.dueDate ? new Date(initialValues.dueDate).toISOString().split("T")[0] : "",
      totalMarks:      initialValues?.totalMarks  ?? 100,
      classSubjectId:  initialValues?.classSubjectId ?? "",
      materials:       initialValues?.materials?.map(m => ({ title: m.title, type: m.type, url: m.url })) ?? [],
    },
  });

  useEffect(() => {
    form.reset({
      title:           initialValues?.title       ?? "",
      description:     initialValues?.description ?? "",
      dueDate:         initialValues?.dueDate ? new Date(initialValues.dueDate).toISOString().split("T")[0] : "",
      totalMarks:      initialValues?.totalMarks  ?? 100,
      classSubjectId:  initialValues?.classSubjectId ?? "",
      materials:       initialValues?.materials?.map(m => ({ title: m.title, type: m.type, url: m.url })) ?? [],
    });
  }, [initialValues]);

  // Update form when classSubjectId changes
  useEffect(() => {
    if (classSubjectId) {
      form.setValue("classSubjectId", classSubjectId, { shouldValidate: true });
    }
  }, [classSubjectId, form]);

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "materials" });

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit(values as AssignmentPayload, isEdit ? "put" : "create");
  });

  return (
    <Form {...form}>
      <form className="space-y-4">
        <FormField control={form.control} name="title" render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl><Input placeholder="e.g. Chapter 5 Exercise" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <RichTextEditor value={field.value} onChange={field.onChange} placeholder="Write assignment instructions here..." />
            </FormControl>
            <FormDescription className="text-xs">
              Use the toolbar to format text. Supports bold, italic, headings, lists, and links.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField control={form.control} name="dueDate" render={({ field }) => (
            <FormItem>
              <FormLabel>Due Date</FormLabel>
              <FormControl><Input type="date" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="totalMarks" render={({ field }) => (
            <FormItem>
              <FormLabel>Total Marks</FormLabel>
              <FormControl><Input type="number" placeholder="100" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        {/* Class and Subject Selection */}
        <div className="space-y-4">
          <FormField 
            control={form.control} 
            name="classSubjectId" 
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class & Subject Assignment</FormLabel>
                <FormControl>
                  <ClassSubjectSelector
                    selectedClass={selectedClass}
                    selectedSubject={selectedSubject}
                    onClassChange={setSelectedClass}
                    onSubjectChange={setSelectedSubject}
                    onClassSubjectChange={setClassSubjectId}
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <FormLabel>Materials (PDFs, Docs)</FormLabel>
            <Button type="button" variant="outline" size="sm" onClick={() => append({ title: "", type: "PDF", url: "" })}>
              <PlusCircle className="mr-1 h-3.5 w-3.5" />Add Material
            </Button>
          </div>
          {fields.map((field, index) => (
            <MaterialRow key={field.id} index={index} control={form.control} onRemove={() => remove(index)} setValue={form.setValue} />
          ))}
        </div>

        <div className="flex gap-2 pt-2 justify-end">
          {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>}
          <Button type="button" onClick={handleSubmit} disabled={loading} className="bg-black hover:bg-gray-800">
            {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : isEdit ? <Save className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
            {isEdit ? "Save All" : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
