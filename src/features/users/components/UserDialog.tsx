// // "use client";

// // import { useState } from "react";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogHeader,
// //   DialogTitle,
// //   DialogDescription,
// // } from "@/core/components/ui/dialog";
// // import {
// //   AlertDialog,
// //   AlertDialogAction,
// //   AlertDialogCancel,
// //   AlertDialogContent,
// //   AlertDialogDescription,
// //   AlertDialogFooter,
// //   AlertDialogHeader,
// //   AlertDialogTitle,
// // } from "@/core/components/ui/alert-dialog";
// // import { Loader2 } from "lucide-react";
// // import { UserForm, SubmitMode } from "./UserForm";
// // import { User } from "../types/user.types";

// // interface UserDialogProps {
// //   open: boolean;
// //   onOpenChange: (open: boolean) => void;
// //   initialValues?: User;
// //   onSubmit: (values: Partial<User> & { password?: string }, mode: SubmitMode) => Promise<void>;
// //   loading?: boolean;
// //   isEdit?: boolean;
// // }

// // type Pending = {
// //   values: Partial<User> & { password?: string };
// //   mode: SubmitMode;
// // } | null;

// // export function UserDialog({
// //   open,
// //   onOpenChange,
// //   initialValues,
// //   onSubmit,
// //   loading = false,
// //   isEdit = false,
// // }: UserDialogProps) {
// //   const [pending, setPending] = useState<Pending>(null);

// //   const handleFormSubmit = (
// //     values: Partial<User> & { password?: string },
// //     mode: SubmitMode,
// //   ) => setPending({ values, mode });

// //   const handleConfirm = async () => {
// //     if (!pending) return;
// //     await onSubmit(pending.values, pending.mode);
// //     setPending(null);
// //   };

// //   const changedCount = pending ? Object.keys(pending.values).length : 0;
// //   const noChanges    = pending?.mode === "patch" && changedCount === 0;

// //   const confirmTitle =
// //     pending?.mode === "put"   ? "Replace all fields?"       :
// //     pending?.mode === "patch" ? "Save only changed fields?" :
// //                                 "Create new user?";

// //   const confirmDesc =
// //     pending?.mode === "put"
// //       ? `This sends a PUT request and overwrites all fields for "${initialValues?.username}".`
// //       : pending?.mode === "patch"
// //       ? noChanges
// //         ? "No changes detected — nothing will be sent."
// //         : `This sends a PATCH request updating ${changedCount} field${changedCount !== 1 ? "s" : ""} for "${initialValues?.username}".`
// //       : "A new user account will be created with the provided details.";

// //   return (
// //     <>
// //       {/* ── Main Dialog ── */}
// //       <Dialog open={open} onOpenChange={onOpenChange}>
// //         <DialogContent className="sm:max-w-lg">
// //           {/* White header — matches screenshot */}
// //           <DialogHeader>
// //             <DialogTitle className="text-2xl font-bold text-black dark:text-white">
// //               {isEdit ? "Edit User" : "Add New User"}
// //             </DialogTitle>
// //             <DialogDescription className="text-black/70 dark:text-gray-400">
// //               {isEdit
// //                 ? `Make changes to ${initialValues?.username ?? "this user"}. Click save when you're done.`
// //                 : "Fill in the details below. Click submit when you're done."}
// //             </DialogDescription>
// //           </DialogHeader>

// //           {/* Dark form card */}
// //           <div className="mt-2">
// //             <UserForm
// //               initialValues={initialValues}
// //               onSubmit={handleFormSubmit}
// //               loading={loading}
// //               isEdit={isEdit}
// //               onCancel={() => onOpenChange(false)}
// //             />
// //           </div>
// //         </DialogContent>
// //       </Dialog>

// //       {/* ── Confirm AlertDialog ── */}
// //       <AlertDialog
// //         open={pending !== null}
// //         onOpenChange={(o) => { if (!o) setPending(null); }}
// //       >
// //         <AlertDialogContent>
// //           <AlertDialogHeader>
// //             <AlertDialogTitle>{confirmTitle}</AlertDialogTitle>
// //             <AlertDialogDescription>{confirmDesc}</AlertDialogDescription>
// //           </AlertDialogHeader>
// //           <AlertDialogFooter>
// //             <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
// //             {!noChanges && (
// //               <AlertDialogAction onClick={handleConfirm} disabled={loading}>
// //                 {loading && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
// //                 Confirm
// //               </AlertDialogAction>
// //             )}
// //           </AlertDialogFooter>
// //         </AlertDialogContent>
// //       </AlertDialog>
// //     </>
// //   );
// // }





"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/core/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/core/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { UserForm, SubmitMode } from "./UserForm";
import { User } from "../types/user.types";

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: User;
  onSubmit: (values: Partial<User> & { password?: string }, mode: SubmitMode) => Promise<void>;
  loading?: boolean;
  isEdit?: boolean;
}

type Pending = {
  values: Partial<User> & { password?: string };
  mode: SubmitMode;
} | null;

export function UserDialog({
  open,
  onOpenChange,
  initialValues,
  onSubmit,
  loading = false,
  isEdit = false,
}: UserDialogProps) {
  const [pending, setPending] = useState<Pending>(null);

  const handleFormSubmit = (
    values: Partial<User> & { password?: string },
    mode: SubmitMode,
  ) => setPending({ values, mode });

  const handleConfirm = async () => {
    if (!pending) return;
    await onSubmit(pending.values, pending.mode);
    setPending(null);
  };

  const changedCount = pending ? Object.keys(pending.values).length : 0;
  const noChanges    = pending?.mode === "patch" && changedCount === 0;

  const confirmTitle =
    pending?.mode === "put"   ? "Replace all fields?"       :
    pending?.mode === "patch" ? "Save only changed fields?" :
                                "Create new user?";

  const confirmDesc =
    pending?.mode === "put"
      ? `This sends a PUT request and overwrites all fields for "${initialValues?.username}".`
      : pending?.mode === "patch"
      ? noChanges
        ? "No changes detected — nothing will be sent."
        : `This sends a PATCH request updating ${changedCount} field${changedCount !== 1 ? "s" : ""} for "${initialValues?.username}".`
      : "A new user account will be created with the provided details.";

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {isEdit ? "Edit User" : "Add New User"}
            </DialogTitle>
            <DialogDescription className="text-sm">
              {isEdit
                ? `Make changes to ${initialValues?.username ?? "this user"}. Click save when you're done.`
                : "Fill in the details below. Click submit when you're done."}
            </DialogDescription>
          </DialogHeader>

          <UserForm
            initialValues={initialValues}
            onSubmit={handleFormSubmit}
            loading={loading}
            isEdit={isEdit}
            onCancel={() => onOpenChange(false)}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={pending !== null}
        onOpenChange={(o) => { if (!o) setPending(null); }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>{confirmDesc}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            {!noChanges && (
              <AlertDialogAction onClick={handleConfirm} disabled={loading}>
                {loading && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                Confirm
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}







