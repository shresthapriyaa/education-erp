"use client";

import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/core/components/ui/dialog";
import { Button } from "@/core/components/ui/button";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/core/components/ui/select";
import { Loader2 } from "lucide-react";

interface ClassOption {
  id: string;
  name: string;
  teacher: { username: string };
}

interface BulkAssignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCount: number;
  classes: ClassOption[];
  onAssign: (classId: string) => Promise<void>;
}

export function BulkAssignDialog({
  open,
  onOpenChange,
  selectedCount,
  classes,
  onAssign,
}: BulkAssignDialogProps) {
  const [classId, setClassId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!classId) return;
    setLoading(true);
    try {
      await onAssign(classId);
      setClassId("");
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Assign Students to Class</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Assigning{" "}
          <span className="font-semibold text-black">
            {selectedCount} student(s)
          </span>{" "}
          to a class.
        </p>

        <Select
          onValueChange={setClassId}
          value={classId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a class..." />
          </SelectTrigger>
          <SelectContent>
            {classes.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No classes found
              </div>
            ) : (
              classes.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name} — {c.teacher?.username ?? "No teacher"}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="outline"
            onClick={() => {
              setClassId("");
              onOpenChange(false);
            }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!classId || loading}
            className="bg-black hover:bg-gray-700 text-white"
          >
            {loading && (
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
            )}
            Confirm Assign
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}