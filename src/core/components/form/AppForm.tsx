// src/core/components/form/AppForm.tsx
import { Form } from "@/core/components/ui/form";
import { ReactNode } from 'react';

interface AppFormProps {
  children: ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
}

export const AppForm = ({ children, onSubmit, className }: AppFormProps) => {
  return (
    <form onSubmit={onSubmit} className={className}>
      {children}
    </form>
  );
};