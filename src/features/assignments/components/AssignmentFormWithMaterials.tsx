// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm, useFieldArray, useWatch, Control } from "react-hook-form";
// import * as z from "zod";
// import { Button } from "@/core/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/core/components/ui/form";
// import { Input } from "@/core/components/ui/input";
// import { Textarea } from "@/core/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/core/components/ui/select";
// import { useState, useRef } from "react";
// import {
//   Loader2,
//   Save,
//   PlusCircle,
//   Trash2,
//   FileText,
//   Video,
//   Link2,
//   Image,
//   File,
//   HelpCircle,
//   ExternalLink,
//   UploadCloud,
// } from "lucide-react";
// import { Lesson } from "../types/lesson.types";

// const materialSchema = z.object({
//   title: z.string().min(1, "Title required"),
//   type: z.string().min(1, "Type required"),
//   url: z.string().min(1, "URL is required — upload a file or paste a link"),
// });

// const schema = z.object({
//   title: z.string().min(2, "Minimum 2 characters"),
//   content: z.string().min(10, "Minimum 10 characters"),
//   materials: z.array(materialSchema).optional(),
// });

// type FormValues = z.infer<typeof schema>;

// export type SubmitMode = "create" | "put" | "patch";
// type LessonPayload = Partial<Lesson>;

// const MATERIAL_TYPES = ["PDF", "VIDEO", "LINK", "IMAGE", "DOCUMENT", "OTHER"];

// /** Icon + label shown per material type */
// const MATERIAL_META: Record<
//   string,
//   { icon: React.ReactNode; color: string; label: string }
// > = {
//   PDF: {
//     icon: <FileText className="h-4 w-4" />,
//     color: "text-red-500",
//     label: "PDF Document",
//   },
//   VIDEO: {
//     icon: <Video className="h-4 w-4" />,
//     color: "text-blue-500",
//     label: "Video",
//   },
//   LINK: {
//     icon: <Link2 className="h-4 w-4" />,
//     color: "text-green-500",
//     label: "Link",
//   },
//   IMAGE: {
//     icon: <Image className="h-4 w-4" />,
//     color: "text-purple-500",
//     label: "Image",
//   },
//   DOCUMENT: {
//     icon: <File className="h-4 w-4" />,
//     color: "text-yellow-600",
//     label: "Document",
//   },
//   OTHER: {
//     icon: <HelpCircle className="h-4 w-4" />,
//     color: "text-gray-400",
//     label: "Other",
//   },
// };

// function MaterialTypeBadge({ type }: { type: string }) {
//   const meta = MATERIAL_META[type] ?? MATERIAL_META["OTHER"];
//   return (
//     <span
//       className={`inline-flex items-center gap-1 text-xs font-medium ${meta.color}`}
//     >
//       {meta.icon}
//       {meta.label}
//     </span>
//   );
// }

// /** Shows a small clickable preview once the URL field has a value */
// function UrlPreview({ url, type }: { url: string; type: string }) {
//   if (!url) return null;

//   const meta = MATERIAL_META[type] ?? MATERIAL_META["OTHER"];

//   return (
//     <a
//       href={url}
//       target="_blank"
//       rel="noopener noreferrer"
//       className={`inline-flex items-center gap-1.5 mt-1.5 text-xs font-medium underline underline-offset-2 ${meta.color} hover:opacity-75 transition-opacity`}
//     >
//       {meta.icon}
//       <span className="max-w-[260px] truncate">{url}</span>
//       <ExternalLink className="h-3 w-3 shrink-0" />
//     </a>
//   );
// }

// // Which types support file upload vs link-only
// const UPLOAD_CONFIG: Record<string, { accept: string; route: string; canUpload: boolean }> = {
//   IMAGE:    { accept: "image/*",                       route: "/api/lessons/upload", canUpload: true  },
//   VIDEO:    { accept: "video/*",                       route: "/api/lessons/upload", canUpload: true  },
//   PDF:      { accept: ".pdf",                          route: "/api/lessons/upload", canUpload: true  },
//   DOCUMENT: { accept: ".doc,.docx,.ppt,.pptx,.xlsx",  route: "/api/lessons/upload", canUpload: true  },
//   LINK:     { accept: "",                              route: "",                    canUpload: false },
//   OTHER:    { accept: "",                              route: "",                    canUpload: false },
// };

