// "use client"

// import * as React from "react"
// import { Switch as SwitchPrimitive } from "radix-ui"
// import { cn } from "@/core/lib/utils"

// function Switch({
//   className,
//   size = "default",
//   ...props
// }: React.ComponentProps<typeof SwitchPrimitive.Root> & {
//   size?: "sm" | "default"
// }) {
//   return (
//     <SwitchPrimitive.Root
//       data-slot="switch"
//       data-size={size}
//       className={cn(
//         "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 group/switch inline-flex shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
//         size === "default" ? "h-[1.15rem] w-8" : "h-3.5 w-6",
//         className
//       )}
//       {...props}
//     >
//       <SwitchPrimitive.Thumb
//         data-slot="switch-thumb"
//         className={cn(
//           "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0",
//           size === "default" ? "size-4" : "size-3"
//         )}
//       />
//     </SwitchPrimitive.Root>
//   )
// }

// export { Switch }



"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"
import { cn } from "@/core/lib/utils"

function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "group/switch inline-flex shrink-0 items-center rounded-full border border-foreground/20 shadow-xs transition-all outline-none",
        "data-[state=unchecked]:bg-foreground/15 data-[state=checked]:bg-primary",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        size === "default" ? "h-5 w-10" : "h-3.5 w-6",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block rounded-full shadow-sm ring-0 transition-transform",
          "data-[state=unchecked]:bg-foreground/60 data-[state=checked]:bg-primary-foreground",
          "data-[state=unchecked]:translate-x-[2px]",
          size === "default"
            ? "size-4 data-[state=checked]:translate-x-[22px]"
            : "size-2.5 data-[state=checked]:translate-x-[10px]"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }

