
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/core/components/ui/alert-dialog";

// interface ConfirmDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   title: string;
//   description: string;
//   onConfirm: () => void;
//   confirmText?: string;
//   cancelText?: string;
//   variant?: "default" | "destructive";
// }

// export const ConfirmDialog = ({
//   open,
//   onOpenChange,
//   title,
//   description,
//   onConfirm,
//   confirmText = "Confirm",
//   cancelText = "Cancel",
//   variant = "destructive"
// }: ConfirmDialogProps) => {
//   return (
//     <AlertDialog open={open} onOpenChange={onOpenChange}>
//       <AlertDialogContent>
//         <AlertDialogHeader>
//           <AlertDialogTitle>{title}</AlertDialogTitle>
//           <AlertDialogDescription>{description}</AlertDialogDescription>
//         </AlertDialogHeader>
//         <AlertDialogFooter>
//           <AlertDialogCancel>{cancelText}</AlertDialogCancel>
//           <AlertDialogAction 
//             onClick={onConfirm}
//             className={variant === "destructive" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
//           >
//             {confirmText}
//           </AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// };







"use client";

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
import { cn } from "@/core/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive" | "outline";
  isLoading?: boolean;
  confirmIcon?: React.ReactNode; // e.g. <Trash2 className="h-4 w-4" />
  className?: string;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "destructive",
  isLoading = false,
  confirmIcon,
  className,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className={cn("sm:max-w-[425px]", className)}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-sm">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-3 sm:gap-4">
          <AlertDialogCancel disabled={isLoading} className="min-w-[100px]">
            {cancelText}
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={(e) => {
              // Prevent closing dialog if loading (optional behavior)
              if (isLoading) {
                e.preventDefault();
                return;
              }
              onConfirm();
            }}
            disabled={isLoading}
            className={cn(
              "min-w-[100px] gap-2",
              variant === "destructive" &&
                "bg-destructive text-destructive-foreground hover:bg-destructive/90",
              variant === "outline" && "border border-input hover:bg-accent",
              isLoading && "opacity-70 cursor-not-allowed"
            )}
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {confirmIcon}
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}