"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import { cn } from "@/core/lib/utils"; // assuming you have cn helper

interface BloodGroupSelectProps {
  value?: string | null;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  error?: boolean; // for form validation red border
}

const bloodGroupOptions = [
  { label: "A+", value: "A+" },
  { label: "A-", value: "A-" },
  { label: "B+", value: "B+" },
  { label: "B-", value: "B-" },
  { label: "AB+", value: "AB+" },
  { label: "AB-", value: "AB-" },
  { label: "O+", value: "O+" },
  { label: "O-", value: "O-" },
] as const;

export function BloodGroupSelect({
  value,
  onChange,
  placeholder = "Select blood group",
  disabled = false,
  className,
  triggerClassName,
  error = false,
}: BloodGroupSelectProps) {
  return (
    <Select
      value={value ?? undefined}
      onValueChange={(val) => onChange?.(val)}
      disabled={disabled}
    >
      <SelectTrigger
        className={cn(
          error && "border-destructive focus:ring-destructive",
          triggerClassName,
          className
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        {bloodGroupOptions.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="font-medium"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}