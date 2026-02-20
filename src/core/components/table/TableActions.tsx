import { Button } from "@/core/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/core/components/ui/tooltip";
import { ReactNode } from "react";

export interface TableAction {
  icon: ReactNode;
  tooltip: string;
  onClick: () => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  disabled?: boolean;
}

interface TableActionsProps {
  actions: TableAction[];
}

export const TableActions = ({ actions }: TableActionsProps) => {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-1">
        {actions.map((action, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Button
                variant={action.variant || "ghost"}
                size="icon"
                onClick={action.onClick}
                disabled={action.disabled}
                className="h-8 w-8"
              >
                {action.icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{action.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};