// // ─── MaterialRow ────────────────────────────────────────────────────────────
// // Extracted into its own component so that useWatch is always called at the
// // top level of a component — never conditionally inside a .map() callback.

// interface MaterialRowProps {
//   index: number;
//   control: Control<FormValues>;
//   onRemove: () => void;
//   setValue: (name: any, value: any, options?: any) => void;
// }

// function MaterialRow({ index, control, onRemove, setValue }: MaterialRowProps) {
//   const currentType = useWatch({ control, name: `materials.${index}.type` });
//   const currentUrl  = useWatch({ control, name: `materials.${index}.url`  });
//   const [uploading, setUploading] = useState(false);
//   const [uploadError, setUploadError] = useState("");
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const uploadCfg = UPLOAD_CONFIG[currentType ?? "OTHER"] ?? UPLOAD_CONFIG["OTHER"];

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setUploading(true);
//     setUploadError("");

//     try {
//       const fd = new FormData();
//       fd.append("file", file);

//       const res = await fetch(uploadCfg.route, { method: "POST", body: fd });

//       // Guard against non-JSON responses (e.g. Next.js 404 HTML page)
//       const contentType = res.headers.get("content-type") ?? "";
//       if (!contentType.includes("application/json")) {
//         throw new Error(`Upload route not found: ${uploadCfg.route}`);
//       }

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error ?? "Upload failed");

//       setValue(`materials.${index}.url`, data.url, { shouldValidate: true });
//     } catch (err: any) {
//       setUploadError(err.message ?? "Upload failed");
//     } finally {
//       setUploading(false);
//       // Reset so the same file can be re-selected if needed
//       if (fileInputRef.current) fileInputRef.current.value = "";
//     }
//   };

//   return (
//     <div className="rounded-lg border p-3 space-y-3">
//       {/* Row header */}
//       <div className="flex justify-between items-center">
//         <div className="flex items-center gap-2">
//           <p className="text-sm font-medium">Material {index + 1}</p>
//           {currentType && <MaterialTypeBadge type={currentType} />}
//         </div>
//         <Button
//           type="button"
//           variant="ghost"
//           size="icon"
//           className="h-7 w-7 text-destructive"
//           onClick={onRemove}
//         >
//           <Trash2 className="h-3.5 w-3.5" />
//         </Button>
//       </div>

//       <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
//         {/* Title field */}
//         <FormField
//           control={control}
//           name={`materials.${index}.title`}
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel className="text-xs">Title</FormLabel>
//               <FormControl>
//                 <Input placeholder="e.g. Chapter 1 PDF" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* Type selector */}
//         <FormField
//           control={control}
//           name={`materials.${index}.type`}
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel className="text-xs">Type</FormLabel>
//               <Select onValueChange={field.onChange} value={field.value}>
//                 <FormControl>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select type" />
//                   </SelectTrigger>
//                 </FormControl>
//                 <SelectContent>
//                   {MATERIAL_TYPES.map((t) => {
//                     const meta = MATERIAL_META[t] ?? MATERIAL_META["OTHER"];
//                     return (
//                       <SelectItem key={t} value={t}>
//                         <span className={`inline-flex items-center gap-1.5 ${meta.color}`}>
//                           {meta.icon}
//                           {t}
//                         </span>
//                       </SelectItem>
//                     );
//                   })}
//                 </SelectContent>
//               </Select>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//       </div>

//       {/* Upload button — only for IMAGE, VIDEO, PDF, DOCUMENT */}
//       {uploadCfg.canUpload && (
//         <div>
//           {/* VIDEO — only show paste link, no file upload (too large for local storage) */}
//           {currentType === "VIDEO" ? (
//             <FormField
//               control={control}
//               name={`materials.${index}.url`}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-xs">Video Link</FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder="Paste YouTube, Google Drive or Vimeo link"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                   {currentUrl && (
//                     <UrlPreview url={currentUrl} type={currentType ?? ""} />
//                   )}
//                 </FormItem>
//               )}
//             />
//           ) : (
//             <>
//               <p className="text-xs text-muted-foreground mb-1.5">Upload file</p>

