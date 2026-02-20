
import { Textarea } from "@/core/components/ui/textarea";
import { TextareaHTMLAttributes } from "react";

interface AppTextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const AppTextArea = (props: AppTextAreaProps) => {
  return <Textarea {...props} />;
};