// "use client";

// import {
//   Dialog, DialogContent, DialogHeader, DialogTitle,
// } from "@/core/components/ui/dialog";
// import { AnnouncementForm, SubmitMode } from "./AnnouncementForm";
// import { Announcement } from "../types/announcement.types";

// type AnnouncementPayload = Partial<Announcement>;

// interface AnnouncementDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   initialValues?: Partial<Announcement>;
//   onSubmit: (values: AnnouncementPayload, mode: SubmitMode) => void;
//   loading?: boolean;
//   isEdit?: boolean;
// }

// export function AnnouncementDialog({
//   open, onOpenChange, initialValues, onSubmit, loading = false, isEdit = false,
// }: AnnouncementDialogProps) {
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-lg">
//         <DialogHeader>
//           <DialogTitle>{isEdit ? "Edit Announcement" : "Add Announcement"}</DialogTitle>
//         </DialogHeader>
//         <AnnouncementForm
//           initialValues={initialValues}
//           onSubmit={onSubmit}
//           loading={loading}
//           isEdit={isEdit}
//           onCancel={() => onOpenChange(false)}
//         />
//       </DialogContent>
//     </Dialog>
//   );
// }\\\\\




"use client";

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/core/components/ui/dialog";
import { AnnouncementForm, SubmitMode } from "./AnnouncementForm";
import { Announcement } from "../types/announcement.types";

type AnnouncementPayload = Partial<Announcement>;

interface AnnouncementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<Announcement>;
  onSubmit: (values: AnnouncementPayload, mode: SubmitMode) => void;
  loading?: boolean;
  isEdit?: boolean;
}

export function AnnouncementDialog({
  open, onOpenChange, initialValues, onSubmit, loading = false, isEdit = false,
}: AnnouncementDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Announcement" : "Add Announcement"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update announcement details below." : "Fill in the details to create a new announcement."}
          </DialogDescription>
        </DialogHeader>
        <AnnouncementForm
          initialValues={initialValues}
          onSubmit={onSubmit}
          loading={loading}
          isEdit={isEdit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}