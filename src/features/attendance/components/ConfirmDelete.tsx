// "use client";



// import { useState } from "react";
// import {
//   AlertDialog, AlertDialogAction, AlertDialogCancel,
//   AlertDialogContent, AlertDialogDescription,
//   AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
// } from "@/core/components/ui/alert-dialog";
// import { Loader2 } from "lucide-react";
// import type { AttendanceDTO } from "../types/attendance.types";

// interface ConfirmDeleteProps {
//   open:         boolean;
//   onOpenChange: (open: boolean) => void;
//   record:       AttendanceDTO | null;
//   onConfirm:    (id: string) => Promise<void>;
// }

// export function ConfirmDelete({ open, onOpenChange, record, onConfirm }: ConfirmDeleteProps) {
//   const [deleting, setDeleting] = useState(false);

//   if (!record) return null;

//   const handleConfirm = async () => {
//     setDeleting(true);
//     try {
//       await onConfirm(record.id);
//       onOpenChange(false);
//     } finally {
//       setDeleting(false);
//     }
//   };

//   return (
//     <AlertDialog open={open} onOpenChange={onOpenChange}>
//       <AlertDialogContent>
//         <AlertDialogHeader>
//           <AlertDialogTitle>Delete Attendance Record</AlertDialogTitle>
//           <AlertDialogDescription asChild>
//             <div className="space-y-3 text-sm text-muted-foreground">
//               <p>You are about to permanently delete this record:</p>
//               <div className="rounded-lg bg-muted/40 px-4 py-3 space-y-1 text-foreground">
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Student</span>
//                   <span className="font-medium">{record.student.username}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Class</span>
//                   <span className="font-medium">{record.session?.class.name ?? "—"}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Date</span>
//                   <span className="font-medium tabular-nums">
//                     {new Date(record.date).toLocaleDateString([], {
//                       weekday: "short", month: "short", day: "numeric",
//                     })}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Status</span>
//                   <span className="font-medium">{record.status}</span>
//                 </div>
//               </div>
//               <p className="text-destructive font-medium">This action cannot be undone.</p>
//             </div>
//           </AlertDialogDescription>
//         </AlertDialogHeader>
//         <AlertDialogFooter>
//           <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
//           <AlertDialogAction
//             onClick={handleConfirm}
//             disabled={deleting}
//             className="bg-destructive hover:bg-destructive/90"
//           >
//             {deleting
//               ? <><Loader2 size={13} className="mr-2 animate-spin" /> Deleting…</>
//               : "Delete Record"
//             }
//           </AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// }
"use client";

import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription,
} from "@/core/components/ui/dialog";
import { Button }  from "@/core/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";

interface ConfirmDeleteProps {
  open:         boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm:    () => Promise<void>;
  loading?:     boolean;
  title?:       string;
  description?: string;
}

export function ConfirmDelete({
  open,
  onOpenChange,
  onConfirm,
  loading = false,
  title       = "Delete Record",
  description = "Are you sure you want to delete this attendance record? This action cannot be undone.",
}: ConfirmDeleteProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 size={18} />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading
              ? <><Loader2 size={14} className="mr-2 animate-spin" /> Deleting…</>
              : <><Trash2 size={14} className="mr-2" /> Delete</>
            }
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}