//               {/* Show success state if URL already filled by upload */}
//               {currentUrl && !uploadError ? (
//                 <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">
//                   <span>✅ File uploaded successfully</span>
//                   <button
//                     type="button"
//                     className="ml-auto text-muted-foreground hover:text-destructive text-xs underline"
//                     onClick={() => {
//                       setValue(`materials.${index}.url`, "", { shouldValidate: true });
//                       if (fileInputRef.current) fileInputRef.current.value = "";
//                     }}
//                   >
//                     Remove
//                   </button>
//                 </div>
//               ) : (
//                 <label className="cursor-pointer">
//                   <div
//                     className={`flex items-center gap-2 rounded-md border border-dashed px-3 py-2 text-xs transition-colors
//                       ${uploading
//                         ? "border-muted text-muted-foreground"
//                         : "border-gray-300 hover:border-gray-400 hover:bg-muted/30"
//                       }`}
//                   >
//                     {uploading ? (
//                       <>
//                         <Loader2 className="h-3.5 w-3.5 animate-spin" />
//                         Uploading...
//                       </>
//                     ) : (
//                       <>
//                         <UploadCloud className="h-3.5 w-3.5" />
//                         Click to upload{" "}
//                         <span className="text-muted-foreground">
//                           ({currentType === "IMAGE" ? "jpg, png, webp…" :
//                             currentType === "PDF"   ? "pdf" :
//                             "doc, pptx, xlsx…"})
//                         </span>
//                       </>
//                     )}
//                   </div>
//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept={uploadCfg.accept}
//                     className="hidden"
//                     disabled={uploading}
//                     onChange={handleFileChange}
//                   />
//                 </label>
//               )}

//               {uploadError && (
//                 <p className="text-xs text-destructive mt-1">{uploadError}</p>
//               )}

//               {/* or paste link below upload box */}
//               {!currentUrl && (
//                 <>
//                   <p className="text-xs text-muted-foreground mt-1.5 mb-1.5">
//                     — or paste a link below —
//                   </p>
//                   <FormField
//                     control={control}
//                     name={`materials.${index}.url`}
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormControl>
//                           <Input
//                             placeholder={
//                               currentType === "IMAGE"
//                                 ? "or paste image URL"
//                                 : "Paste link here"
//                             }
//                             {...field}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </>
//               )}

//               {/* Preview after upload */}
//               {currentUrl && (
//                 <UrlPreview url={currentUrl} type={currentType ?? ""} />
//               )}
//             </>
//           )}
//         </div>
//       )}

//       {/* LINK / OTHER — always show plain link input */}
//       {!uploadCfg.canUpload && (
//         <FormField
//           control={control}
//           name={`materials.${index}.url`}
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel className="text-xs">Link</FormLabel>
//               <FormControl>
//                 <Input placeholder="Paste link here" {...field} />
//               </FormControl>
//               <FormMessage />
//               {currentUrl && (
//                 <UrlPreview url={currentUrl} type={currentType ?? ""} />
//               )}
//             </FormItem>
//           )}
//         />
//       )}
//     </div>
//   );
// }

// // ─── LessonForm ──────────────────────────────────────────────────────────────

// interface LessonFormProps {
//   initialValues?: Partial<Lesson>;
//   onSubmit: (values: LessonPayload, mode: SubmitMode) => void;
//   loading?: boolean;
//   isEdit?: boolean;
//   onCancel?: () => void;
// }

// export function LessonForm({
//   initialValues,
//   onSubmit,
//   loading = false,
//   isEdit = false,
//   onCancel,
// }: LessonFormProps) {
//   const form = useForm<FormValues>({
//     resolver: zodResolver(schema),
//     defaultValues: {
//       title: initialValues?.title ?? "",
//       content: initialValues?.content ?? "",
//       materials:
//         initialValues?.materials?.map((m) => ({
//           title: m.title,
//           type: m.type,
//           url: m.url,
//         })) ?? [],
//     },
//   });

//   const { fields, append, remove } = useFieldArray({
//     control: form.control,
//     name: "materials",
//   });

