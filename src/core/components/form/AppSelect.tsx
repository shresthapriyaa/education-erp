"use client";

import * as React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/components/ui/select";
import { Label } from "@/core/components/ui/label";

interface Option {
  label: string;
  value: string;
}

interface AppSelectProps {
  label: string;
  name: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  error?: string;
}

export const AppSelect: React.FC<AppSelectProps> = ({ label, name, options, value, onChange, error }) => {
  return (
    <div className="mb-4">
      <Label htmlFor={name}>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={name}>
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};
