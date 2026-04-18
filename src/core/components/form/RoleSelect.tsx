"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import { $Enums } from "@/generated/prisma/client";
import { cn } from "@/core/lib/utils"; // assuming you have cn helper

interface RoleSelectProps {
  value?: $Enums.Role | null;
  onChange?: (value: $Enums.Role) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  error?: boolean; // for red border when form field has error
}

const roleOptions: Array<{ label: string; value: $Enums.Role }> = [
  { label: "Admin", value: $Enums.Role.ADMIN },
  { label: "Teacher", value: $Enums.Role.TEACHER },
  { label: "Student", value: $Enums.Role.STUDENT },
  { label: "Parent", value: $Enums.Role.PARENT },
  { label: "Accountant", value: $Enums.Role.ACCOUNTANT },
];

export function RoleSelect({
  value,
  onChange,
  placeholder = "Select role",
  disabled = false,
  className,
  triggerClassName,
  error = false,
}: RoleSelectProps) {
  return (
    <Select
      value={value ?? undefined}
      onValueChange={(val) => onChange?.(val as $Enums.Role)}
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
        {roleOptions.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="capitalize font-medium"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}