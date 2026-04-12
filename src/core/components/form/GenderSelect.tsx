"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import { UserSex } from "@/generated/prisma/enums";
import { cn } from "@/core/lib/utils";

interface GenderSelectProps {
  value?: UserSex | null;
  onChange?: (value: UserSex) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  error?: boolean;
}

const genderOptions: Array<{ label: string; value: UserSex }> = [
  { label: "Male",   value: UserSex.MALE   },
  { label: "Female", value: UserSex.FEMALE },
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
      onValueChange={(val) => onChange?.(val as UserSex)}
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
          <SelectItem key={option.value} value={option.value} className="capitalize">
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}