//   const handlePut = form.handleSubmit((values) => {
//     onSubmit(values as LessonPayload, isEdit ? "put" : "create");
//   });

//   return (
//     <Form {...form}>
//       <form className="space-y-4">
//         {/* Title */}
//         <FormField
//           control={form.control}
//           name="title"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Lesson Title</FormLabel>
//               <FormControl>
//                 <Input placeholder="e.g. Introduction to Algebra" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* Content */}
//         <FormField
//           control={form.control}
//           name="content"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Content</FormLabel>
//               <FormControl>
//                 <Textarea
//                   placeholder="Write lesson content here..."
//                   className="resize-none"
//                   rows={4}
//                   {...field}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* Materials */}
//         <div className="space-y-3">
//           <div className="flex items-center justify-between">
//             <FormLabel>Materials</FormLabel>
//             <Button
//               type="button"
//               variant="outline"
//               size="sm"
//               onClick={() => append({ title: "", type: "PDF", url: "" })}
//             >
//               <PlusCircle className="mr-1 h-3.5 w-3.5" />
//               Add Material
//             </Button>
//           </div>

//           {fields.map((field, index) => (
//             <MaterialRow
//               key={field.id}
//               index={index}
//               control={form.control}
//               onRemove={() => remove(index)}
//               setValue={form.setValue}
//             />
//           ))}
//         </div>

//         {/* Footer buttons */}
//         <div className="flex gap-2 pt-2 justify-end">
//           {onCancel && (
//             <Button type="button" variant="outline" onClick={onCancel}>
//               Cancel
//             </Button>
//           )}
//           {isEdit ? (
//             <Button type="button" onClick={handlePut} disabled={loading}>
//               {loading ? <Loader2 className="animate-spin" /> : <Save />}
//               Save All
//             </Button>
//           ) : (
//             <Button type="button" onClick={handlePut} disabled={loading}>
//               Submit
//               <PlusCircle className="ml-2" />
//             </Button>
//           )}
//         </div>
//       </form>
//     </Form>
//   );
// }





"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, useWatch, Control } from "react-hook-form";
import { useEffect, useState, useRef } from "react";
import * as z from "zod";
import { Button } from "@/core/components/ui/button";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/core/components/ui/form";
import { Input } from "@/core/components/ui/input";
import { Textarea } from "@/core/components/ui/textarea";
import { Switch } from "@/core/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/core/components/ui/select";
import {
  Loader2, Save, PlusCircle, Trash2, FileText, Video,
  Link2, Image, File, HelpCircle, ExternalLink, UploadCloud,
} from "lucide-react";
import { Lesson } from "../types/lesson.types";

const materialSchema = z.object({
  title: z.string().min(1, "Title required"),
  type:  z.string().min(1, "Type required"),
  url:   z.string().min(1, "URL is required — upload a file or paste a link"),
});

const schema = z.object({
  title:       z.string().min(2, "Minimum 2 characters"),
  content:     z.string().min(10, "Minimum 10 characters"),
  classId:     z.string().min(1, "Please select a class"),
  subjectId:   z.string().min(1, "Please select a subject"),
  teacherId:   z.string().min(1, "Please select a teacher"),
  isPublished: z.boolean(),
  materials:   z.array(materialSchema).optional(),
});

type FormValues = z.infer<typeof schema>;
export type SubmitMode = "create" | "put" | "patch";
type LessonPayload = Partial<Lesson>;

const MATERIAL_TYPES = ["PDF", "VIDEO", "LINK", "IMAGE", "DOCUMENT"];

const MATERIAL_META: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  PDF:      { icon: <FileText className="h-4 w-4" />, color: "text-red-500",    label: "PDF Document" },
  VIDEO:    { icon: <Video    className="h-4 w-4" />, color: "text-blue-500",   label: "Video"        },
  LINK:     { icon: <Link2    className="h-4 w-4" />, color: "text-green-500",  label: "Link"         },
  IMAGE:    { icon: <Image    className="h-4 w-4" />, color: "text-purple-500", label: "Image"        },
  DOCUMENT: { icon: <File     className="h-4 w-4" />, color: "text-yellow-600", label: "Document"     },
};

