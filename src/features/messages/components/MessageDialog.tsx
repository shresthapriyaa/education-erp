// "use client";

// import {
//   Dialog, DialogContent, DialogHeader, DialogTitle,
// } from "@/core/components/ui/dialog";
// import { MessageForm } from "./MessageForm";

// interface MessageDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   onSubmit: (values: { receiverId: string; content: string }) => void;
//   loading?: boolean;
// }

// export function MessageDialog({
//   open, onOpenChange, onSubmit, loading = false,
// }: MessageDialogProps) {
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-lg">
//         <DialogHeader>
//           <DialogTitle>Send Message</DialogTitle>
//         </DialogHeader>
//         <MessageForm
//           onSubmit={onSubmit}
//           loading={loading}
//           onCancel={() => onOpenChange(false)}
//         />
//       </DialogContent>
//     </Dialog>
//   );
// }



"use client";

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/core/components/ui/dialog";
import { MessageForm } from "./MessageForm";

interface MessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: { receiverId: string; content: string }) => void;
  loading?: boolean;
  initialData?: { receiverId: string; content: string };
}

export function MessageDialog({
  open, onOpenChange, onSubmit, loading = false, initialData,
}: MessageDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Message" : "Send Message"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Update the message content." : "Compose and send a message to a recipient."}
          </DialogDescription>
        </DialogHeader>
        <MessageForm
          onSubmit={onSubmit}
          loading={loading}
          onCancel={() => onOpenChange(false)}
          initialData={initialData}
        />
      </DialogContent>
    </Dialog>
  );
}