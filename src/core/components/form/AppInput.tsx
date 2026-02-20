// src/core/components/form/AppInput.tsx
import { Input } from "@/core/components/ui/input";
import { InputHTMLAttributes } from "react";

interface AppInputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const AppInput = (props: AppInputProps) => {
  return <Input {...props} />;
};