function MaterialTypeBadge({ type }: { type: string }) {
  const meta = MATERIAL_META[type] ?? { icon: <HelpCircle className="h-4 w-4" />, color: "text-gray-400", label: type };
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${meta.color}`}>
      {meta.icon}{meta.label}
    </span>
  );
}

function UrlPreview({ url, type }: { url: string; type: string }) {
  if (!url) return null;
  const meta = MATERIAL_META[type] ?? { icon: <HelpCircle className="h-4 w-4" />, color: "text-gray-400" };
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 mt-1.5 text-xs font-medium underline underline-offset-2 ${meta.color} hover:opacity-75`}>
      {meta.icon}
      <span className="max-w-[260px] truncate">{url}</span>
      <ExternalLink className="h-3 w-3 shrink-0" />
    </a>
  );
}

const UPLOAD_CONFIG: Record<string, { accept: string; canUpload: boolean }> = {
  IMAGE:    { accept: "image/*",                      canUpload: true  },
  VIDEO:    { accept: "video/*",                      canUpload: true  },
  PDF:      { accept: ".pdf",                         canUpload: true  },
  DOCUMENT: { accept: ".doc,.docx,.ppt,.pptx,.xlsx", canUpload: true  },
  LINK:     { accept: "",                             canUpload: false },
};

interface MaterialRowProps {
  index: number;
  control: Control<FormValues>;
  onRemove: () => void;
  setValue: (name: any, value: any, options?: any) => void;
}

