
// import { Badge } from "@/core/components/ui/badge";
// import { CheckCircle2, XCircle } from "lucide-react";
// import { cn } from "@/core/lib/utils";

// interface StatusBadgeProps {
//   status: boolean | string;
//   trueLabel?: string;
//   falseLabel?: string;
//   showIcon?: boolean;
//   className?: string;
// }

// export const StatusBadge = ({ 
//   status, 
//   trueLabel = 'Active', 
//   falseLabel = 'Inactive',
//   showIcon = true,
//   className
// }: StatusBadgeProps) => {
//   const isActive = typeof status === 'boolean' ? status : status === 'true';
  
//   return (
//     <Badge 
//       variant={isActive ? "default" : "secondary"}
//       className={cn(
//         "gap-1",
//         isActive ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-gray-100 text-gray-800 hover:bg-gray-100",
//         className
//       )}
//     >
//       {showIcon && (isActive ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />)}
//       {isActive ? trueLabel : falseLabel}
//     </Badge>
//   );
// };






"use client";

import { Badge } from "@/core/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/core/lib/utils";

interface StatusBadgeProps {
  status: boolean | string | null | undefined;
  trueLabel?: string;
  falseLabel?: string;
  neutralLabel?: string;
  showIcon?: boolean;
  size?: "sm" | "default" | "lg";
  className?: string;
}

export function StatusBadge({
  status,
  trueLabel = "Active",
  falseLabel = "Inactive",
  neutralLabel = "Unknown",
  showIcon = true,
  size = "default",
  className,
}: StatusBadgeProps) {
  // Normalize status to boolean | null
  const normalizedStatus =
    status == null
      ? null
      : typeof status === "boolean"
        ? status
        : String(status).toLowerCase() === "true" ||
          status === "1" ||
          status === "active" ||
          status === "yes" ||
          status === "verified";

  const isActive = normalizedStatus === true;
  const isInactive = normalizedStatus === false;
  const isNeutral = normalizedStatus === null;

  // Size variants
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    default: "px-2.5 py-0.5 text-xs gap-1.5",
    lg: "px-3 py-1 text-sm gap-2",
  };

  // Icon size adjustment
  const iconSize = {
    sm: "h-3 w-3",
    default: "h-3.5 w-3.5",
    lg: "h-4 w-4",
  };

  return (
    <Badge
      variant={isActive ? "default" : isInactive ? "secondary" : "outline"}
      className={cn(
        "inline-flex items-center font-medium transition-colors",
        // Active
        isActive &&
          "bg-green-100 text-green-800 hover:bg-green-100/90 dark:bg-green-900/40 dark:text-green-300 dark:hover:bg-green-900/50",
        // Inactive
        isInactive &&
          "bg-red-100 text-red-800 hover:bg-red-100/90 dark:bg-red-900/40 dark:text-red-300 dark:hover:bg-red-900/50",
        // Neutral
        isNeutral &&
          "bg-gray-100 text-gray-700 hover:bg-gray-100/90 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700/70",
        sizeClasses[size],
        className
      )}
    >
      {showIcon && (
        <>
          {isActive && <CheckCircle2 className={iconSize[size]} />}
          {isInactive && <XCircle className={iconSize[size]} />}
          {isNeutral && (
            <div className={cn("rounded-full bg-gray-400", iconSize[size])} />
          )}
        </>
      )}

      {isActive ? trueLabel : isInactive ? falseLabel : neutralLabel}
    </Badge>
  );
}