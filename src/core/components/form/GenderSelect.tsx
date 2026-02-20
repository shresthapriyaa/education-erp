"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import { Usersex } from "@/generated/prisma/enums";
import { cn } from "@/core/lib/utils"; // assuming you have cn helper

interface GenderSelectProps {
  value?: Usersex | null;
  onChange?: (value: Usersex) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  error?: boolean; // for form validation red border
}

const genderOptions: Array<{ label: string; value: Usersex }> = [
  { label: "Male", value: Usersex.MALE },
  { label: "Female", value: Usersex.FEMALE },
  // Add more later if needed, e.g.:
  // { label: "Other", value: Usersex.OTHER },
  // { label: "Prefer not to say", value: Usersex.PREFER_NOT_TO_SAY },
];

export function GenderSelect({
  value,
  onChange,
  placeholder = "Select gender",
  disabled = false,
  className,
  triggerClassName,
  error = false,
}: GenderSelectProps) {
  return (
    <Select
      value={value ?? undefined}
      onValueChange={(val) => onChange?.(val as Usersex)}
      disabled={disabled}
    >
      <SelectTrigger
        className={cn(
          "w-full",
          error && "border-destructive focus:ring-destructive",
          triggerClassName,
          className
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        {genderOptions.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="capitalize"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}