function MaterialRow({ index, control, onRemove, setValue }: MaterialRowProps) {
  const currentType  = useWatch({ control, name: `materials.${index}.type` });
  const currentUrl   = useWatch({ control, name: `materials.${index}.url`  });
  const [uploading, setUploading]     = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadCfg    = UPLOAD_CONFIG[currentType ?? "LINK"] ?? UPLOAD_CONFIG["LINK"];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/lessons/upload", { method: "POST", body: fd });
      const contentType = res.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) throw new Error("Upload route not found");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
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
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Material {index + 1}</p>
          {currentType && <MaterialTypeBadge type={currentType} />}
        </div>
        <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={onRemove}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FormField control={control} name={`materials.${index}.title`} render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs">Title</FormLabel>
            <FormControl><Input placeholder="e.g. Chapter 1 PDF" {...field} /></FormControl>
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
                {MATERIAL_TYPES.map((t) => {
                  const meta = MATERIAL_META[t];
                  return (
                    <SelectItem key={t} value={t}>
                      <span className={`inline-flex items-center gap-1.5 ${meta.color}`}>{meta.icon}{t}</span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />
      </div>

      {uploadCfg.canUpload && currentType !== "VIDEO" && (
        <>
          <p className="text-xs text-muted-foreground mb-1.5">Upload file</p>
          {currentUrl && !uploadError ? (
            <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">
              <span>✅ File uploaded</span>
              <button type="button" className="ml-auto text-xs underline text-muted-foreground"
                onClick={() => { setValue(`materials.${index}.url`, "", { shouldValidate: true }); }}>
                Remove
              </button>
            </div>
          ) : (
            <label className="cursor-pointer">
              <div className={`flex items-center gap-2 rounded-md border border-dashed px-3 py-2 text-xs ${uploading ? "border-muted text-muted-foreground" : "border-gray-300 hover:border-gray-400"}`}>
                {uploading ? <><Loader2 className="h-3.5 w-3.5 animate-spin" />Uploading...</> : <><UploadCloud className="h-3.5 w-3.5" />Click to upload</>}
              </div>
              <input ref={fileInputRef} type="file" accept={uploadCfg.accept} className="hidden" disabled={uploading} onChange={handleFileChange} />
            </label>
          )}
          {uploadError && <p className="text-xs text-destructive mt-1">{uploadError}</p>}
          {!currentUrl && (
            <>
              <p className="text-xs text-muted-foreground mt-1.5 mb-1">— or paste a link —</p>
              <FormField control={control} name={`materials.${index}.url`} render={({ field }) => (
                <FormItem>
                  <FormControl><Input placeholder="Paste link here" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </>
          )}
          {currentUrl && <UrlPreview url={currentUrl} type={currentType ?? ""} />}
        </>
      )}

      {(currentType === "VIDEO" || !uploadCfg.canUpload) && (
        <FormField control={control} name={`materials.${index}.url`} render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs">{currentType === "VIDEO" ? "Video Link" : "Link"}</FormLabel>
            <FormControl>
              <Input placeholder={currentType === "VIDEO" ? "Paste YouTube / Drive / Vimeo link" : "Paste link here"} {...field} />
            </FormControl>
            <FormMessage />
            {currentUrl && <UrlPreview url={currentUrl} type={currentType ?? ""} />}
          </FormItem>
        )} />
      )}
    </div>
  );
}

interface ClassOption   { id: string; name: string }
interface SubjectOption { id: string; name: string }
interface TeacherOption { id: string; username: string }

interface LessonFormProps {
  initialValues?: Partial<Lesson>;
  onSubmit: (values: LessonPayload, mode: SubmitMode) => void;
  loading?: boolean;
  isEdit?: boolean;
  onCancel?: () => void;
}

export function LessonForm({ initialValues, onSubmit, loading = false, isEdit = false, onCancel }: LessonFormProps) {
  const [classes,  setClasses]  = useState<ClassOption[]>([]);
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [teachers, setTeachers] = useState<TeacherOption[]>([]);

  useEffect(() => {
    fetch("/api/classes").then(r => r.json()).then(d => setClasses(Array.isArray(d) ? d : [])).catch(() => setClasses([]));
    fetch("/api/subjects").then(r => r.json()).then(d => setSubjects(Array.isArray(d) ? d : [])).catch(() => setSubjects([]));
    fetch("/api/teachers").then(r => r.json()).then(d => setTeachers(Array.isArray(d) ? d : [])).catch(() => setTeachers([]));
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title:       initialValues?.title       ?? "",
      content:     initialValues?.content     ?? "",
      classId:     initialValues?.classId     ?? "",
      subjectId:   initialValues?.subjectId   ?? "",
      teacherId:   initialValues?.teacherId   ?? "",
      isPublished: initialValues?.isPublished ?? false,
      materials:   initialValues?.materials?.map(m => ({ title: m.title, type: m.type, url: m.url })) ?? [],
    },
  });

  useEffect(() => {
    form.reset({
      title:       initialValues?.title       ?? "",
      content:     initialValues?.content     ?? "",
      classId:     initialValues?.classId     ?? "",
      subjectId:   initialValues?.subjectId   ?? "",
      teacherId:   initialValues?.teacherId   ?? "",
      isPublished: initialValues?.isPublished ?? false,
      materials:   initialValues?.materials?.map(m => ({ title: m.title, type: m.type, url: m.url })) ?? [],
    });
  }, [initialValues]);

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "materials" });

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit(values as LessonPayload, isEdit ? "put" : "create");
  });

  return (
    <Form {...form}>
      <form className="space-y-4">
        <FormField control={form.control} name="title" render={({ field }) => (
          <FormItem>
            <FormLabel>Lesson Title</FormLabel>
            <FormControl><Input placeholder="e.g. Introduction to Algebra" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="content" render={({ field }) => (
          <FormItem>
            <FormLabel>Content</FormLabel>
            <FormControl>
              <Textarea placeholder="Write lesson content here..." className="resize-none" rows={4} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField control={form.control} name="classId" render={({ field }) => (
            <FormItem>
              <FormLabel>Class</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger></FormControl>
                <SelectContent>
                  {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="subjectId" render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger></FormControl>
                <SelectContent>
                  {subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="teacherId" render={({ field }) => (
            <FormItem>
              <FormLabel>Teacher</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select teacher" /></SelectTrigger></FormControl>
                <SelectContent>
                  {teachers.map(t => <SelectItem key={t.id} value={t.id}>{t.username}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="isPublished" render={({ field }) => (
          <FormItem className="flex items-center gap-3">
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <FormLabel className="mt-0">Publish (visible to students)</FormLabel>
          </FormItem>
        )} />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <FormLabel>Materials</FormLabel>
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
          <Button type="button" onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : isEdit ? <Save className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
            {isEdit ? "Save All" : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}