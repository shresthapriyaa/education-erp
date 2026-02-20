// src/core/components/form/AppFormItem.tsx
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/core/components/ui/form";
import { ReactNode } from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";

interface AppFormItemProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  description?: string;
  children: (field: any) => ReactNode;
}

export function AppFormItem<T extends FieldValues>({
  control,
  name,
  label,
  description,
  children,
}: AppFormItemProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>{children(field)}</FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}